// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Constants } from "./constants";
import { CfnOutput } from "aws-cdk-lib";
import * as cloudformation from 'aws-cdk-lib/aws-cloudformation';


export interface WorkloadDiscoveryStackProps {
  readonly stackName?: string;
}

export class WorkloadDiscoveryMainStack extends cdk.Stack {
  outputs: Record<string, CfnOutput> = {};
  constructor(scope: Construct, id: string, props: WorkloadDiscoveryStackProps) {
    super(scope, id, {
      stackName: props.stackName
    });

    new cloudformation.CfnStack(this, 'WorkloadDiscoveryStack', {
      templateUrl: `https://${Constants.BUCKET_NAME}-${Constants.AWS_REGION}.s3.amazonaws.com/workload-discovery/${Constants.VERSION}/main.template`,
      parameters: {
        "AdminUserEmailAddress": Constants.ADMIN_EMAIL
      }
    })

    cdk.Stack.of(this);
  }
}