// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {beforeEach, test, describe, expect, vi} from 'vitest';
import React from 'react';
import {parseEC2Instance} from '../../../../../../API/NodeFactory/NodeParsers/EC2Instance/EC2InstanceParser';
import {fetchImage} from '../../../../../../Utils/ImageSelector';
import {createInstanceConfiguration} from './data/ec2Types';
import InstanceItem from '../../../../../../API/NodeFactory/NodeParsers/EC2Instance/InstanceDetails/InstanceItem';

describe('EC2InstanceParser', () => {
    beforeEach(() => {
        vi.resetModules(); // this is important - it clears the cache
    });

    test('when node is an ec2 instance with type z1d that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'z1d.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('z1d', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type z1d that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'z1d.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('z1d', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type z1d that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'z1d.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('z1d', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type x1e that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                instanceType: 'x1e.micro',
                configuration: createInstanceConfiguration(
                    'x1e.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('x1e', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type x1e that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'x1e.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('x1e', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type x1e that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'x1e.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('x1e', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type x1 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'x1.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('x1', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type x1 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'x1.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('x1', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type x1 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'x1.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('x1', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t3a that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't3a.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('t3a', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t3a that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't3a.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('t3a', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t3a that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't3a.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('t3a', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t3 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't3.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('t3', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t3 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't3.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('t3', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t3 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't3.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('t3', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type r5 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'r5.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('r5', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type r5 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'r5.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('r5', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type r5 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'r5.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('r5', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type r4 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'r4.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('r4', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type r4 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'r4.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('r4', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type r4 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'r4.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('r4', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type p3 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'p3.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('p3', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type p3 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'p3.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('p3', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type p3 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'p3.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('p3', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type p2 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'p2.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('p2', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type p2 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'p2.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('p2', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type p2 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'p2.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('p2', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m5a that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm5a.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('m5a', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m5a that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm5a.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('m5a', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m5a that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm5a.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('m5a', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m5 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm5.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('m5', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m5 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm5.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('m5', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m5 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm5.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('m5', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m4 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm4.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('m4', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m4 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm4.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('m4', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type m4 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'm4.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('m4', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type i3 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'i3.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('i3', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type i3 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'i3.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('i3', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type i3 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'i3.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('i3', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type h1 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'h1.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('h1', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type h1 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'h1.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('h1', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type h1 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'h1.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('h1', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type g3 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'g3.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('g3', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type g3 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'g3.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('g3', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type g3 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'g3.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('g3', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type f1 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'f1.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('f1', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type f1 that is in warning state it returns correct icon and components', () => {
        process.env.PUBLIC_URL = '';

        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'f1.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('f1', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type f1 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'f1.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('f1', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type d2 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'd2.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('d2', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type d2 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'd2.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('d2', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type d2 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'd2.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('d2', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c5n that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c5n.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('c5n', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c5n that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c5n.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('c5n', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c5n that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c5n.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('c5n', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c5 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c5.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('c5', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c5 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c5.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('c5', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c5 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c5.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('c5', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };
        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c4 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c4.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('c4', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c4 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c4.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('c4', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type c4 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'c4.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('c4', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type a1 that is in healthy state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'a1.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('a1', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type a1 that is in warning state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'a1.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('a1', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type a1 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    'a1.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('a1', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t2 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't2.micro',
                    'running'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102',
            },
            icon: fetchImage('t2', {
                status: 'status-available',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t2 that is in error state it returns correct icon and components', () => {
        process.env.PUBLIC_URL = '';

        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't2.micro',
                    'provisioning'
                ),
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
            icon: fetchImage('t2', {
                status: 'status-warning',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node is an ec2 instance with type t2 that is in error state it returns correct icon and components', () => {
        const node = {
            name: 'anEC2Instance',
            properties: {
                resourceType: 'AWS::EC2::Instance',
                configuration: createInstanceConfiguration(
                    't2.micro',
                    'shutting-down'
                ),
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'shutting-down',
                colour: '#D13212',
            },
            icon: fetchImage('t2', {
                status: 'status-negative',
            }),
            detailsComponent: (
                <InstanceItem
                    title="Instance Details"
                    configuration={node.properties.configuration}
                />
            ),
        };

        const result = parseEC2Instance(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });
});
