// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codecommit from "aws-cdk-lib/aws-codecommit";
import * as pipelines from "aws-cdk-lib/pipelines";
import { Constants } from "./constants";
import { Construct } from "constructs";
import { Stack, Stage, CfnParameter } from "aws-cdk-lib";
import { NagSuppressions } from "cdk-nag";
import { WorkloadDiscoveryMainStack } from "./workload-discovery-main-stack";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

const DEPLOY_STAGE_NAME = "Deployment-Test";

export class PipelineStack extends Stack {
  /*
    This stack establishes a pipeline that builds, deploys, and tests the solution
    in a specified account. It also uses CodeCommit to trigger the pipeline when commits are pushed.
    */

  constructor(scope: Construct, construct_id: string) {
    super(scope, construct_id);

    const repo = codecommit.Repository.fromRepositoryName(this, "WorkloadDiscoveryRepo", Constants.REPO_NAME );

    const workingBranch = new CfnParameter(this, "workingBranch", {
      type: "String",
      description: "The name of the branch that you would like to point this pipeline at."});

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      synth: this.getSynthStep(repo, workingBranch),
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_6_0,
          computeType: codebuild.ComputeType.LARGE,
          privileged: true,
        },
      },
    });

    const deployStage = new DeployStage(this, DEPLOY_STAGE_NAME);
    pipeline.addWave('Unit-Testing', {
      pre: [this.getUnitTestStep()]
    })
    pipeline.addStage(deployStage, {
      pre: [this.getBuildStep()]
    });

    pipeline.buildPipeline();
    NagSuppressions.addStackSuppressions(this, [
      {
        id: "AwsSolutions-IAM5",
        reason:
          "necessary permissions for the pipeline to build, update, and self-mutate",
      },
      {
        id: "AwsSolutions-CB4",
        reason: "Update step provided by construct",
      },
    ]);

    NagSuppressions.addResourceSuppressions(pipeline.pipeline.artifactBucket, [
      {
        id: "AwsSolutions-S1",
        reason:
          "Bucket is used internally by the pipeline and does not need access logging",
      },
    ]);
  }

  getSynthStep(repository: codecommit.IRepository, workingBranch: CfnParameter) {
    return new pipelines.CodeBuildStep("Synth", {
      input: pipelines.CodePipelineSource.codeCommit(repository, workingBranch.valueAsString),
      installCommands: [""],
      commands: [
        "cd source/infrastructure",
        "npm ci",
        "cd pipeline",
        "npx cdk synth",
      ],
      primaryOutputDirectory: "build/cdk.pipeline.out",
    });
  }

  getUnitTestStep() {
    return new pipelines.CodeBuildStep("Unit Tests", {
      commands: [
        "cd deployment",
        "chmod +x ./run-unit-tests.sh",
        "./run-unit-tests.sh"
      ]
    });
  }

  getBuildStep() {
    return new pipelines.CodeBuildStep("Solution Builder", {
      installCommands: [""],
      commands: [
        "cd deployment",
        `./local-deploy-script.sh ${Constants.AWS_REGION} ${Constants.BUCKET_NAME} ${Constants.SOLUTION_NAME} ${Constants.VERSION} ${Constants.IMAGE_TAG}`,
      ],
      rolePolicyStatements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "s3:CreateBucket",
            "s3:DeleteBucket",
            "s3:ListBucket",
            "s3:GetObject",
            "s3:PutBucketVersioning",
            "s3:PutObject",
            "s3:PutObjectAcl"
          ],
          resources: [
            `arn:aws:s3:::${Constants.BUCKET_NAME}`,
            `arn:aws:s3:::${Constants.BUCKET_NAME}-${Constants.AWS_REGION}`,
            `arn:aws:s3:::${Constants.BUCKET_NAME}/*`,
            `arn:aws:s3:::${Constants.BUCKET_NAME}-${Constants.AWS_REGION}/*`
          ],
        }),
      ],
    });
  }

}

class DeployStage extends Stage {
  constructor(scope: Construct, construct_id: string) {
    super(scope, construct_id);
  }

  workloadDiscoveryMainStack = new WorkloadDiscoveryMainStack(
    this,
    "WorkloadDiscoveryMain",
    { stackName: "WorkloadDiscovery" }
  );

}

