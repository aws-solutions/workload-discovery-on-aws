# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import botocore
import os
import pytest
import crhelper

from mock import patch
from botocore.exceptions import ClientError

orig = botocore.client.BaseClient._make_api_call

applications = {}


def mock_make_api_call(self, operation_name, kwarg):
    if operation_name == 'CreateApplication':
        resource_group_name = kwarg['ResourceGroupName']
        applications[resource_group_name] = {'ResourceGroupName': resource_group_name}
        return {'ApplicationInfo': applications[resource_group_name]}
    
    if operation_name == 'DeleteApplication':
        resource_group_name = kwarg['ResourceGroupName']
        if resource_group_name not in applications:
            raise ClientError(
                {'Error': {'Code': 'ResourceNotFoundException', 'Message': 'Application not found'}},
                operation_name
            )
        del applications[resource_group_name]
        return {}
    
    if operation_name == 'ListApplications':
        return {'ApplicationInfoList': list(applications.values())}
    
    return orig(self, operation_name, kwarg)


class MockContext(object):
    function_name = 'test-function'
    ms_remaining = 9000

    @staticmethod
    def get_remaining_time_in_millis():
        return MockContext.ms_remaining


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
def mocked_appinsights_client():
    applications.clear()
    with patch('botocore.client.BaseClient._make_api_call', new=mock_make_api_call):
        client = boto3.client('application-insights', region_name='eu-west-1')
        yield client


@pytest.fixture(autouse=True)
def remove_appinsights(mocked_aws_env_vars):
    import remove_appinsights
    yield remove_appinsights


def test_handler_deletes_application_insights_dashboard(mocked_appinsights_client, remove_appinsights):
    resource_group_name = 'test-resource-group'
    
    mocked_appinsights_client.create_application(ResourceGroupName=resource_group_name)
    
    remove_appinsights.handler({
        'RequestType': 'Create',
        'ResponseURL': 'http://pre-signed-S3-url-for-response',
        'StackId': 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId': 'unique id for this create request',
        'ResourceType': 'Custom::RemoveAppInsights',
        'LogicalResourceId': 'MyTestResource',
        'ResourceProperties': {
            'ResourceGroupName': resource_group_name
        }
    }, MockContext)
    
    apps = mocked_appinsights_client.list_applications()
    assert len(apps['ApplicationInfoList']) == 0


def test_handler_handles_non_existent_dashboard(remove_appinsights):
    remove_appinsights.handler({
        'RequestType': 'Create',
        'ResponseURL': 'http://pre-signed-S3-url-for-response',
        'StackId': 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId': 'unique id for this create request',
        'ResourceType': 'Custom::RemoveAppInsights',
        'LogicalResourceId': 'MyTestResource',
        'ResourceProperties': {
            'ResourceGroupName': 'non-existent-group'
        }
    }, MockContext)
