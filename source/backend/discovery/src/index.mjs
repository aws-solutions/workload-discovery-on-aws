// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import logger from './lib/logger.mjs';
import * as config from './lib/config.mjs';
import {
    DISCOVERY_PROCESS_RUNNING,
    AWS_ORGANIZATIONS,
} from './lib/constants.mjs';
import {createAwsClient} from './lib/awsClient.mjs';
import appSync from './lib/apiClient/appSync.mjs';
import {discoverResources} from './lib/index.mjs';
import {
    AggregatorNotFoundError,
    OrgAggregatorValidationError,
} from './lib/errors.mjs';

const awsClient = createAwsClient();

const discover = async () => {
    logger.profile('Discovery of resources complete.');

    await discoverResources(appSync, awsClient, config).catch(err => {
        if ([DISCOVERY_PROCESS_RUNNING].includes(err.message)) {
            logger.info(err.message);
        } else {
            throw err;
        }
    });

    logger.profile('Discovery of resources complete.');
};

discover().catch(err => {
    if (err instanceof AggregatorNotFoundError) {
        logger.error(
            `${err.message}. Ensure the name of the supplied aggregator is correct.`
        );
    } else if (err instanceof OrgAggregatorValidationError) {
        logger.error(
            `${err.message}. You cannot use an individual accounts aggregator when cross account discovery is set to ${AWS_ORGANIZATIONS}.`,
            {
                aggregator: err.aggregator,
            }
        );
    } else {
        logger.error('Unexpected error in Discovery process.', {
            msg: err.message,
            stack: err.stack,
        });
    }
    process.exit(1);
});
