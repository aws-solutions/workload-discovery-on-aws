// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import fs from 'node:fs';
import {Logger} from '@aws-lambda-powertools/logger';

const logger = new Logger({serviceName: 'WdAccountImportTemplateApi'});

const globalTemplate = fs.readFileSync(
    `${import.meta.dirname}/global-resources.template`,
    'utf8'
);
const regionalTemplate = fs.readFileSync(
    `${import.meta.dirname}/regional-resources.template`,
    'utf8'
);

async function replaceGlobalTemplateSubstitutes(
    {accountId, region, discoveryRoleArn, externalId, myApplicationsLambdaRoleArn, version},
    template
) {
    return template
        .replace('<<substitute_account_id>>', accountId)
        .replace('<<substitute_discovery_role>>', discoveryRoleArn)
        .replace('<<substitute_external_id>>', externalId)
        .replace(
            '<<substitute_my_applications_lambda_role>>',
            myApplicationsLambdaRoleArn
        )
        .replace('<<substitute_region>>', region)
        .replace('<VERSION>', version);
}

async function replaceRegionalTemplateSubstitutes(
    {accountId, region, version},
    template
) {
    return template
        .replace('<<substitute_account_id>>', accountId)
        .replace('<<substitute_region>>', region)
        .replace('<<substitute_version>>', version);
}

export function _handler(env) {
    return event => {
        const fieldName = event.info.fieldName;

        const userId = event.identity.sub ?? event.identity.username;
        logger.info(`User ${userId} invoked the ${fieldName} operation.`);

        const args = event.arguments;
        logger.info(
            'GraphQL arguments:',
            {arguments: args, operation: fieldName}
        );

        const {
            ACCOUNT_ID: accountId,
            DISCOVERY_ROLE_ARN: discoveryRoleArn,
            EXTERNAL_ID: externalId,
            MY_APPLICATIONS_LAMBDA_ROLE_ARN: myApplicationsLambdaRoleArn,
            REGION: region,
            SOLUTION_VERSION: version,
        } = env;

        switch (fieldName) {
            case 'getGlobalTemplate':
                return replaceGlobalTemplateSubstitutes(
                    {
                        accountId,
                        region,
                        discoveryRoleArn,
                        externalId,
                        myApplicationsLambdaRoleArn,
                        version,
                    },
                    globalTemplate
                );
            case 'getRegionalTemplate':
                return replaceRegionalTemplateSubstitutes(
                    {accountId, region, version},
                    regionalTemplate
                );
            default:
                return Promise.reject(
                    new Error(
                        `Unknown field, unable to resolve ${fieldName}.`
                    )
                );
        }
    };
}

export const handler = _handler(process.env);
