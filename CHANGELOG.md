# Change Log

All notable changes to this project are documented in this file.

Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.15] - 2024-9-30

### Fixed

- Cron expression for running discovery process every 24 hours. [546](https://github.com/aws-solutions/workload-discovery-on-aws/discussions/546)
- Security [vulnerability](https://github.com/advisories/GHSA-gcx4-mw62-g8wm) in `rollup`.
- Security [vulnerability](https://github.com/advisories/GHSA-9cwx-2883-4wfx) in `vite`.
- Security [vulnerability](https://github.com/advisories/GHSA-64vr-g452-qvp3) in `vite`.

## [2.1.14] - 2024-9-18

### Fixed

- Cron expression for running discovery process every 24 hours. [546](https://github.com/aws-solutions/workload-discovery-on-aws/discussions/546)
- Intermittent failures in `cleanup-bucket` custom resource. [545](https://github.com/aws-solutions/workload-discovery-on-aws/discussions/545)
- SCP error relating to `putConfigAggregator` when adding accounts in an AWS organisation using Control Tower. [544](https://github.com/aws-solutions/workload-discovery-on-aws/discussions/544)
- Security [vulnerability](https://github.com/advisories/GHSA-952p-6rrq-rcjv) in `micromatch`.
- Security [vulnerability](https://github.com/advisories/GHSA-9wv6-86v2-598j) in `path-to-regexp`.
- Security [vulnerability](https://github.com/advisories/GHSA-m6fv-jmcg-4jfg) in `send`.

## [2.1.13] - 2024-8-16

### Fixed

- Security [vulnerability](https://github.com/advisories/GHSA-8hc4-vh64-cxmj) in `axios`.

## [2.1.12] - 2024-7-31

### Fixed

- Security [vulnerability](https://github.com/advisories/GHSA-mpg4-rc92-vx8v) in `fast-xml-parser`.

## [2.1.11] - 2024-7-23

### Changed

- Use Amazon Linux 2023 as the base image for the discovery process Docker container

## [2.1.10] - 2024-7-16

### Fixed

- Security [vulnerability](https://github.com/advisories/GHSA-3q56-9cc2-46j4) in `fast-loops`.
- Security [vulnerability](https://github.com/advisories/GHSA-jfmj-5v4g-7637) in `zipp`.
- Security [vulnerability](https://github.com/advisories/GHSA-3g92-w8c5-73pq) in `undici`.

### Changed

- Restrict egress for Neptune lambda security group to VPC IP address range. [531](https://github.com/aws-solutions/workload-discovery-on-aws/discussions/531)

## [2.1.9] - 2024-6-24

### Fixed

- Security [vulnerability](https://github.com/advisories/GHSA-3h5v-q93c-6h6q) in `ws`.
- Add better logging if individual accounts aggregator supplied when cross account discovery mode is `AWS_ORGANIZATIONS`. [529](https://github.com/aws-solutions/workload-discovery-on-aws/issues/529)

### Changed

- Removed dev environment CDK build pipeline

## [2.1.8] - 2024-6-13

### Fixed

- Security [vulnerability](https://github.com/advisories/GHSA-2p57-rm9w-gvfp) in `ip`.
- Security [vulnerability](https://github.com/advisories/GHSA-grv7-fg5c-xmjg) in `braces`.

## [2.1.7] - 2024-5-15

### Fixed

- Invalid policy error when deploying Settings resolver nested stack
- Update Node.js runtimes to v20.x
- Update Python runtimes to Python 3.12
- Security [vulnerability](https://github.com/advisories/GHSA-cxjh-pqwp-8mfp) in `follow-redirects`.
- Security [vulnerability](https://github.com/advisories/GHSA-8jhw-289h-jh2g) in `vite`.
- Security [vulnerability](https://github.com/advisories/GHSA-9qxr-qj54-h672) in `undici`.
- Security [vulnerability](https://github.com/advisories/GHSA-m4v8-wqvr-p9f7) in `undici`.

## [2.1.6] - 2024-2-22

### Fixed

- Null error when exporting to draw.io [458](https://github.com/aws-solutions/workload-discovery-on-aws/issues/458)
- Security [vulnerability](https://github.com/advisories/GHSA-78xj-cgh5-2h22) in `ip`.
- Security [vulnerability](https://github.com/advisories/GHSA-3787-6prv-h9w3) in `undici`.

## [2.1.5] - 2024-1-25

### Fixed

- Security [vulnerability](https://github.com/advisories/GHSA-c24v-8rfc-w8vw) in `vite`.
- Security [vulnerability](https://github.com/advisories/GHSA-p6mc-m468-83gw) in `lodash`.

## [2.1.4] - 2024-1-18

### Fixed

- Discovery Process Assumes Root Account Is Management Account [496](https://github.com/aws-solutions/workload-discovery-on-aws/issues/496)
- Security [vulnerability](https://github.com/advisories/GHSA-jchw-25xp-jwwc) in `follow-redirects`.
- Security [vulnerability](https://github.com/advisories/GHSA-92r3-m2mg-pj97) in `vite`.

## [2.1.3] - 2023-12-18

### Fixed

- Rate Limited Exceeded in ORGANIZATIONS mode [478](https://github.com/aws-solutions/workload-discovery-on-aws/issues/478)
- Incorrect status displayed for EC2 instances, load balancers, databases and lambda functions [483](https://github.com/aws-solutions/workload-discovery-on-aws/issues/483)
- Missing resource type icons [485](https://github.com/aws-solutions/workload-discovery-on-aws/issues/485)
- Comma in Service Name Results in Cost Feature sum of account to be 0 [489](https://github.com/aws-solutions/workload-discovery-on-aws/issues/489)
- "Load Cost" and "Cost Report" buttons are using different time spans by default, but showing the sameone in the UI [490](https://github.com/aws-solutions/workload-discovery-on-aws/issues/490)
- Comma in Service Name Results causes GraphQL type error [491](https://github.com/aws-solutions/workload-discovery-on-aws/issues/491)

### Changed
- Frequency at which the scheduled discovery process ECS task runs is now configurable via a CloudFormation parameter. 

## [2.1.2] - 2023-11-14

### Fixed

- Throttle `ListAccounts` API to prevent rate limiting from stopping the Discovery process discover accounts 
in large organisation. [478](https://github.com/aws-solutions/workload-discovery-on-aws/issues/478)
- Only attempt to discover accounts from provided OU and its children, rather than whole organization.
- Throttle `SelectAggregateResourceConfig` API to prevent rate limiting from stopping discovery process from reading from the Config aggregator.
- Remove Retain on organization-wide StackSet so IAM roles are no longer left in organization's accounts after solution is uninstalled.
- Handle error message difference between AppSync VTL resolvers and JS resolvers that prevented discovery process from retrying 
requests to DB if payload was too large.

### Changed
- Move GraphQL queries that queried whole Neptune database to use DynamoDB, significantly reducing load on Neptune and 
improving rendering times on the frontend.
- Retrieve the following resource types from AWS Config advanced query rather than  `ListAggregateDiscoveredResources`
and `BatchGetAggregateResourceConfig`.
  - `AWS::EC2::LaunchTemplate`
  - `AWS::EC2::TransitGateway`
  - `AWS::EC2::TransitGatewayAttachment`
  - `AWS::EC2::TransitGatewayRouteTable`
  - `AWS::Kinesis::Stream`
  - `AWS::MSK::Cluster`
- Ensure OAC name length does not exceed 64 characters. [462](https://github.com/aws-solutions/workload-discovery-on-aws/issues/462)
- No longer ingest resources with status `ResourceNotRecorded`.
- Improve performance of `getResourceChanges` function in Discovery process from O(n<sup>2</sup>) to O(n).
- Retrieve account metadata on frontend in batches of 50.

## [2.1.1] - 2023-10-24

### Fixed
- Security [vulnerability](https://github.com/babel/babel/security/advisories/GHSA-67hx-6x53-jw92) in `@babel/traverse`.
- Security [vulnerability](https://github.com/advisories/GHSA-wqq4-5wpv-mx2g)  in `undici`.
- Security [vulnerability](https://github.com/advisories/GHSA-g4mx-q9vg-27p4) in `urllib3`.

## [2.1.0] - 2023-09-21

### Added

- AppRegistry integration to monitor application costs and usage.
- Integration with Organizations. Customers can install the solution in a delegated admin account (recommended)
  or the management account and the solution will use an organization wide config aggregator to discover resources across
  their organization. [1](https://github.com/aws-solutions/workload-discovery-on-aws/issues/1)
- Pipeline for local development of the solution.
- Support for deploying this solution in an existing VPC. [169](https://github.com/aws-solutions/workload-discovery-on-aws/issues/169)
- Support for deploying this solution with Neptune Serverless. [314](https://github.com/aws-solutions/workload-discovery-on-aws/issues/314)
- UI now indicates if global resources template has been deployed in target accounts. [367](https://github.com/aws-solutions/workload-discovery-on-aws/issues/367)
- Support for more resource types now totalling over 250.

### Changed
- Migrated from the deprecated awsui frontend framework to [Cloudscape](https://cloudscape.design).

### Fixed
- Export of diagrams to JSON [426](https://github.com/aws-solutions/workload-discovery-on-aws/issues/426)
- Export of diagrams to draw.io [329](https://github.com/aws-solutions/workload-discovery-on-aws/issues/329)
- Outdated OpenSSL package being used [424](https://github.com/aws-solutions/workload-discovery-on-aws/issues/424)
- Response payload size exceeding maximum allowed payload size [351](https://github.com/aws-solutions/workload-discovery-on-aws/issues/351)
- Publishing name instead of ARN of resources [330](https://github.com/aws-solutions/workload-discovery-on-aws/issues/330)
- CSV report of the Resources does not include ARN [407](https://github.com/aws-solutions/workload-discovery-on-aws/issues/407)

## [2.0.3] - 2023-04-18

### Fixed

- Added ObjectOwnership property to S3 buckets in accordance with new [bucket ACL changes.](https://aws.amazon.com/blogs/aws/heads-up-amazon-s3-security-changes-are-coming-in-april-of-2023/)
- Updated aws-sdk version to get around this xml2js [vulnerability.](https://github.com/advisories/GHSA-776f-qx25-q3cc)

## [2.0.2] - 2022-12-09

### Fixed

- Pagination size in discovery process could lead to maximum allowed payload errors [331](https://github.com/awslabs/workload-discovery-on-aws/issues/331)
- AWS Config throttling stopped resources not supported by advanced query being discovered [332](https://github.com/awslabs/workload-discovery-on-aws/issues/332)
- Null errors when adding relationships for `AWS::Lambda::Function`, `AWS::ECS::Task`, `AWS::AutoScaling::AutoScalingGroup` and
  `AWS::RDS::DBInstance` resource types [333](https://github.com/awslabs/workload-discovery-on-aws/issues/333)
- Permission errors when decrypting encrypted lambda functions broke batch lambda relationship discovery [334](https://github.com/awslabs/workload-discovery-on-aws/issues/334)

## [2.0.1] - 2022-11-23

### Fixed

- Removing last account caused an AWS Config error and stopped account being removed [315](https://github.com/awslabs/workload-discovery-on-aws/issues/315)
- Pagination size in discovery process could lead to maximum allowed payload errors [316](https://github.com/awslabs/workload-discovery-on-aws/issues/316)
- Specifying `neptune1` family parameter group broke Neptune stack deployment scripts [320](https://github.com/awslabs/workload-discovery-on-aws/issues/320)
- Inconsistent return type from AWS Config for tags broke tag creation

## [2.0.0] - 2022-10-25

### Added

- Solution now ingests all resource types [supported](https://docs.aws.amazon.com/config/latest/developerguide/resource-config-reference.html), as well as the  following resource types
    - `AWS::APIGateway::Resource`
    - `AWS::APIGateway::Method`
    - `AWS::APIGateway::Authorizer`
    - `AWS::IAM::InlinePolicy`
    - `AWS::IAM::ManagedPolicy`
    - `AWS::ECS::Task`
    - `AWS::EKS:::NodeGroup`
    - `AWS::ElasticLoadBalancingV2::TargetGroup`
    - `AWS::Cognito::UserPool`
    - `AWS::EC2::Spot`
    - `AWS::EC2::SpotFleet`
- Large increase in number of relationships not captured by AWS Config, including, but not limited to:
    - Lambda -> SNS/SQS/Kinesis/MSK/EFS
    - AWS::APIGateway::Authorizer -> Cognito User Pool
    - CloudFront -> ELB/ELBv2
    - SecurityGroup -> SecurityGroup
    - ELBv2 -> ELBv2 Listener -> ELBv2 Target Group -> ASG
    - ECS Task -> EFS
    - EKS Cluster -> NodeGroup/VPC/Subnet/SecurityGroup/IAM Role
    - EKS NodeGroup -> ASG/VPC/Subnet/SecurityGroup/IAM Role/Launch Template
    - Transit Gateway -> VPC/Subnet
- New UI:
    - Uses [Cloudscape Design](https://cloudscape.design/) System to make look and feel more consistent
    - Migrated from modal dialogs to React router for page management
    - New Views feature to allow users to scope searches to only resource types they are interested in

### Changed

- Filters in UI now operate on a per diagram basis, rather than globally
- Discovery process can now discover regions with tens of thousands of resources
- Migrated all backend APIs using API Gateway to AppSync
- Streamlined CloudFormation templates to improve reliability and deployment time

## [1.1.4] - 2022-04-01

### Added

### Changed

- Use official node.js Docker container for Discovery process ECS task

### Fixed

- Cost calculation bug due to UI using incorrect date

## [1.1.3] - 2022-02-01

### Added

- Missing icons for EC2 types and a few [others](https://github.com/awslabs/aws-perspective/issues/232)

### Changed

### Fixed

- Cost calculations to query on resourceIds as well as ARNs. https://github.com/awslabs/aws-perspective/issues/231
- Drawio export bug that was causing diagrams with collapsed nodes to cause an error. https://github.com/awslabs/aws-perspective/issues/219
- Hover over box when hovering over a resource it was going outside the screen. https://github.com/awslabs/aws-perspective/issues/220
- Slow deployment step that uploads files to S3. Increase **maxSockets** in HTTPS agent within the Lambda.

## [1.1.2] - 2021-11-03

### Added

- Amazon OpenSearch Service to discovery process Config queries.

### Changed

- Limiting the date pickers to select dates in the past. To limit confusion around the cost data Perspective displays.

### Fixed

- Fixed permissions errors preventing in-place upgrades.
- Fixed a bug causing Amazon Elasticsearch Service costs to be missed out when calculating estimated workload costs (https://github.com/awslabs/aws-perspective/issues/216).
- Fixed a bug causing cost query date not to update in the overview component.

## [1.1.1] - 2021-09-28

### Added

- Missing icons for MariaDB, Aurora, SQL-Server RDS types.
- OpensearchMultiAz parameter to CloudFormation template to set Amazon OpenSearch Service up with a single instance.

### Changed

- Migrated from Lambda@Edge to CloudFront Functions to handle secure headers for web requests to the frontend.
- References to Amazon Elasticsearch Service to Amazon OpenSearch Service

### Fixed

- Fixed a bug causing a blank screen when expanding nodes whilst filters are enabled - https://github.com/awslabs/aws-perspective/issues/201
- Fixed a bug that meant the time period for cost report queries was not persisted - https://github.com/awslabs/aws-perspective/issues/200
- Fixed a bug that could result in python files being incorrectly excluded - https://github.com/awslabs/aws-perspective/issues/64
- A bug causing some resource types to throw an exception when clicking "Show more details"

## [1.1.0] - 2021-08-26

### Added

- Support for newer ECS task ARNs
- Version number to UI side panel to show which version of Perspective is deployed.
- Ability to select Elasticsearch instance type on deploy ([#53](https://github.com/awslabs/aws-perspective/issues/53))
- Ability to update Perspective in-place rather than re-installing ([#86](https://github.com/awslabs/aws-perspective/issues/86))
- Support for Redshift resources
- Upload a CSV containing Regions during the import process
- "Costs & Usage" component in the UI.
- "Cost report" option on the canvas to see a breakdown of the costs for a workload

### Changed

- Fix API Gateway logging issue ([#81](https://github.com/awslabs/aws-perspective/issues/81))
- Fix access log bucket deletion issue ([#30](https://github.com/awslabs/aws-perspective/issues/30))
- Fix filters issue ([#46](https://github.com/awslabs/aws-perspective/issues/46))
- Fix lambda layer files that were erroneously in .gitignore ([#64](https://github.com/awslabs/aws-perspective/issues/64))
- Fix unnecessary ConfigAggregator deployment in account import template ([#73](https://github.com/awslabs/aws-perspective/issues/73))
- Fix API Gateway logging issue ([#81](https://github.com/awslabs/aws-perspective/issues/81))
- Show resource names instead of IDs where possible ([#90](https://github.com/awslabs/aws-perspective/pull/90))
- Fixed README examples for using the API ([#92](https://github.com/awslabs/aws-perspective/issues/92))
- Fixed cost bucket not being removed on deletion ([#97](https://github.com/awslabs/aws-perspective/issues/97))
- Fixed Docker Hub rate limit for downloading images. ([#93](https://github.com/awslabs/aws-perspective/issues/93))
- Enable buildspec.yaml customization ([#111](https://github.com/awslabs/aws-perspective/issues/111))
- Fix IAM permissions when checking for duplicate ECS tasks ([#112](https://github.com/awslabs/aws-perspective/issues/112))
- Increased zoom on canvas to visualize larger diagrams
- Cost data is now retrieved from a new API that queries Cost and Usage Reports via Athena (manual steps to set up are still required)
- Improved the "Getting started" wizard to help new users.
- Improved filtering to allow user to include or exclude resources of a certain type.

## [1.0.1] - 2020-09-29

- Added 'Save Template' option when importing new accounts and Regions. This removes the need to enable public access objects in the AmplifyStorageBucket
- Altered wording around visibility levels when saving architecture diagrams. 'You' and 'All users' is now used instead of 'public' and 'private'.
- Fixed bug that was causing import configurations to become corrupt when an account or Region was deleted by the UI if a discovery was in progress.
- Fixed bug leading to invalid JSON being generated in CloudFormation templates for importing accounts and Regions.
- Fixed Dependabot issues raised by GitHub
- Fixed bug leading to RestApi icons not being displayed in Firefox.
- Added support for Amazon QLDB Ledgers.
- Updated README.

## [1.0.0] - 2020-09-21

- Initial release
