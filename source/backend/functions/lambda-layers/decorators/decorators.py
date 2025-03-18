# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import functools
import inspect
import json
import logging
import os
from copy import deepcopy
from uuid import uuid4

import boto3
import jsonschema
from botocore.exceptions import ClientError

from boto_utils import DecimalEncoder, parse_s3_url

logger = logging.getLogger()
logger.setLevel(os.getenv("LogLevel", logging.INFO))

s3 = boto3.resource("s3")


def with_logging(handler):
    """
    Decorator which performs basic logging and makes logger available on context
    """
    logging.setLogRecordFactory(LogRecord)

    @functools.wraps(handler)
    def wrapper(event, *args, **kwargs):
        logger.debug("## HANDLER: %s", handler.__name__)
        logger.debug("## ENVIRONMENT VARIABLES")
        logger.debug(json.dumps(os.environ.copy()))
        logger.debug("## EVENT")
        logger.debug("Event: %s", event)
        return handler(event, *args, **kwargs)

    return wrapper


def json_body_loader(handler):
    """
    Decorator which loads the JSON body of a request
    """
    @functools.wraps(handler)
    def wrapper(event, context):
        if isinstance(event.get("body"), str):
            event["body"] = json.loads(event["body"])

        return handler(event, context)

    return wrapper


def request_validator(request_schema):
    """
    Decorator which performs JSON validation on an event
    """

    def wrapper_wrapper(handler):
        @functools.wraps(handler)
        def wrapper(to_validate, *args, **kwargs):
            try:
                jsonschema.validate(to_validate, request_schema)
            except (KeyError, jsonschema.exceptions.SchemaError) as e:
                logger.fatal("Invalid configuration: %s", str(e))
                return {
                    "statusCode": 500,
                    "body": json.dumps({
                        "Message": "Invalid configuration: {}".format(str(e)),
                    })
                }
            except jsonschema.ValidationError as exception:
                return {
                    "statusCode": 422,
                    "body": json.dumps({
                        "Message": "Invalid Request: {}".format(exception.message),
                    })
                }

            return handler(to_validate, *args, **kwargs)

        return wrapper

    return wrapper_wrapper


def catch_errors(handler):
    """
    Decorator which performs catch all exception handling
    """

    @functools.wraps(handler)
    def wrapper(event, context):
        try:
            return handler(event, context)
        except ClientError as e:
            return {
                "statusCode": e.response['ResponseMetadata'].get('HTTPStatusCode', 400),
                "body": json.dumps({
                    "Message": "Client error: {}".format(str(e)),
                })
            }
        except ValueError as e:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "Message": "Invalid request: {}".format(str(e)),
                })
            }
        except Exception as e:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "Message": "Unable to process request: {}".format(str(e)),
                })
            }

    return wrapper


def load_schema(schema_name, schema_dir=None):
    if not schema_dir:
        caller_dir = os.path.dirname(os.path.abspath((inspect.stack()[1])[1]))
        schema_dir = os.path.join(caller_dir, "schemas")

    with open(os.path.join(schema_dir, "{}.json".format(schema_name))) as f:
        return json.load(f)


def add_cors_headers(handler):
    """
    Decorator which returns standard response headers to be used on each API method
    """

    @functools.wraps(handler) 
    def wrapper(event, context): 
        resp = handler(event, context) 
        resp["headers"] = { 
           'Content-Type': 'application/json', 
           'Access-Control-Allow-Origin': os.getenv("AllowOrigin", ""), 
           **resp.get("headers", {}) 
        }

        return resp
 
    return wrapper


def s3_state_store(load_keys=[], offload_keys=[], should_offload=True, should_load=True,
                   bucket=None, prefix="state/"):
    """
    Decorator which auto (re)stores state to/from S3.
    Only dictionaries and lists can be (re)stored to/from S3
    """
    if not bucket:
        bucket = os.getenv("StateBucket")

    def _load_value(value):
        parsed_bucket, parsed_key = parse_s3_url(value)
        logger.info("Loading data from S3 key %s", parsed_key)
        obj = s3.Object(parsed_bucket, parsed_key).get()["Body"].read()
        return json.loads(obj)

    def _offload_value(value):
        key = "{}{}".format(prefix, uuid4())
        logger.info("Offloading data to S3 key %s", key)
        s3.Object(bucket, key).put(Body=json.dumps(value, cls=DecimalEncoder))
        return "s3://{}/{}".format(bucket, key)

    def load(d):
        loaded = {}

        for k, v in d.items():
            if (k in load_keys or len(load_keys) == 0) and isinstance(v, str) and v.startswith("s3://"):
                loaded[k] = _load_value(v)
            elif isinstance(v, dict):
                loaded[k] = load(v)
            else:
                loaded[k] = v
        return loaded

    def offload(d):
        offloaded = {}

        for k, v in d.items():
            if (k in offload_keys or len(offload_keys) == 0) and isinstance(v, (dict, list)):
                offloaded[k] = _offload_value(v)
            elif isinstance(v, dict):
                offloaded[k] = offload(v)
            else:
                offloaded[k] = v

        return offloaded

    def wrapper_wrapper(handler):
        @functools.wraps(handler)
        def wrapper(event, context):
            if should_load and isinstance(event, dict):
                event = load(event)

            resp = handler(event, context)

            if should_offload and isinstance(resp, dict):
                resp = offload(resp)
            return resp
        return wrapper
    return wrapper_wrapper


def sanitize_args(args):
    args = deepcopy(args)
    disallowed_keys = ["match"]
    if isinstance(args, dict):
        for k, v in args.items():
            if isinstance(k, str) and any([disallowed.lower() in k.lower() for disallowed in disallowed_keys]):
                if isinstance(v, (list, tuple)):
                    args[k] = ['*** MATCH ID ***' for _ in v]
                else:
                    args[k] = '*** MATCH ID ***'
            elif isinstance(v, (dict, list, tuple)):
                args[k] = sanitize_args(v)
        return args
    elif isinstance(args, (list, tuple)):
        is_tuple = isinstance(args, tuple)
        args = list(args)
        for i, item in enumerate(args):
            if isinstance(item, (dict, list)):
                args[i] = sanitize_args(item)
        return tuple(args) if is_tuple else args
    return args


class LogRecord(logging.LogRecord):
    def getMessage(self):
        self.args = sanitize_args(self.args)
        return super().getMessage()
