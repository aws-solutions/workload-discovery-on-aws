// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const AWS_ORGANIZATIONS = 'AWS_ORGANIZATIONS';
export const GLOBAL_RESOURCES_TEMPLATE_FILENAME = 'global-resources.template';

export const DEFAULT_COSTS_INTERVAL = {
    type: 'relative',
    unit: 'day',
    amount: 5,
};

export const PSEUDO_RESOURCE_TYPES = new Set([
    'AWS::Tags::Tag',
    'AWS::IAM::InlinePolicy',
]);
