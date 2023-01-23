// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { beforeEach, test, describe, expect, vi } from 'vitest'
import React from 'react';
import DatabaseInstanceItem from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceDetails/DatabaseInstanceItem';
import { parseDatabaseInstance } from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceParser';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import { postgres } from './data/dbTypes';

describe('DatabaseInstanceParserPostgres', () => {

    beforeEach(() => {
        vi.resetModules(); // this is important - it clears the cache
    });

    test('when node is an postgres rds instance with status as provisioning', () => {
        let postgresProv = JSON.parse(postgres);
        postgresProv.dBInstanceStatus = 'provisioning'
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(postgresProv),
                dBInstanceStatus: 'provisioning'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'provisioning',
                colour: '#FF9900'
            },
            icon: fetchImage('AWS::RDS::DBInstance-postgres', {
                status: 'status-warning'
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(postgresProv)}
                />
            )
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an postgres rds instance with status as pending', () => {
        let postgresPending = JSON.parse(postgres);
        postgresPending.dBInstanceStatus = 'pending'
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(postgresPending),
                dBInstanceStatus: 'pending'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'pending',
                colour: '#FF9900'
            },
            icon: fetchImage('AWS::RDS::DBInstance-postgres', {
                status: 'status-warning'
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(postgresPending)}
                />
            )
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an postgres rds instance with status as available', () => {
        let postgresAvailable = JSON.parse(postgres);
        postgresAvailable.dBInstanceStatus = 'available'
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(postgresAvailable),
                dBInstanceStatus: 'available'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'available',
                colour: '#1D8102'
            },
            icon: fetchImage('AWS::RDS::DBInstance-postgres', {
                status: 'status-available'
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(postgresAvailable)}
                />
            )
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an postgres rds instance with status as active', () => {
        let postgresActive = JSON.parse(postgres);
        postgresActive.dBInstanceStatus = 'active'
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(postgresActive),
                dBInstanceStatus: 'active'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'active',
                colour: '#1D8102'
            },
            icon: fetchImage('AWS::RDS::DBInstance-postgres', {
                status: 'status-available'
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(postgresActive)}
                />
            )
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an postgres rds instance with status as stopped', () => {
        let postgresStopped = JSON.parse(postgres);
        postgresStopped.dBInstanceStatus = 'stopped'
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(postgresStopped),
                dBInstanceStatus: 'stopped'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'stopped',
                colour: '#D13212'
            },
            icon: fetchImage('AWS::RDS::DBInstance-postgres', {
                status: 'status-negative'
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(postgresStopped)}
                />
            )
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an postgres rds instance with status as failed', () => {
        let postgresFailed = JSON.parse(postgres);
        postgresFailed.dBInstanceStatus = 'failed'
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(postgresFailed),
                dBInstanceStatus: 'failed'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'failed',
                colour: '#D13212'
            },
            icon: fetchImage('AWS::RDS::DBInstance-postgres', {
                status: 'status-negative'
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(postgresFailed)}
                />
            )
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

});
