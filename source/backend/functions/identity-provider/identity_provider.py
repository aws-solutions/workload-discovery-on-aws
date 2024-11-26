# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
import json
from aws_lambda_powertools import Logger
from aws_lambda_powertools.utilities import parameters
from crhelper import CfnResource
from typing import TypedDict, Optional


logger = Logger(service='IdentityProviderCustomResource')


helper = CfnResource(json_logging=False, log_level='INFO',
                     boto_level='CRITICAL')

cognito_client = boto3.client('cognito-idp')

ssm_provider = parameters.SecretsProvider()


class IdentityProviderProperties(TypedDict):
    UserPoolId: str
    ProviderName: str
    ProviderType: str
    ProviderDetails: dict
    AttributeMapping: str
    IdpIdentifiers: Optional[list[str]]


class Event(TypedDict):
    RequestType: str
    ResponseURL: str
    StackId: str
    RequestId: str
    ResourceType: str
    LogicalResourceId: str
    ResourceProperties: IdentityProviderProperties


@helper.create
def create(event: Event, _) -> None:
    logger.info('Creating identity provider')
    props: IdentityProviderProperties = event['ResourceProperties']
    provider_name = props['ProviderName']
    client_secret_arn = props['ClientSecretArn']
    attribute_mappings = json.loads(props['AttributeMapping'])

    client_secret = ssm_provider.get(client_secret_arn)

    resp = cognito_client.create_identity_provider(
        UserPoolId=props['UserPoolId'],
        ProviderName=provider_name,
        ProviderType=props['ProviderType'],
        ProviderDetails=props['ProviderDetails'] | {'client_secret': client_secret},
        AttributeMapping=attribute_mappings,
        IdpIdentifiers=props['IdpIdentifiers']
    )

    logger.info('Identity provider created')
    logger.info(resp['IdentityProvider'])

    helper.Data.update({'ProviderName': provider_name})


@helper.update
def update(event: Event, _) -> None:
    logger.info('Updating identity provider')
    props: IdentityProviderProperties = event['ResourceProperties']
    provider_name = props['ProviderName']
    client_secret_arn = props['ClientSecretArn']
    attribute_mappings = json.loads(props['AttributeMapping'])

    client_secret = ssm_provider.get(client_secret_arn)

    resp = cognito_client.update_identity_provider(
        UserPoolId=props['UserPoolId'],
        ProviderName=provider_name,
        ProviderDetails=props['ProviderDetails'] | {'client_secret': client_secret},
        AttributeMapping=attribute_mappings,
        IdpIdentifiers=props['IdpIdentifiers']
    )

    logger.info('Identity provider updated.')
    logger.info(resp['IdentityProvider'])

    helper.Data.update({'ProviderName': provider_name})


@helper.delete
def delete(event: Event, _) -> None:
    logger.info('Deleting identity provider')
    props: IdentityProviderProperties = event['ResourceProperties']

    cognito_client.delete_identity_provider(
        UserPoolId=props['UserPoolId'],
        ProviderName=props['ProviderName']
    )

    logger.info('Identity provider deleted.')


@logger.inject_lambda_context
def handler(event, _) -> None:
    helper(event, _)