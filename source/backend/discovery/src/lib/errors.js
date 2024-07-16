// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

class AggregatorNotFoundError extends Error {
    constructor(aggregatorName) {
        super(`Aggregator ${aggregatorName} was not found`);
        this.name = 'AggregatorValidationError';
        this.aggregatorName = aggregatorName;
    }
}

class OrgAggregatorValidationError extends Error {
    constructor(aggregator) {
        super('Config aggregator is not an organization wide aggregator');
        this.name = 'AggregatorValidationError';
        this.aggregator = aggregator;
    }
}

module.exports = {
    AggregatorNotFoundError,
    OrgAggregatorValidationError
}
