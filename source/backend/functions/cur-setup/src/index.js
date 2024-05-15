// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const AWS = require('aws-sdk');
const response = require('./cfn-response');
const R = require('ramda');
const s3 = new AWS.S3();

const { CURCrawlerKey: cURCrawlerKey } = process.env;

exports.handler = function (event, context, callback) {
  if (event.RequestType === 'Delete') {
    response.send(event, context, response.SUCCESS);
  } else {
    if (event.Records) {
      R.forEach((record) => {
        console.log(JSON.stringify(record));
        console.log(
          `Downloading from ${record.s3.bucket.name}/${record.s3.object.key}`
        );
        const year = decodeURIComponent(R.split('/', record.s3.object.key)[3]);
        const month = decodeURIComponent(R.split('/', record.s3.object.key)[4]);
        const name = R.last(R.split('/', record.s3.object.key));
        console.log(`Name is ${name}`);
        console.log(`Month is ${month}`);
        console.log(`Year is ${year}`);
        console.log(`Uploading to ${record.s3.bucket.name}/${cURCrawlerKey}`);
        if (R.endsWith('.parquet', name)) {
          var params = {
            Bucket: record.s3.bucket.name,
            CopySource: `${record.s3.bucket.name}/${record.s3.object.key}`,
            Key: `${cURCrawlerKey}/${year}/${month}/${name}`,
          };
          s3.copyObject(params, function (err, data) {
            if (err) console.error(err, err.stack);
            // an error occurred
            else console.log('CUR Copied successfully'); // successful response
          });
        }
      }, event.Records);
    }

    const glue = new AWS.Glue();
    glue.startCrawler(
      { Name: 'AWSCURCrawler-aws-perspective-cost-and-usage' },
      function (err, data) {
        if (err) {
          const responseData = JSON.parse(this.httpResponse.body);
          if (responseData['__type'] == 'CrawlerRunningException') {
            callback(null, responseData.Message);
          } else {
            const responseString = JSON.stringify(responseData);
            if (event.ResponseURL) {
              response.send(event, context, response.FAILED, {
                msg: responseString,
              });
            } else {
              callback(responseString);
            }
          }
        } else {
          if (event.ResponseURL) {
            response.send(event, context, response.SUCCESS);
          } else {
            callback(null, response.SUCCESS);
          }
        }
      }
    );
  }
};
