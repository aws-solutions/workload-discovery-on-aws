# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import boto3
from crhelper import CfnResource
from boto_utils import paginate
from decorators import with_logging


helper = CfnResource(json_logging=False, log_level='DEBUG',
                     boto_level='CRITICAL')

ecr_client = boto3.client("ecr")


@with_logging
@helper.create
@helper.update
def create(event, context):
    return None


@with_logging
@helper.delete
def delete(event, context):
    props = event['ResourceProperties']
    repository = props["Repository"]
    images = list(paginate(ecr_client, ecr_client.list_images, ["imageIds"], repositoryName=repository))

    if images:
        ecr_client.batch_delete_image(
            imageIds=images, repositoryName=repository)

    return None


def handler(event, context):
    helper(event, context)