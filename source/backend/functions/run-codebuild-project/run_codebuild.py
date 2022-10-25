#!/usr/bin/env python

import boto3
import logging

from os import getenv
from crhelper import CfnResource


helper = CfnResource(json_logging=False, log_level="DEBUG", boto_level="CRITICAL")
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

try:
    CODEBUILD_PROJECT_NAME = getenv("CODEBUILD_PROJECT_NAME")
    codebuild = boto3.client("codebuild")
except Exception as e:
    helper.init_failure(e)

@helper.create
@helper.update
def create_update(event, context):
    res = codebuild.start_build(
        projectName=CODEBUILD_PROJECT_NAME,
    )
    return res.get("build", {}).get("arn")

def handler(event, context):
    helper(event, context)
