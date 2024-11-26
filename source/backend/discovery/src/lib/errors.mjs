// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export class UnprocessedOpenSearchResourcesError extends Error {
    constructor(failures) {
        super('Error processing resources.');
        this.name = 'UnprocessedOpenSearchResourcesError';
        this.failures = failures;
    }
}

export class AggregatorNotFoundError extends Error {
    constructor(aggregatorName) {
        super(`Aggregator ${aggregatorName} was not found`);
        this.name = 'AggregatorValidationError';
        this.aggregatorName = aggregatorName;
    }
}

export class OrgAggregatorValidationError extends Error {
    constructor(aggregator) {
        super('Config aggregator is not an organization wide aggregator');
        this.name = 'AggregatorValidationError';
        this.aggregator = aggregator;
    }
}
