import boto3
import functools
import logging
import os

from crhelper import CfnResource


helper = CfnResource(json_logging=False, log_level='DEBUG',
                     boto_level='CRITICAL')

s3 = boto3.resource("s3")

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
def delete(event, context):
    props = event['ResourceProperties']
    bucket = s3.Bucket(props['Bucket'])
    try:
        bucket.objects.all().delete()
        bucket.object_versions.all().delete()
    except s3.meta.client.exceptions.NoSuchBucket:
        logger.info(props['Bucket'] + ' was empty.')
        pass
    return None


def handler(event, context):
    helper(event, context)
