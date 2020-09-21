# AWS Perspective

AWS Perspective, is a solution that makes it easy for customers to create visualizations of their AWS cloud workloads. Perspective maintains an inventory of AWS resources across accounts and regions, derives relationships between them and makes them available via its console. Customers can build detailed architecture diagrams of their workloads that they can customize and share, with the knowledge that the data is always up to date.

To find out more about AWS Perspective visit our [AWS Solutions](https://aws.amazon.com/solutions/implementations/aws-perspective) page.

To see our roadmap and vote on the features you would like to see implemented, please go to our [project board](https://github.com/awslabs/aws-perspective/projects/2)

## Launch AWS Perspective

| Region   |      Launch      |  Template Link |
|----------|:-------------:|:------:|
| US East (N. Virginia) (us-east-1) |[Launch](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template)|
| US East (Ohio) (us-east-2) |    [Launch](https://console.aws.amazon.com/cloudformation/home?region=us-east-2#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template)   | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |
| US West (Oregon) (us-west-2) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |
| Asia Pacific (Mumbai) (ap-south-1) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=ap-south-1#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template)|
| Asia Pacific (Seoul) (ap-northeast-2) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-2#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |
| Asia Pacific (Singapore) (ap-southeast-1) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-1#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |
| Asia Pacific (Sydney) (ap-southeast-2) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=ap-southeast-2#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template)|
| Asia Pacific (Tokyo) (ap-northeast-1) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=ap-northeast-1#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |[Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |
| Canada (Central) (ca-central-1) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=ca-central-1#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |
| Europe (Ireland) (eu-west-1) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |
| Europe (London) (eu-west-2) | [Launch](https://console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |
| Europe (Frankfurt) (eu-central-1)| [Launch](https://console.aws.amazon.com/cloudformation/home?region=eu-central-1#/stacks/create/template?stackName=aws-perspective&templateURL=https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) | [Link](https://solutions-reference.s3.amazonaws.com/aws-perspective/latest/aws-perspective.template) |


## Feature requests

If you have an idea for a feature you would like to see implemented, please create an issue [here](https://github.com/awslabs/aws-perspective/issues) and use the 'enhancement' label. This will be available on the [project board](https://github.com/awslabs/aws-perspective/projects/2) for others to vote on.

## Installation

The solution is available as an AWS CloudFormation template and should take about 30 minutes to deploy. See the deployment guide on the [AWS Solutions](https://aws.amazon.com/solutions/) site, for one-click deployment instructions, and the cost overview guide to learn about costs.

## Usage

The solution provides a web user interface.

See the user guide on the [AWS Solutions](https://aws.amazon.com/solutions/) site to learn how to use the solution.

## Architecture

![Architecture diagram showing full set of deployment resources](/docs/architecture-diagrams/full-arch-diagram.png "Full architecture diagram")

The AWS CloudFormation template deploys six components to maintain an inventory of AWS resources and display the relationships between them. [Amazon CloudFront](https://aws.amazon.com/cloudfront/) delivers content for the Web UI component. The UI is written in [React](https://reactjs.org/) and hosted from an [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) bucket (WebUIBucket) and [Lambda@Edge](https://aws.amazon.com/lambda/edge/) appends secure headers to each request. [AWS Amplify](https://aws.amazon.com/amplify/) aids the API integration and provides an abstraction layer for communicating with Amazon S3 (AmplifyStorageBucket) to manage storage actions. Amazon Cognito authenticates users and the [Amazon API Gateway](https://aws.amazon.com/api-gateway/) Client API (PerspectiveWebRestAPI) provides access to relationship data. [AWS AppSync](https://aws.amazon.com/appsync/)

An [Amazon Virtual Private Cloud (Amazon VPC)](https://aws.amazon.com/vpc/) contains the data and discovery components. The Lambda function (GremlinFunction) processes requests from API Gateway Client API (PerspectiveWebRestAPI) and queries [Amazon Neptune](https://aws.amazon.com/neptune/) and the cost component to gather the requested data. The API Gateway Server API (ServerGremlinAPI ) receives requests from the AWS Fargate task in the discovery component. The Lambda function (ElasticsearchFunction) processes incoming requests and communicates with the [Amazon Elasticsearch Service (ES) cluster](https://aws.amazon.com/elasticsearch-service/). [Amazon Elastic Container Service (Amazon ECS)](https://aws.amazon.com/ecs/) runs an [AWS Fargate](https://aws.amazon.com/fargate/) task using the container image (using [Docker](https://docs.docker.com/get-started/#images-and-containers)) downloaded from [Amazon Elastic Container Registry (Amazon ECR)](https://aws.amazon.com/ecr/). [AWS Config](https://aws.amazon.com/config/) is used to gather the data about resources running in each account and Region that is made discoverable to AWS Perspective. AWS API calls are used to gather data about resources that are not currently supported by AWS Config.

An [AWS Cost and Usage Report](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) is published to the Amazon S3 bucket (PerspectiveCostBucket). When the new Amazon S3 object is uploaded, it triggers the Cost Parser Lambda function. An [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) global table stores data for the cost component. Lastly, [AWS CodePipeline](https://aws.amazon.com/codepipeline/) and [AWS CodeBuild](https://aws.amazon.com/codebuild/) build the container image from the code hosted in the Amazon S3 bucket (DiscoveryBucket). 


## Local Build Testing

### Running unit tests

```
cd ./deployment
chmod +x ./run-unit-tests.sh
./run-unit-tests.sh
```

### Running a local build

```
cd ./deployment
chmod +x ./build-s3-dist.sh solutions-bucket aws-perspective v1.0.0 image-tag
./build-s3-dist.sh
```

## Deployment

When you have made changes to the code, you can build it locally and upload the deployment artefacts to Amazon S3 by running the following bash script.

### Prerequistes

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed.
2. The CLI [configured](https://docs.aws.amazon.com/cli/latest/reference/configure/) with credentials/profile that will allow:
   * S3 Bucket creation
   * S3 Object creation

### Create deployment script

1. Create a shell script in the root project directory.
   ```touch local-deploy-script.sh```
2. Copy the contents below and paste in local-deploy-script.sh and save.

```
#!/usr/bin/env bash

set -e

# The Region you wish to deploy to.
AWS_REGION=<aws-region>
# The S3 Bucket name to be created to store your deployment artefacts
DIST_OUTPUT_BUCKET=<s3-bucket>
# A name for your test solution
SOLUTION_NAME=<solution-name>
# A version number for this test release e.g vX.Y.Z
VERSION=<version>
# Tag that will be given to Docker image.
IMAGE_TAG=<tag>

if aws s3api head-bucket --bucket "${DIST_OUTPUT_BUCKET}" 2>/dev/null;
then
    echo "${DIST_OUTPUT_BUCKET} bucket exists and you own it, so not creating it"
else
    echo "creating bucket in region ${AWS_REGION} with name ${DIST_OUTPUT_BUCKET}"
    aws s3 mb s3://${DIST_OUTPUT_BUCKET} --region ${AWS_REGION}
fi

if aws s3api head-bucket --bucket "${DIST_OUTPUT_BUCKET}-${AWS_REGION}" 2>/dev/null;
then
    echo "${DIST_OUTPUT_BUCKET}-${AWS_REGION} bucket exists and you own it, so not creating it"
else
    echo "creating bucket in region ${AWS_REGION} with name ${DIST_OUTPUT_BUCKET}-${AWS_REGION}"
    aws s3 mb s3://${DIST_OUTPUT_BUCKET}-${AWS_REGION} --region ${AWS_REGION}
fi

cd deployment
./build-s3-dist.sh $DIST_OUTPUT_BUCKET $SOLUTION_NAME $VERSION $IMAGE_TAG
aws cloudformation package --template-file "global-s3-assets/perspective-setup.template" --s3-bucket "$DIST_OUTPUT_BUCKET" --s3-prefix "${SOLUTION_NAME}/${VERSION}" --output-template-file packaged.template
aws s3 cp packaged.template "s3://${DIST_OUTPUT_BUCKET}-${AWS_REGION}/${SOLUTION_NAME}/${VERSION}/aws-perspective.template"
aws s3 cp global-s3-assets  s3://${DIST_OUTPUT_BUCKET}-${AWS_REGION}/${SOLUTION_NAME}/${VERSION}/ --recursive --acl bucket-owner-full-control
aws s3 cp regional-s3-assets  s3://${DIST_OUTPUT_BUCKET}-${AWS_REGION}/${SOLUTION_NAME}/${VERSION}/ --recursive --acl bucket-owner-full-control

echo "You can now deploy using this template URL https://${DIST_OUTPUT_BUCKET}-${AWS_REGION}.s3.${AWS_REGION}.amazonaws.com/${SOLUTION_NAME}/${VERSION}/aws-perspective.template"


```

3. Make the script executable
   ```chmod +x ./local-deploy-script.sh```
4. Run the script
   ```./local-deploy-script.sh```

This will:

* Create S3 buckets to store the deployment artefacts.
* Run the build
* Deploy artefacts to your chosen S3 Bucket.

### Deploying the CloudFormation template

Once you have the deployment artefacts in S3, you can deploy the **aws-perspective.template** in the CloudFormation console. Just pass the link to the template in S3 to CloudFormation and it will do the rest.

Parameters required by the template:

* **Stack Name** - The name given to the deployment stack e.g. aws-perspective
* **AdminUserEmailAddress** - The email address to receive login credentials at.
* **AlreadyHaveConfigSetup** - Yes/No depending on whether AWS Config has is configured in the deployment Region.
* **CreateElasticsearchServiceRole** - Yes/No depending on whether you already have this service-role created. You can check in the IAM console to see if it is provisioned.
* **OptOutOfSendingAnonymousUsageMetrics** - Yes/No depending on whether you are happy to send anonymous usage metrics back to AWS.
* **CreateNeptuneReplica** - Yes/No depending on whether you want a read-replica created for Amazon Neptune. Note, that this will increase the cost of running the solution.
* **NeptuneInstanceClass** - Select from a range of instance types that will be provisioned for the Amazon Neptune database. Note, the selection could increase the cost associated with running the solution.

**Note** - You will need to deploy in the same account and region as the S3 bucket.

***

## Directory structure

```
|-deployment/
  |-build-s3-dist.sh             [ shell script for packaging distribution assets ]
  |-run-unit-tests.sh            [ shell script for executing unit tests ]
  |-perspective-setup.yaml       [ the main CloudFormation deployment template ]
|-source/
  |-frontend/                    [ the frontend ui code ]
  |-backend/                     [ the backend code ]
    |-discovery/                 [ the code for the discovery process ]
    |-functions/                 [ the code for the Lambda functions ]
  |-cfn/                         [ the CloudFormation templates that deploy aws-perspective ]
```

## Web API Examples

### Getting Bearer Token

#### Via Browser

The Web API requires a JWT present in the request **Authorization** Header.
You can find your Bearer Token by:

1. Logging into AWS Perspective UI in Google Chrome
2. Right-click anywhere on the screen.
3. Click **Inspect**
4. Click **Network**
5. Find the **resources** request.
6. Select it and go to **Headers**
7. Locate the **Authorization** Header
8. Copy the contents.

### Commands

#### getAllResources

##### Request

```
curl --location --request POST 'https://<your-api-gateway-id>.execute-api.<deployment-region>.amazonaws.com/Prod/resources' \
--header 'Authorization: Bearer <your-token>' \
--header 'Content-Type: application/json' \
--data-raw '{"command":"getAllResources","data":{}}'
```

##### Response

You will receive all the resources that have been discovered with just a subset of data about each one. You will also receive a metadata object that breaks down the resource types discovered and the resource counts for each. This is done for each account and region that is discoverable to AWS Perspective.

#### linkedNodesHierarchy

##### Request

```
curl --location --request GET 'https://<your-api-gateway-id>.execute-api.<deployment-region>.amazonaws.com/Prod/resources?command=linkedNodesHierarchy&id=<node-id>' \
--header 'Authorization: Bearer <your-token>'
```

##### Response

You will receive an array of nodes that have a relationship with the node id used in the request.

#### DrawIO Export

This takes a JSON representation of the architecture diagram and converts it to **mxGraph** and opens in a DrawIO tab.

##### Request

```
curl --location --request POST 'https://<your-api-gateway-id>.execute-api.<deployment-region>.amazonaws.com/Prod/resources' \
--header 'Authorization: Bearer <your-token> \
--header 'Content-Type: text/plain' \
--data-raw '{"elements":{"nodes":[], "edges": []'}}
```

##### Response

You will receive a URL that when clicked will open up DrawIO in the browser and show your graph.

Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

    http://www.apache.org/licenses/

or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions and limitations under the License.
