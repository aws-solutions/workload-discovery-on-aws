# AWS Perspective

AWS Perspective is a tool that quickly visualizes AWS Cloud workloads as architecture diagrams. You can use the solution to build, customize, and share detailed workload visualizations based on live data from AWS. This solution works by maintaining an inventory of the AWS resources across your accounts and Regions, mapping relationships between them, and displaying them in a web user interface (web UI).

To find out more about AWS Perspective visit the [AWS Perspective Solution Page](https://aws.amazon.com/solutions/implementations/aws-perspective).

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

## Installation

AWS Perspective is deployed to your account using an AWS CloudFormation template and should take approximately 30 minutes to deploy. See the [deployment guide](https://docs.aws.amazon.com/solutions/latest/aws-perspective/automated-deployment.html) for instructions, and [the cost overview](https://docs.aws.amazon.com/solutions/latest/aws-perspective/overview.html#cost) to learn about costs.

## Usage

A web interface is included with AWS Perspective. To login to the interface, follow the [Post-deployment configuration steps](https://docs.aws.amazon.com/solutions/latest/aws-perspective/automated-deployment.html#step-2.-post-deployment-configuration-tasks) of the installation guide.

Refer to the [implementation guide](https://docs.aws.amazon.com/solutions/latest/aws-perspective/appendix-a-web-ui-features-and-common-tasks.html) to learn how to use AWS Perspective.

## Feature requests

To submit an idea for a feature you would like to see implemented, please [create an issue](https://github.com/awslabs/aws-perspective/issues) and use the 'enhancement' label. Your issue will be available on the [project board](https://github.com/awslabs/aws-perspective/projects/2) for others to vote on.

## Architecture

![Architecture diagram showing full set of deployment resources](/docs/architecture-diagrams/full-arch-diagram.png "Full architecture diagram")

AWS Perspective is deployed to your account using an AWS CloudFormation template consisting of six components. Following is a high level overview of the components. For additional details about each component, refer to the [Solution components guide](https://docs.aws.amazon.com/solutions/latest/aws-perspective/solution-components.html).

The web user interface (UI) interacts with the data component via [Amazon API Gateway](http://aws.amazon.com/api-gateway/) and [AWS AppSync](http://aws.amazon.com/appsync/) endpoints. The web UI requests resource relationship data from the data component. The data component queries and returns data from an [Amazon Neptune](http://aws.amazon.com/neptune/) database.

The storage management component stores user preferences and saved architecture diagrams. This is implemented using [AWS Amplify](http://aws.amazon.com/amplify/) and an [Amazon Simple Storage Service](http://aws.amazon.com/s3/) (Amazon S3) bucket.

The discovery component uses [AWS Config](http://aws.amazon.com/config) and AWS API calls to maintain an inventory of resource data from imported accounts and Regions, then stores its findings in the data componenet. This runs every 15 minutes as a container task on [AWS Fargate](http://aws.amazon.com/fargate/). The discovery component container image is built in the image deployment component using [AWS CodePipeline](http://aws.amazon.com/codepipeline/) and [AWS CodeBuild](http://aws.amazon.com/codebuild/).

The cost component processes [AWS Cost and Usage Reports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) (AWS CUR) to make cost data available in AWS Perspective. To use this feature, you must [create a report in AWS CUR](https://docs.aws.amazon.com/cur/latest/userguide/cur-create.html) to deliver the reports to the PerspectiveCostBucket Amazon S3 bucket. When an AWS CUR is delivered, it triggers an [AWS Lambda](http://aws.amazon.com/lambda) function to process the cost data and store it in an [Amazon DynamoDB](http://aws.amazon.com/dynamodb/) table. The data component queries this DynamoDB table to provide the costs associated with the individual resources for display in the web UI. If you do not create an AWS CUR, cost data will not be included in AWS Perspective architecture diagrams. 

## Development
### Directory structure

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

### Running unit tests

```
cd ./deployment
./run-unit-tests.sh
```

### Running a local build

```
cd ./deployment
./build-s3-dist.sh
```

### Deployment

When you have made changes to the code, you can build it locally and upload the deployment artefacts to Amazon S3 by running the following bash script.

#### Prerequistes

1. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) installed.
2. The CLI [configured](https://docs.aws.amazon.com/cli/latest/reference/configure/) with credentials/profile that will allow:
   * S3 Bucket creation
   * S3 Object creation

#### Create deployment script

1. Create a shell script in the root project directory.
   ```touch local-deploy-script.sh```
2. Copy the contents below and paste in local-deploy-script.sh. Substitute the value placeholders (marked with angle brackets) with your own values, then save the script.

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

#### Deploying the CloudFormation template

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


## Web API Examples

### Getting a Bearer Token

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

***

Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at https://www.apache.org/licenses/ or in the "[license](LICENSE.txt)" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions and limitations under the License.
