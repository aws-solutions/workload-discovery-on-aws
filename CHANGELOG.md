# Change Log

All notable changes to this project are documented in this file.

Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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