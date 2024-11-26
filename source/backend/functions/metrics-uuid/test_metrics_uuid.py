# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import os
import pytest
import crhelper

from moto import mock_aws
from mock import patch
from uuid import uuid4


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
def mocked_ssm_client():
    with mock_aws():
        ssm_client = boto3.client('ssm')
        yield ssm_client


@pytest.fixture(autouse=True)
def metrics_uuid(mocked_aws_env_vars):
    import metrics_uuid
    yield metrics_uuid


@pytest.mark.parametrize('request_type', ['Create', 'Update'])
def test_handler_creates_new_uid_if_one_does_not_exist(request_type, mocked_ssm_client, metrics_uuid):
    metrics_uuid.handler({
        'RequestType': request_type,
        'ResponseURL' : 'http://pre-signed-S3-url-for-response',
        'StackId' : 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId' : 'unique id for this create request',
        'ResourceType' : 'Custom::MetricsUuid',
        'LogicalResourceId' : 'MyTestResource',
        'ResourceProperties': {}
    }, MockContext)

    uuid = mocked_ssm_client.get_parameter(Name=metrics_uuid.metrics_parameter_name)['Parameter']['Value']

    assert metrics_uuid.helper.Data['MetricsUuid'] == uuid


@pytest.mark.parametrize('request_type', ['Create', 'Update'])
def test_handler_does_not_overwrite_uid_if_one_exists(request_type, mocked_ssm_client, metrics_uuid):
    uuid = str(uuid4())

    mocked_ssm_client.put_parameter(
        Name=metrics_uuid.metrics_parameter_name,
        Description='Unique Id for anonymous metrics collection',
        Value=uuid,
        Type='String'
    )

    metrics_uuid.handler({
        'RequestType': request_type,
        'ResponseURL' : 'http://pre-signed-S3-url-for-response',
        'StackId' : 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId' : 'unique id for this create request',
        'ResourceType' : 'Custom::MetricsUuid',
        'LogicalResourceId' : 'MyTestResource',
        'ResourceProperties': {}
    }, MockContext)

    assert mocked_ssm_client.get_parameter(Name=metrics_uuid.metrics_parameter_name)['Parameter']['Value'] == uuid
    assert metrics_uuid.helper.Data['MetricsUuid'] == uuid
