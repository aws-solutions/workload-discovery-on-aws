// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as R from 'ramda';

const stringInterpolationRegex = /(?<=\$\{)(.*?)(?=\})/g;

function isObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function getRel(schema, rel) {
    const [k, ...path] = rel.split('.');
    return R.path(path, schema[k]);
}

export function generate(schema) {
    function interpolate(input) {
        if(isObject(input)) {
            return Object.entries(input).reduce((acc, [key, val]) => {
                acc[key] = interpolate(val);
                return acc;
            }, {});
        } else if(Array.isArray(input)) {
            return input.map(interpolate);
        } else {
            if(typeof input === 'string') {
                const matches = input.match(stringInterpolationRegex);
                if(matches != null) {
                    return matches.reduce((acc, match) => {
                        return acc.replace(
                            '${' + match + '}',
                            getRel(schema, match),
                        );
                    }, input);
                }
            }
            return input;
        }
    }

    const interpolated = R.map(interpolate, R.map(interpolate, schema));

    function generateRec(input) {
        if(isObject(input)) {
            if(input.$rel != null) {
                return getRel(interpolated, input.$rel);
            } else {
                return Object.entries(input).reduce((acc, [key, val]) => {
                    acc[key] = generateRec(val);
                    return acc;
                }, {});
            }
        } else if(Array.isArray(input)) {
            return input.map(generateRec);
        } else {
            return input;
        }
    }

    return R.map(generateRec, interpolated);
}

export function generateBaseResource(accountId, awsRegion, resourceType, num) {
    return {
        id: 'arn' + num,
        resourceId: 'resourceId' + num,
        resourceName: 'resourceName' + num,
        resourceType,
        accountId,
        arn: 'arn' + num,
        awsRegion,
        relationships: [],
        tags: [],
        configuration: {a: +num}
    };
}

export function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateAwsApiEndpoints(region) {
    const endpoints = [
        {url: 'https://iam.amazonaws.com', service: 'IAM'},
        {url: 'https://organizations.us-east-1.amazonaws.com', service: 'AWS Organizations'},
        {url: 'https://sts.{region}.amazonaws.com', service: 'STS'},
        {url: 'https://config.{region}.amazonaws.com', service: 'AWS Config'},
        {url: 'https://apigateway.{region}.amazonaws.com', service: 'API Gateway'},
        {url: 'https://dynamodb.{region}.amazonaws.com', service: 'DynamoDB'},
        {url: 'https://ec2.{region}.amazonaws.com', service: 'EC2'},
        {url: 'https://ecs.{region}.amazonaws.com', service: 'ECS'},
        {url: 'https://elasticloadbalancing.{region}.amazonaws.com', service: 'ELB'},
        {url: 'https://eks.{region}.amazonaws.com', service: 'EKS'},
        {url: 'https://lambda.{region}.amazonaws.com', service: 'Lambda'},
        {url: 'https://mediaconnect.{region}.amazonaws.com', service: 'MediaConnect'},
        {url: 'https://es.{region}.amazonaws.com', service: 'OpenSearch'},
        {url: 'https://sns.{region}.amazonaws.com', service: 'SNS'},
        {
            url: 'https://servicecatalog-appregistry.{region}.amazonaws.com',
            service: 'Service Catalog App Registry',
        },
        {url: 'https://logs.{region}.amazonaws.com', service: 'CloudWatch'},
        {url: 'https://appsync.{region}.amazonaws.com/graphql', service: 'AppSync API'},
    ];

    return endpoints.map(({url, service}) => {
        return {
            service,
            url: url.replace('{region}', region),
        };
    });
}
