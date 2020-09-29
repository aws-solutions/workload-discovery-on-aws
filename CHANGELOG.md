# Change Log
All notable changes to this project are documented in this file.

Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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