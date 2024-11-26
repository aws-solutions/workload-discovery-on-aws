# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
from uuid import uuid4
from aws_lambda_powertools import Logger
from crhelper import CfnResource
from typing import TypedDict, Dict


logger = Logger(service='MetricsUuidCustomResource')


helper = CfnResource(json_logging=False, log_level='INFO',
                     boto_level='CRITICAL')

ssm_client = boto3.client('ssm')

metrics_parameter_name = '/Solutions/WorkloadDiscovery/anonymous_metrics_uuid'


class Event(TypedDict):
    RequestType: str
    ResponseURL: str
    StackId: str
    RequestId: str
    ResourceType: str
    LogicalResourceId: str
    ResourceProperties: Dict


@helper.create
@helper.update
def create(event: Event, _) -> None:
    logger.info('Creating metrics uuid')

    try:
        get_resp = ssm_client.get_parameter(Name=metrics_parameter_name)
        logger.info('Metrics uuid already exists')
        helper.Data.update({'MetricsUuid': get_resp['Parameter']['Value']})
    except ssm_client.exceptions.ParameterNotFound:
        uuid = str(uuid4())
        ssm_client.put_parameter(
            Name=metrics_parameter_name,
            Description='Unique Id for anonymous metrics collection',
            Value=uuid,
            Type='String'
        )
        logger.info(f'Metrics uuid created: {uuid}')
        helper.Data.update({'MetricsUuid': uuid})


def handler(event, _) -> None:
    helper(event, _)