# Change Log

All notable changes to this project are documented in this file.

Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - 2022-01-08

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
