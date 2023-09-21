// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs");
const globalTemplate = fs.readFileSync(`${__dirname}/global-resources.template`, 'utf8');
const regionalTemplate = fs.readFileSync(`${__dirname}/regional-resources.template`, 'utf8');

async function replaceTemplateSubstitutes({accountId, discoveryRoleArn, region}, template) {
    return template
        .replace('<<substitute_account_id>>', accountId)
        .replace('<<substitute_region>>', region)
        .replace('<<substitute_discovery_role>>', discoveryRoleArn);
}

function handler(env) {
    return event => {
        const args = event.arguments;
        console.log(JSON.stringify(args));
        const {ACCOUNT_ID: accountId, DISCOVERY_ROLE_ARN: discoveryRoleArn, REGION: region} = env;

        switch (event.info.fieldName) {
            case 'getGlobalTemplate':
                return replaceTemplateSubstitutes({accountId, discoveryRoleArn, region}, globalTemplate);
            case 'getRegionalTemplate':
                return replaceTemplateSubstitutes({accountId, discoveryRoleArn, region}, regionalTemplate);
            default:
                return Promise.reject(new Error(`Unknown field, unable to resolve ${event.info.fieldName}.`));
        }
    }
}

exports.handler = handler(process.env);