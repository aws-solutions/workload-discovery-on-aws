// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const R = require('ramda');

const stringInterpolationRegex = /(?<=\$\{)(.*?)(?=\})/g;

function isObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function getRel(schema, rel) {
    const [k, ...path] = rel.split('.');
    return R.path(path, schema[k]);
}

function generate(schema) {
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
                        return acc.replace('${' + match + '}', getRel(schema, match));
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

function generateBaseResource(accountId, awsRegion, resourceType, num) {
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

function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    generate,
    generateBaseResource,
    generateRandomInt
}
