// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const AWS = require('aws-sdk');
const response = require('./cfn-response');

exports.handler = function(event, context, callback) {
    const s3 = new AWS.S3();
    const putConfigRequest = function(notificationConfiguration) {
        return new Promise(function(resolve, reject) {
            s3.putBucketNotificationConfiguration({
                Bucket: event.ResourceProperties.BucketName,
                NotificationConfiguration: notificationConfiguration
            }, function(err, data) {
                if (err) reject({ msg: this.httpResponse.body.toString(), error: err, data: data });
                else resolve(data);
            });
        });
    };
    const newNotificationConfig = {};
    if (event.RequestType !== 'Delete') {
        newNotificationConfig.LambdaFunctionConfigurations = [{
            Events: [ 's3:ObjectCreated:*' ],
            LambdaFunctionArn: event.ResourceProperties.TargetLambdaArn || 'missing arn',
            Filter: { Key: { FilterRules: [ { Name: 'prefix', Value: 'aws-perspective' }, { Name: 'suffix', Value: '.snappy.parquet' } ] } }
        }];
    }
    putConfigRequest(newNotificationConfig).then(function(result) {
        response.send(event, context, response.SUCCESS, result);
        callback(null, result);
    }).catch(function(error) {
        response.send(event, context, response.FAILED, error);
        console.log(error);
        callback(error);
    });
};
