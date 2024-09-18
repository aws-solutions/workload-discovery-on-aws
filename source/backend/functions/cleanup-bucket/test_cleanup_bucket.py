# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import os
import pytest
import crhelper

from moto import mock_aws
from mock import patch, MagicMock


# crhelper depends on this method in the Lambda Context
class MockContext(object):
    function_name = 'test-function'
    ms_remaining = 9000

    @staticmethod
    def get_remaining_time_in_millis():
        return MockContext.ms_remaining


# crhelper will hang without mocking this
@pytest.fixture(autouse=True)
def mocked_send_response(mocker):

    real_send = crhelper.CfnResource._send

    _send_response = mocker.Mock()

    def mocked_send(self, status=None, reason='', send_response=_send_response):
        real_send(self, status, reason, send_response)

    crhelper.CfnResource._send = mocked_send

    yield _send_response

    crhelper.CfnResource._send = real_send


@pytest.fixture(autouse=True)
def mocked_aws_env_vars():
    with patch.dict(os.environ, {
        'AWS_DEFAULT_REGION': 'eu-west-1',
        'AWS_ACCESS_KEY_ID': 'mocked',
        'AWS_SECRET_ACCESS_KEY': 'mocked',
        'AWS_SECURITY_TOKEN': 'mocked',
        'AWS_SESSION_TOKEN': 'mocked',
    }):
        yield


@pytest.fixture(autouse=True)
def mocked_s3_client():
    with mock_aws():
        s3_client = boto3.client('s3')
        yield s3_client


@pytest.fixture(autouse=True)
def cleanup_bucket(mocked_aws_env_vars):
    import cleanup_bucket
    yield cleanup_bucket


def test_delete_handler_not_respond_with_error_if_bucket_does_not_exist(cleanup_bucket, mocked_send_response):
    cleanup_bucket.handler({
        'RequestType': 'Delete',
        'ResponseURL' : 'http://pre-signed-S3-url-for-response',
        'StackId' : 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId' : 'unique id for this delete request',
        'ResourceType' : 'Custom::S3BucketCleanup',
        'LogicalResourceId' : 'MyTestResource',
        'ResourceProperties': {
            'Bucket': 'non-existent-bucket'
        }
    }, MockContext)

    (_, arg_dict, _) = mocked_send_response.call_args.args
    assert arg_dict['Status'] == 'SUCCESS'


def test_delete_handler_should_empty_objects_in_bucket(mocked_s3_client, cleanup_bucket, mocked_send_response):
    bucket_name = 'my_bucket'
    mocked_s3_client.create_bucket(Bucket=bucket_name, CreateBucketConfiguration={
        'LocationConstraint': 'eu-west-1'})
    mocked_s3_client.put_object(Bucket=bucket_name, Key='my_key', Body=b'body')

    cleanup_bucket.handler({
        'RequestType': 'Delete',
        'ResponseURL' : 'http://pre-signed-S3-url-for-response',
        'StackId' : 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId' : 'unique id for this delete request',
        'ResourceType' : 'Custom::S3BucketCleanup',
        'LogicalResourceId' : 'MyTestResource',
        'ResourceProperties': {
            'Bucket': bucket_name
        }
    }, MockContext)

    (_, arg_dict, _) = mocked_send_response.call_args.args
    assert arg_dict['Status'] == 'SUCCESS'

    resp = mocked_s3_client.list_objects(Bucket=bucket_name)
    assert 'Contents' not in resp
