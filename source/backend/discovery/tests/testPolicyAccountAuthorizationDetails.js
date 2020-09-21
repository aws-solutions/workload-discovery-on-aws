const chai = require('chai');
const AccountAuthorizationDetailsMock = require('./mockAwsGetAccountAuthorizationDetails');
const GetAccountAuthorizationDetails = require("../src/discovery/getAccountAuthorizationDetails");
const PolicyAccountAuthorizationDetails = require("../src/discovery/policyAccountAuthorizationDetails");
const DataClientMock = require('./mockDataClient');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should successfully return a list of child policyStatements when calling processAuthorizationDetails', async () => {
  // Get the local managed policies
  const policyAccountAuthorizationDetails = new PolicyAccountAuthorizationDetails(DataClientMock);

  const testConfig = `{"policyName":"CodeBuildBasePolicy-zoom-api-eu-west-1","policyId":"XXX","arn":"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1","path":"/service-role/","defaultVersionId":"v5","attachmentCount":1,"permissionsBoundaryUsageCount":0,"isAttachable":true,"description":null,"createDate":"2019-06-24T12:03:58.000Z","updateDate":"2019-06-24T12:26:36.000Z","policyVersionList":[{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v5","isDefaultVersion":true,"createDate":"2019-06-24T12:26:36.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api-bucket%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v4","isDefaultVersion":false,"createDate":"2019-06-24T12:23:26.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-api%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v3","isDefaultVersion":false,"createDate":"2019-06-24T12:20:18.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v2","isDefaultVersion":false,"createDate":"2019-06-24T12:08:22.000Z"},{"document":"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-api%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-api%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D","versionId":"v1","isDefaultVersion":false,"createDate":"2019-06-24T12:03:58.000Z"}]}`;

  const results = await policyAccountAuthorizationDetails.processAuthorizationDetails("XXXXXXXXXXXX", "global", "XXX", testConfig, "arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1");

  const expected = [ { resourceId:
    'XXX|arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1|13927e19f9d09e45d15f1820aac93efb',
   resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
   accountId: 'XXXXXXXXXXXX',
   properties:
    { resourceId:
       'XXX|arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1|13927e19f9d09e45d15f1820aac93efb',
      resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
      accountId: 'XXXXXXXXXXXX',
      awsRegion: 'global',
      resources:
       [ 'arn:aws:logs:eu-west-1:XXXXXXXXXXXX:log-group:/aws/codebuild/zoom-api',
         'arn:aws:logs:eu-west-1:XXXXXXXXXXXX:log-group:/aws/codebuild/zoom-api:*' ],
      actions:
       [ 'logs:CreateLogGroup',
         'logs:CreateLogStream',
         'logs:PutLogEvents' ],
      effect: 'Allow',
      statement:
       { Effect: 'Allow',
         Resource:
          [ 'arn:aws:logs:eu-west-1:XXXXXXXXXXXX:log-group:/aws/codebuild/zoom-api',
            'arn:aws:logs:eu-west-1:XXXXXXXXXXXX:log-group:/aws/codebuild/zoom-api:*' ],
         Action:
          [ 'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents' ] },
      title:
       'Allow-logs:CreateLogGroup,logs:CreateLogStream,logs:PutLogEvents' } },
 { resourceId:
    'XXX|arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1|9a841032200515d742ef669e1d68c200',
   resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
   accountId: 'XXXXXXXXXXXX',
   properties:
    { resourceId:
       'XXX|arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1|9a841032200515d742ef669e1d68c200',
      resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
      accountId: 'XXXXXXXXXXXX',
      awsRegion: 'global',
      resources: [ 'arn:aws:s3:::codepipeline-eu-west-1-*' ],
      actions:
       [ 's3:PutObject',
         's3:GetObject',
         's3:GetObjectVersion',
         's3:GetBucketAcl',
         's3:GetBucketLocation' ],
      effect: 'Allow',
      statement:
       { Effect: 'Allow',
         Resource: [ 'arn:aws:s3:::codepipeline-eu-west-1-*' ],
         Action:
          [ 's3:PutObject',
            's3:GetObject',
            's3:GetObjectVersion',
            's3:GetBucketAcl',
            's3:GetBucketLocation' ] },
      title:
       'Allow-s3:PutObject,s3:GetObject,s3:GetObjectVersion,s3:GetBucketAcl,s3:GetBucketLocation' } },
 { resourceId:
    'XXX|arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1|4bca8b33ed24799cd75b67dacabd295f',
   resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
   accountId: 'XXXXXXXXXXXX',
   properties:
    { resourceId:
       'XXX|arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-api-eu-west-1|4bca8b33ed24799cd75b67dacabd295f',
      resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
      accountId: 'XXXXXXXXXXXX',
      awsRegion: 'global',
      resources: [ 'arn:aws:codecommit:eu-west-1:XXXXXXXXXXXX:zoom-api' ],
      actions: [ 'codecommit:GitPull' ],
      effect: 'Allow',
      statement:
       { Effect: 'Allow',
         Resource: [ 'arn:aws:codecommit:eu-west-1:XXXXXXXXXXXX:zoom-api' ],
         Action: [ 'codecommit:GitPull' ] },
      title: 'Allow-codecommit:GitPull' } } ];


  expect(results).to.deep.equal(expected);
});

it('Should successfully return an array of linked resources when calling processAuthorizationResources with valid s3 buckets', async () => {
  const input = ['arn:aws:s3:::zoom-api-bucket', 'arn:aws:s3:::zoom-api-bucket/*'];

  // Get the local managed policies
  const policyAccountAuthorizationDetails = new PolicyAccountAuthorizationDetails(DataClientMock);
  const results = await policyAccountAuthorizationDetails.processAuthorizationResources("XXXXXXXXXXXX", "global", input);

  let expected = [{
    link: 'f1a0dee0730aded0b22398076478a757',
    resourceType: 'AWS::S3::Bucket'
  }];

  expect(results).to.deep.equal(expected);
});

it('Should return an empty array when no linked resources are found when calling processAuthorizationResources', async () => {
  const input = ['arn:aws:s3:::zoom-apt', 'arn:aws:s3:::test-bucket/*'];

  // Get the local managed policies
  const policyAccountAuthorizationDetails = new PolicyAccountAuthorizationDetails(DataClientMock);
  const results = await policyAccountAuthorizationDetails.processAuthorizationResources("XXXXXXXXXXXX", "global", input);

  let expected = [];

  expect(results).to.deep.equal(expected);
});