// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {beforeEach, test, describe, expect, vi} from 'vitest'
import React from 'react';
import DatabaseInstanceItem from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceDetails/DatabaseInstanceItem';
import { parseDatabaseInstance } from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceParser';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import { unknown } from './data/dbTypes';

describe('DatabaseInstanceParserUnknown', () => {

    beforeEach(() => {
        vi.resetModules(); // this is important - it clears the cache
    });

    test('when node is an unknown rds instance with status as warning', () => {
        let unknownProv = JSON.parse(unknown);
        unknownProv.dBInstanceStatus = 'provisioning';
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(unknownProv),
                dBInstanceStatus: 'provisioning',
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'provisioning',
                colour: '#FF9900',
            },
            icon: fetchImage('AWS::RDS::DBInstance', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(unknownProv)}
                />
            ),
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an unknown rds instance with status as warning', () => {
        let unknownPending = JSON.parse(unknown);
        unknownPending.dBInstanceStatus = 'pending';
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(unknownPending),
                dBInstanceStatus: 'pending',
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'pending',
                colour: '#FF9900',
            },
            icon: fetchImage('AWS::RDS::DBInstance', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(unknownPending)}
                />
            ),
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an unknown rds instance with status as available', () => {
        let unknownAvailable = JSON.parse(unknown);
        unknownAvailable.dBInstanceStatus = 'available';
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(unknownAvailable),
                dBInstanceStatus: 'available',
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'available',
                colour: '#1D8102',
            },
            icon: fetchImage('AWS::RDS::DBInstance', {
                status: 'status-available',
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(unknownAvailable)}
                />
            ),
        };


        const result = parseDatabaseInstance(node);

        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an unknown rds instance with status as active', () => {
        let unknownActive = JSON.parse(unknown);
        unknownActive.dBInstanceStatus = 'active';
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(unknownActive),
                dBInstanceStatus: 'active',
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'active',
                colour: '#1D8102',
            },
            icon: fetchImage('AWS::RDS::DBInstance', {
                status: 'status-available',
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(unknownActive)}
                />
            ),
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an unknown rds instance with status as stopped', () => {
        let unknownStopped = JSON.parse(unknown);
        unknownStopped.dBInstanceStatus = 'stopped';
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(unknownStopped),
                dBInstanceStatus: 'stopped',
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'stopped',
                colour: '#D13212',
            },
            icon: fetchImage('AWS::RDS::DBInstance', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(unknownStopped)}
                />
            ),
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an unknown rds instance with status as failed', () => {
        let unknownFailed = JSON.parse(unknown);
        unknownFailed.dBInstanceStatus = 'failed';
        const node = {
            name: 'aDatabaseInstance',
            properties: {
                resourceType: 'AWS::RDS::DBInstance',
                configuration: JSON.stringify(unknownFailed),
                dBInstanceStatus: 'failed',
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'failed',
                colour: '#D13212',
            },
            icon: fetchImage('AWS::RDS::DBInstance', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <DatabaseInstanceItem
                    title='Instance Details'
                    configuration={JSON.stringify(unknownFailed)}
                />
            ),
        };

        const result = parseDatabaseInstance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });


});
