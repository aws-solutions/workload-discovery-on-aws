// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import https from 'https';
import url from 'url';

export const SUCCESS = 'SUCCESS';
export const FAILED = 'FAILED';

export function send(
    event,
    context,
    responseStatus,
    responseData,
    physicalResourceId,
    noEcho
) {
    const responseBody = JSON.stringify({
        Status: responseStatus,
        Reason:
            'See the details in CloudWatch Log Stream: ' +
            context.logStreamName,
        PhysicalResourceId: physicalResourceId || context.logStreamName,
        StackId: event.StackId,
        RequestId: event.RequestId,
        LogicalResourceId: event.LogicalResourceId,
        NoEcho: noEcho || false,
        Data: responseData,
    });

    console.log('Response body:\n', responseBody);

    const parsedUrl = url.parse(event.ResponseURL);
    const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: 'PUT',
        headers: {
            'content-type': '',
            'content-length': responseBody.length,
        },
    };

    const request = https.request(options, function (response) {
        console.log('Status code: ' + response.statusCode);
        console.log('Status message: ' + response.statusMessage);
        context.done();
    });

    request.on('error', function (error) {
        console.log('send(..) failed executing https.request(..): ' + error);
        context.done();
    });

    request.write(responseBody);
    request.end();
}
