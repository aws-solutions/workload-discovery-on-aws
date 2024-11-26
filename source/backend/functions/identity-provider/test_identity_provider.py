# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import os
import pytest
import crhelper

from moto import mock_aws
from mock import patch, MagicMock


class MockContext(object):
    function_name: str = 'test-function'
    ms_remaining: int = 9000
    memory_limit_in_mb: int = 128
    invoked_function_arn: str = 'arn:aws:lambda:eu-west-1:123456789012:function:test'
    aws_request_id: str = '52fdfc07-2182-154f-163f-5f0f9a621d72'

    # crhelper depends on this method in the Lambda Context
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


@pytest.fixture
def identity_provider():
    with patch.dict(os.environ, {
        'AWS_DEFAULT_REGION': 'eu-west-1',
        'AWS_ACCESS_KEY_ID': 'access_key',
        'AWS_SECRET_ACCESS_KEY': 'secret_access_key'
    }):
        import identity_provider
        yield identity_provider

@pytest.fixture
def mocked_cognito_client():
    with mock_aws():
        with patch.dict(os.environ, {
            'AWS_DEFAULT_REGION': 'eu-west-1',
            'AWS_ACCESS_KEY_ID': 'access_key',
            'AWS_SECRET_ACCESS_KEY': 'secret_access_key'
        }):
            cognito_client = boto3.client('cognito-idp')
            yield cognito_client

@pytest.fixture
def mocked_secrets_manager_client():
    with mock_aws():
        with patch.dict(os.environ, {
            'AWS_DEFAULT_REGION': 'eu-west-1',
            'AWS_ACCESS_KEY_ID': 'access_key',
            'AWS_SECRET_ACCESS_KEY': 'secret_access_key'
        }):
            secrets_manager_client = boto3.client('secretsmanager')
            yield secrets_manager_client


def test_handler_creates_identity_provider(mocked_cognito_client, mocked_secrets_manager_client, identity_provider):
    create_user_pool_resp = mocked_cognito_client.create_user_pool(PoolName='pool_name')

    user_pool_id = create_user_pool_resp['UserPool']['Id']
    provider_name = 'OidcProvider'

    client_secret = 'my_secret'

    secret_manager_resp = mocked_secrets_manager_client.create_secret(
        Name='CreateTestSecret', SecretString=client_secret
    )

    client_secret_arn = secret_manager_resp['ARN']

    identity_provider.handler({
        'RequestType': 'Create',
        'ResponseURL' : 'http://pre-signed-S3-url-for-response',
        'StackId' : 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId' : 'unique id for this create request',
        'ResourceType' : 'Custom::UserPoolIdentityProvider',
        'LogicalResourceId' : 'MyTestResource',
        'ResourceProperties': {
            'UserPoolId': user_pool_id,
            'ProviderName': provider_name,
            'ProviderType': 'OIDC',
            'ClientSecretArn': client_secret_arn,
            'ProviderDetails': {
                'client_id': 'client_id'
            },
            'AttributeMapping': '{"email": "email", "given_name": "given_name"}',
            'IdpIdentifiers': ['IdpIdentifier']
        }
    }, MockContext)

    assert identity_provider.helper.Data == {'ProviderName': 'OidcProvider'}

    resp = mocked_cognito_client.describe_identity_provider(
        UserPoolId=user_pool_id,
        ProviderName='OidcProvider'
    )

    moto_identity_provider = resp['IdentityProvider']

    assert moto_identity_provider['UserPoolId'] == user_pool_id
    assert moto_identity_provider['ProviderType'] == 'OIDC'
    assert moto_identity_provider['ProviderName'] == provider_name
    assert moto_identity_provider['ProviderDetails'] == {'client_id': 'client_id', 'client_secret': client_secret}
    assert moto_identity_provider['AttributeMapping'] == {'email': 'email', 'given_name': 'given_name'}
    assert moto_identity_provider['IdpIdentifiers'] ==  ['IdpIdentifier']


def test_handler_updates_identity_provider(mocked_cognito_client, mocked_secrets_manager_client, identity_provider):
    create_user_pool_resp = mocked_cognito_client.create_user_pool(PoolName='pool_name')

    user_pool_id = create_user_pool_resp['UserPool']['Id']

    provider_name = 'OidcProviderUpdate'

    mocked_cognito_client.create_identity_provider(UserPoolId=user_pool_id,
                                                   ProviderName=provider_name,
                                                   ProviderType='OIDC',
                                                   ProviderDetails={
                                                       'client_id': 'client_id'
                                                   })

    provider_name = 'OidcProviderUpdate'

    client_secret = 'my_secret'

    secret_manager_resp = mocked_secrets_manager_client.create_secret(
        Name='UpdateTestSecret', SecretString=client_secret
    )

    client_secret_arn = secret_manager_resp['ARN']

    identity_provider.handler({
        'RequestType': 'Update',
        'ResponseURL' : 'http://pre-signed-S3-url-for-response',
        'StackId' : 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId' : 'unique id for this create request',
        'ResourceType' : 'Custom::UserPoolIdentityProvider',
        'LogicalResourceId' : 'MyTestResource',
        'ResourceProperties': {
            'UserPoolId': user_pool_id,
            'ProviderName': provider_name,
            'ProviderType': 'OIDC',
            'ClientSecretArn': client_secret_arn,
            'ProviderDetails': {
                'oidc_issuer': 'oidc_issuer'
            },
            'AttributeMapping': '{"given_name": "given_name"}',
            'IdpIdentifiers': ['IdpIdentifierUpdate']
        }
    }, MockContext)

    assert identity_provider.helper.Data == {'ProviderName': 'OidcProviderUpdate'}

    resp = mocked_cognito_client.describe_identity_provider(
        UserPoolId=user_pool_id,
        ProviderName=provider_name
    )

    moto_identity_provider = resp['IdentityProvider']

    assert moto_identity_provider['UserPoolId'] == user_pool_id
    assert moto_identity_provider['ProviderType'] == 'OIDC'
    assert moto_identity_provider['ProviderName'] == provider_name
    assert moto_identity_provider['ProviderDetails'] == {'oidc_issuer': 'oidc_issuer', 'client_secret': client_secret}
    assert moto_identity_provider['AttributeMapping'] == {'given_name': 'given_name'}
    assert moto_identity_provider['IdpIdentifiers'] ==  ['IdpIdentifierUpdate']


def test_handler_deletes_identity_provider(mocked_cognito_client, identity_provider):

    create_user_pool_resp = mocked_cognito_client.create_user_pool(PoolName='pool_name')

    user_pool_id = create_user_pool_resp['UserPool']['Id']

    provider_name = 'OidcProviderUpdate'

    mocked_cognito_client.create_identity_provider(UserPoolId=user_pool_id,
                                                   ProviderName=provider_name,
                                                   ProviderType='OIDC',
                                                   ProviderDetails={
                                                       'client_id': 'client_id'
                                                   })

    provider_name = 'OidcProviderUpdate'

    identity_provider.handler({
        'RequestType': 'Delete',
        'ResponseURL' : 'http://pre-signed-S3-url-for-response',
        'StackId' : 'arn:aws:cloudformation:us-west-2:123456789012:stack/stack-name/guid',
        'RequestId' : 'unique id for this create request',
        'ResourceType' : 'Custom::UserPoolIdentityProvider',
        'LogicalResourceId' : 'MyTestResource',
        'ResourceProperties': {
            'UserPoolId': user_pool_id,
            'ProviderName': provider_name,
            'ProviderType': 'OIDC',
            'ProviderDetails': {
                'oidc_issuer': 'oidc_issuer'
            },
            'AttributeMapping': '{"given_name": "given_name"}',
            'IdpIdentifiers': ['IdpIdentifierUpdate']
        }
    }, MockContext)

    with pytest.raises(mocked_cognito_client.exceptions.ResourceNotFoundException):
        mocked_cognito_client.describe_identity_provider(
            UserPoolId=user_pool_id,
            ProviderName=provider_name
        )
