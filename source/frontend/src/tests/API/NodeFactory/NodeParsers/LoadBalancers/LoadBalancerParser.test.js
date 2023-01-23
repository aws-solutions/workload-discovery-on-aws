// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { beforeEach, test, describe, expect, vi } from 'vitest'
import React from 'react';
import { parseLoadBalancer } from '../../../../../API/NodeFactory/NodeParsers/LoadBalancers/LoadBalancerParser';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import {
  internalApplication,
  internalClassic,
  internalNetwork,
  internetApplication,
  internetClassic,
  internetNetwork
} from './data/loadbalancers';
import LoadBalancerItem from '../../../../../API/NodeFactory/NodeParsers/LoadBalancers/LoadBalancerDetails/LoadBalancerItem'

describe('LoadBalancerParser', () => {

    beforeEach(() => {
        vi.resetModules(); // this is important - it clears the cache
    });

    test('when node is a load balancer of scheme internal and type application that is in warning state', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'application',
                configuration: internalApplication,
                state: 'provisioning'
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

    test('when node is a load balancer of scheme internet-facing and type application that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'application',
                configuration: internetApplication,
                state: 'provisioning'
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

    test('when node is a load balancer of scheme internal and type network that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'network',
                configuration: internalNetwork,
                state: 'provisioning'
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
    test('when node is a load balancer of scheme internet-facing and type network that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'network',
                configuration: internetNetwork,
                state: 'provisioning'
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

    test('when node is a load balancer of scheme internal and type classic that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: internalClassic,
                state: 'provisioning'
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
            icon: fetchImage('AWS::ElasticLoadBalancing::LoadBalancer', {
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
    test('when node is a load balancer of scheme internet-facing and type classic that is in warning health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: internetClassic,
                state: 'provisioning'
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
            icon: fetchImage('AWS::ElasticLoadBalancing::LoadBalancer', {
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


    test('when node is a load balancer of scheme internal and type application that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'application',
                configuration: internalApplication,
                state: 'running'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
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

    test('when node is a load balancer of scheme internet-facing and type application that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'application',
                configuration: internetApplication,
                state: 'running'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
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

    test('when node is a load balancer of scheme internal and type network that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'network',
                configuration: internalNetwork,
                state: 'running'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
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
    test('when node is a load balancer of scheme internet-facing and type network that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'network',
                configuration: internetNetwork,
                state: 'running'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
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

    test('when node is a load balancer of scheme internal and type classic that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: internalClassic,
                state: 'running'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102'
            },
            icon: fetchImage('AWS::ElasticLoadBalancing::LoadBalancer', {
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
    test('when node is a load balancer of scheme internet-facing and type classic that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: internetClassic,
                state: 'running'
            }
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'running',
                colour: '#1D8102'
            },
            icon: fetchImage('AWS::ElasticLoadBalancing::LoadBalancer', {
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

    test('when node is a load balancer of scheme internal and type application that is in error state', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'application',
                configuration: internalApplication,
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

    test('when node is a load balancer of scheme internet-facing and type application that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'application',
                configuration: internetApplication,
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

    test('when node is a load balancer of scheme internal and type network that is in bad health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'network',
                configuration: internalNetwork,
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
    test('when node is a load balancer of scheme internet-facing and type network that is in bad health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
                type: 'network',
                configuration: internetNetwork,
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

    test('when node is a load balancer of scheme internal and type classic that is in good health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: internalClassic,
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
            icon: fetchImage('AWS::ElasticLoadBalancing::LoadBalancer', {
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
    test('when node is a load balancer of scheme internet-facing and type classic that is in bad health with state in name as json', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: internetClassic,
                state: '{"name":"failed"}'
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
            icon: fetchImage('AWS::ElasticLoadBalancing::LoadBalancer', {
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

    test('when node is a load balancer of scheme internet-facing and type classic that is in bad health', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: internetClassic,
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
            icon: fetchImage('AWS::ElasticLoadBalancing::LoadBalancer', {
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

    test('when node is a load balancer of scheme internet-facing and type application with undefined state', () => {
        const node = {
            name: 'aLoadBalancerInstance',
            properties: {
                resourceType: 'AWS::ElasticLoadBalancing::LoadBalancer',
                configuration: internetApplication,
                type: 'application',
                state: undefined
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
