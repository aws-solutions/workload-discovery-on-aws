# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

from datetime import datetime, timezone, timedelta
import decimal
import logging
import json
import os
import uuid
from functools import lru_cache

import boto3
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.types import TypeDeserializer
from botocore.exceptions import ClientError


deserializer = TypeDeserializer()
logger = logging.getLogger()
logger.setLevel(logging.INFO)
batch_size = 10  # SQS Max Batch Size

ssm = boto3.client('ssm')
ddb = boto3.resource("dynamodb")
table = ddb.Table(os.getenv("JobTable", "S3F2_Jobs"))
index = os.getenv("JobTableDateGSI", "Date-GSI")
bucket_count = int(os.getenv("GSIBucketCount", 1))


def paginate(client, method, iter_keys, **kwargs):
    paginator = client.get_paginator(method.__name__)
    page_iterator = paginator.paginate(**kwargs)
    if isinstance(iter_keys, str):
        iter_keys = [iter_keys]
    for page in page_iterator:
        for key in iter_keys:
            page = page[key]
        for result in page:
            yield result


def read_queue(queue, number_to_read=10):
    msgs = []
    while len(msgs) < number_to_read:
        received = queue.receive_messages(
            MaxNumberOfMessages=min((number_to_read - len(msgs)), batch_size),
            AttributeNames=['All']
        )
        if len(received) == 0:
            break  # no messages left
        remaining = number_to_read - len(msgs)
        i = min(remaining, len(received))  # take as many as allowed from the received messages
        msgs = msgs + received[:i]
    return msgs


def batch_sqs_msgs(queue, messages, **kwargs):
    chunks = [messages[x:x + batch_size] for x in range(0, len(messages), batch_size)]
    for chunk in chunks:
        entries = [
            {
                'Id': str(uuid.uuid4()),
                'MessageBody': json.dumps(m),
                **({'MessageGroupId': str(uuid.uuid4())} if queue.attributes.get("FifoQueue", False) else {}),
                **kwargs,
            } for m in chunk
        ]
        queue.send_messages(Entries=entries)


def emit_event(job_id, event_name, event_data, emitter_id=None, created_at=None):
    if not emitter_id:
        emitter_id = str(uuid.uuid4())
    if not created_at:
        created_at = datetime.now(timezone.utc).timestamp()
    item = {
        "Id": job_id,
        "Sk": "{}#{}".format(round(created_at * 1000), str(uuid.uuid4())),
        "Type": "JobEvent",
        "EventName": event_name,
        "EventData": normalise_dates(event_data),
        "EmitterId": emitter_id,
        "CreatedAt": normalise_dates(round(created_at)),
    }
    expiry = get_job_expiry(job_id)
    if expiry:
        item["Expires"] = expiry
    table.put_item(Item=item)


@lru_cache()
def get_job_expiry(job_id):
    return table.get_item(Key={"Id": job_id, "Sk": job_id})["Item"].get("Expires", None)


def running_job_exists():
    jobs = []
    for gsi_bucket in range(0, bucket_count):
        response = table.query(
            IndexName=index,
            KeyConditionExpression=Key('GSIBucket').eq(str(gsi_bucket)),
            ScanIndexForward=False,
            FilterExpression="(#s = :r) or (#s = :q) or (#s = :c)",
            ExpressionAttributeNames={
                "#s": "JobStatus"
            },
            ExpressionAttributeValues={
                ":r": "RUNNING",
                ":q": "QUEUED",
                ":c": "FORGET_COMPLETED_CLEANUP_IN_PROGRESS",
            },
            Limit=1,
        )
        jobs += response.get("Items", [])

    return len(jobs) > 0


def get_config():
    try:
        param_name = os.getenv("ConfigParam", "S3F2-Configuration")
        return json.loads(ssm.get_parameter(Name=param_name, WithDecryption=True)["Parameter"]["Value"])
    except (KeyError, ValueError) as e:
        logger.error("Invalid configuration supplied: %s", str(e))
        raise e
    except ClientError as e:
        logger.error("Unable to retrieve config: %s", str(e))
        raise e
    except Exception as e:
        logger.error("Unknown error retrieving config: %s", str(e))
        raise e


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return round(o)
        return super(DecimalEncoder, self).default(o)


def utc_timestamp(**delta_kwargs):
    return round((datetime.now(timezone.utc) + timedelta(**delta_kwargs)).timestamp())


def convert_iso8601_to_epoch(iso_time: str):
    normalised = iso_time.strip().replace(" ", "T")
    with_ms = "." in normalised
    regex = "%Y-%m-%dT%H:%M:%S.%f%z" if with_ms else "%Y-%m-%dT%H:%M:%S%z"
    parsed = datetime.strptime(normalised, regex)
    unix_timestamp = round(parsed.timestamp())
    return unix_timestamp


def normalise_dates(data):
    if isinstance(data, str):
        try:
            return convert_iso8601_to_epoch(data)
        except ValueError:
            return data
    elif isinstance(data, list):
        return [normalise_dates(i) for i in data]
    elif isinstance(data, dict):
        return {k: normalise_dates(v) for k, v in data.items()}
    return data


def deserialize_item(item):
    return {
        k: deserializer.deserialize(v) for k, v in item.items()
    }


def parse_s3_url(s3_url):
    if not (isinstance(s3_url, str) and s3_url.startswith("s3://")):
        raise ValueError("Invalid S3 URL")
    return s3_url.replace("s3://", "").split("/", 1)
