# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

from botocore.exceptions import ClientError
import boto3
import functools
import logging
import os

from crhelper import CfnResource


helper = CfnResource(json_logging=False, log_level='DEBUG',
                     boto_level='CRITICAL')

s3 = boto3.resource("s3")
client = boto3.client("s3")

logger = logging.getLogger()
logger.setLevel(os.getenv("LogLevel", logging.INFO))


def with_logging(handler):
    """
    Decorator which performs basic logging and makes logger available on context
    """

    @functools.wraps(handler)
    def wrapper(event, *args, **kwargs):
        logger.debug('## HANDLER: %s', handler.__name__)
        logger.debug('## ENVIRONMENT VARIABLES')
        logger.debug(json.dumps(os.environ.copy()))
        logger.debug('## EVENT')
        logger.debug('Event: %s', event)
        return handler(event, *args, **kwargs)

    return wrapper

@with_logging
@helper.create
@helper.update
def create(event, context):
    return None


@with_logging
@helper.delete
def delete(event, _):
    bucket_name = event['ResourceProperties']['Bucket']
    logger.info('Beginning cleanup of ' + bucket_name + '...')
    bucket = s3.Bucket(bucket_name)
    try:
        # We need to disable access logging or the access log bucket will never empty.
        # Attempting to resolve this with DependsOn attributes results in numerous
        # circular dependencies.
        client.put_bucket_logging(Bucket=bucket_name, BucketLoggingStatus={})
        bucket.objects.all().delete()
        bucket.object_versions.all().delete()
        logger.info(f'Cleanup of {bucket_name} complete.')
        return None
    except ClientError as e:
        # occasionally the bucket has been already deleted before we call put_bucket_logging
        if e.response['Error']['Code'] == 'NoSuchBucket':
            logger.info(f'{bucket_name} has already been deleted')
        else:
            raise e


def handler(event, context):
    helper(event, context)
