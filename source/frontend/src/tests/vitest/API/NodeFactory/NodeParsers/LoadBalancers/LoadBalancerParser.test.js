// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { beforeEach, test, describe, expect, vi } from 'vitest'
import React from 'react';
import { parseLoadBalancer } from '../../../../../../API/NodeFactory/NodeParsers/LoadBalancers/LoadBalancerParser';
import { fetchImage } from '../../../../../../Utils/ImageSelector';
import {
    createExternalAlb, createExternalNlb, createInternalAlb, createInternalNlb
} from './data/loadbalancers';
import LoadBalancerItem from '../../../../../../API/NodeFactory/NodeParsers/LoadBalancers/LoadBalancerDetails/LoadBalancerItem'

describe('LoadBalancerParser', () => {

    beforeEach(() => {
        vi.resetModules(); // this is important - it clears the cache
    });

    test('when node is an internal ALB that is in provisioning state', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createInternalAlb('provisioning')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-application', {
                status: 'status-warning'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an internet-facing ALB that is in provisioning', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createExternalAlb('provisioning')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-application', {
                status: 'status-warning'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an internal NLB that is provisioning', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createInternalNlb('provisioning')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-network', {
                status: 'status-warning'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an internet-facing NLB that is provisioning', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createExternalNlb('provisioning')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-network', {
                status: 'status-warning'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an internal ALB that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createInternalAlb('active')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-application', {
                status: 'status-available'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an external ALB in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createExternalAlb('active')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-application', {
                status: 'status-available'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an internal NLB in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createInternalNlb('active')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-network', {
                status: 'status-available'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an external NLB in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createExternalNlb('active')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-network', {
                status: 'status-available'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an internal ALB in an error state', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createInternalAlb('failed')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-application', {
                status: 'status-negative'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an external ALB in an error state', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createExternalAlb('failed')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-application', {
                status: 'status-negative'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an internal NLB in bad health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'network',
                configuration: createInternalNlb('failed'),
                state: 'failed'
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-network', {
                status: 'status-negative'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });
    test('when node is an external NLB in bad health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                configuration: createExternalNlb('failed')
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
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-network', {
                status: 'status-negative'
            }),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

    test('when node is an external ALB with undefined state', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: createExternalAlb(void 0)
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'no state data',
                colour: '#FF9900'
            },
            icon: fetchImage('AWS::ElasticLoadBalancingV2::LoadBalancer-application'),
            detailsComponent: (
                <LoadBalancerItem
                    title='Load Balancer Details'
                    configuration={node.properties.configuration}
                />
            ),

        };

        const result = parseLoadBalancer(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
    });

});
