// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {beforeEach, test, describe, expect, vi} from 'vitest';
import React from 'react';
import StatementItem from '../../../../../../API/NodeFactory/NodeParsers/CustomerManagedPolicyStatement/Statement/StatementItem';
import {parseCustomerManagedPolicyStatement} from '../../../../../../API/NodeFactory/NodeParsers/CustomerManagedPolicyStatement/CustomerManagedPolicyStatementParser';
import {fetchImage} from '../../../../../../Utils/ImageSelector';
import {
    atRiskActionsResources,
    atRiskActionsNeedsAttentionResources,
    needsAttentionActionsNeedsAttentionResources,
    okActionsAtRiskResources,
    atRiskActionsOKResources,
    needsAttentionActionsOKResources,
    okActionsNeedsAttentionResources,
    okActionsOKResources,
    okActionsNotArrayOKResources,
    okActionsOKResourcesArray,
} from './data/statement.js';

describe('CustomerManagedPolicyStatementParser', () => {
    beforeEach(() => {
        vi.resetModules(); // this is important - it clears the cache
    });

    test('when node that is customer managed policy statement with at risk actions and at risk resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: atRiskActionsResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: atRiskActionsResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message:
                    'This is not secure. You should lockdown your policy statements by providing ARNs and full action names',
                colour: '#D13212',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-negative',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(atRiskActionsResources)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with at risk actions and needs attention resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: atRiskActionsNeedsAttentionResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: atRiskActionsNeedsAttentionResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message:
                    'This is not secure. You should lockdown your policy statements by providing ARNs and full action names',
                colour: '#D13212',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-negative',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(atRiskActionsNeedsAttentionResources)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with needs attention actions and needs attention resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: needsAttentionActionsNeedsAttentionResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: needsAttentionActionsNeedsAttentionResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                message:
                    'You could further lockdown your policy by providing full resource ARNs and actions and removing any wildcards',
                colour: '#FF9900',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-warning',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(
                        needsAttentionActionsNeedsAttentionResources
                    )}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with ok actions and at risk resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: okActionsAtRiskResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: okActionsAtRiskResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message:
                    'This is not secure. You should lockdown your policy statements by providing ARNs and full action names',
                colour: '#D13212',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-negative',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(okActionsAtRiskResources)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with at risk actions and ok resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: atRiskActionsOKResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: atRiskActionsOKResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#D13212',
                borderOpacity: 0.25,
                borderSize: 1,
                message:
                    'This is not secure. You should lockdown your policy statements by providing ARNs and full action names',
                colour: '#D13212',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-negative',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(atRiskActionsOKResources)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with needs attention actions and ok resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: needsAttentionActionsOKResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: needsAttentionActionsOKResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                message:
                    'You could further lockdown your policy by providing full resource ARNs and actions and removing any wildcards',
                colour: '#FF9900',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-warning',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(needsAttentionActionsOKResources)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with ok actions and needs attention resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: okActionsNeedsAttentionResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: okActionsNeedsAttentionResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#FF9900',
                borderOpacity: 0.25,
                borderSize: 1,
                message:
                    'You could further lockdown your policy by providing full resource ARNs and actions and removing any wildcards',
                colour: '#FF9900',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-warning',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(okActionsNeedsAttentionResources)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with ok actions and ok resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: okActionsOKResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: okActionsOKResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'The actions and resources covered by this statement',
                colour: '#1D8102',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-available',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(okActionsOKResources)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with ok actions not array and ok resources is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: okActionsNotArrayOKResources,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: okActionsNotArrayOKResources,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'The actions and resources covered by this statement',
                colour: '#1D8102',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-available',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(okActionsNotArrayOKResources)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });

    test('when node that is customer managed policy statement with ok actions and ok resources in array is parsed', () => {
        const node = {
            name: 'aPolicyStatement',
            properties: {
                configuration: okActionsOKResourcesArray,
                resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
                statement: okActionsOKResourcesArray,
            },
        };
        const expectedResult = {
            styling: {
                borderStyle: 'dotted',
                borderColour: '#1D8102',
                borderOpacity: 0.25,
                borderSize: 1,
                message: 'The actions and resources covered by this statement',
                colour: '#1D8102',
            },
            icon: fetchImage(node.properties.resourceType, {
                status: 'status-available',
            }),
            detailsComponent: (
                <StatementItem
                    title="Statement"
                    statement={JSON.parse(okActionsOKResourcesArray)}
                />
            ),
        };

        const result = parseCustomerManagedPolicyStatement(node);
        expect(result.styling).toEqual(expectedResult.styling);
        expect(result.icon).toEqual(expectedResult.icon);
        expect(result.detailsComponent).toEqual(
            expectedResult.detailsComponent
        );
    });
});
