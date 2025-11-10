# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
from aws_lambda_powertools import Logger
from crhelper import CfnResource
from typing import TypedDict, Dict

logger = Logger(service='RemoveAppInsightsCustomResource')

helper = CfnResource(json_logging=False, log_level='INFO', boto_level='CRITICAL')

appinsights_client = boto3.client('application-insights')


class Event(TypedDict):
    RequestType: str
    ResponseURL: str
    StackId: str
    RequestId: str
    ResourceType: str
    LogicalResourceId: str
    ResourceProperties: Dict


@helper.create
def create(event: Event, _) -> None:
    resource_group_name = event['ResourceProperties']['ResourceGroupName']
    logger.info(f'Deleting Application Insights dashboard for resource group: {resource_group_name}')

    try:
        appinsights_client.delete_application(ResourceGroupName=resource_group_name)
        logger.info(f'Application Insights dashboard deleted: {resource_group_name}')
    except appinsights_client.exceptions.ResourceNotFoundException:
        logger.info(f'Application Insights dashboard not found: {resource_group_name}')
    except Exception as e:
        logger.error(f'Error deleting Application Insights dashboard: {str(e)}')
        raise


def handler(event, context) -> None:
    helper(event, context)
