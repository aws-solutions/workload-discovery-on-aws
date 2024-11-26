// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {yamlParse} from 'yaml-cfn';
import {assert, describe, it} from 'vitest';
import {_handler} from '../src/index.mjs';

describe('index.js', () => {
    const ACCOUNT_ID = 'xxxxxxxxxxxx';
    const REGION = 'eu-west-1';
    const EXTERNAL_ID = 'stsExternalId'
    const DISCOVERY_ROLE_ARN = 'discoveryRoleArn';
    const MY_APPLICATIONS_LAMBDA_ROLE_ARN = 'myApplicationsLambdaRoleArn';
    const SOLUTION_VERSION = '9.9.9';

    describe('handler', () => {
        const handler = _handler({
            ACCOUNT_ID,
            DISCOVERY_ROLE_ARN,
            EXTERNAL_ID,
            MY_APPLICATIONS_LAMBDA_ROLE_ARN,
            REGION,
            SOLUTION_VERSION,
        });

        describe('getGlobalTemplate', () => {
            it('should incorporate account id into global template', async () => {
                const actual = await handler({
                    arguments: {},
                    identity: {username: 'testUser'},
                    info: {
                        fieldName: 'getGlobalTemplate',
                    },
                });
                const json = yamlParse(actual);
                assert.strictEqual(
                    json.Parameters.WorkloadDiscoveryAccountId.Default,
                    ACCOUNT_ID
                );
                assert.strictEqual(
                    json.Parameters.WorkloadDiscoveryAggregationRegion.Default,
                    REGION
                );
                assert.strictEqual(
                    json.Parameters.WorkloadDiscoveryDiscoveryRoleArn.Default,
                    DISCOVERY_ROLE_ARN
                );
                assert.strictEqual(
                    json.Parameters.WorkloadDiscoveryExternalId.Default,
                    EXTERNAL_ID
                );
                assert.strictEqual(
                    json.Parameters.MyApplicationsLambdaRoleArn.Default,
                    MY_APPLICATIONS_LAMBDA_ROLE_ARN
                );
                assert.strictEqual(
                    json.Description,
                    `This Cloudformation template sets up the roles needed to import data into Workload Discovery on AWS. (SO0075b) - Solution - Import Account Template (uksb-1r0720e57) (version:9.9.9)`
                );
            });
        });

        describe('getRegionalTemplate', () => {
            it('should incorporate account id and region into global template', async () => {
                const actual = await handler({
                    arguments: {},
                    identity: {username: 'testUser'},
                    info: {
                        fieldName: 'getRegionalTemplate',
                    },
                });
                const json = yamlParse(actual);
                assert.strictEqual(
                    json.Parameters.WorkloadDiscoveryAccountId.Default,
                    ACCOUNT_ID
                );
                assert.strictEqual(
                    json.Parameters.AggregationRegion.Default,
                    REGION
                );
                assert.strictEqual(
                    json.Description,
                    `This CloudFormation template sets up AWS Config so that it will start collecting resource information for the region Workload Discovery on AWS will discover. (SO0075c) - Solution - Import Region Template (uksb-1r0720e5f) (version:${SOLUTION_VERSION})`
                );
            });
        });

        describe('unknown field', () => {
            it('should reject payloads with unknown query', async () => {
                const actual = await handler({
                    arguments: {},
                    identity: {username: 'testUser'},
                    info: {
                        fieldName: 'foo',
                    },
                }).catch(err =>
                    assert.strictEqual(
                        err.message,
                        'Unknown field, unable to resolve foo.'
                    )
                );
            });
        });
    });
});
