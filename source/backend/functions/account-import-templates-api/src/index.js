const {promises: fs} = require("fs");

async function downloadTemplate({accountId, region}, fileName) {
    const template = await fs.readFile(`${__dirname}/${fileName}`, 'utf8');

    return template
        .replace('<<substitute_account_id>>', accountId)
        .replace('<<substitute_region>>', region);
}

function handler(env) {
    return event => {
        const args = event.arguments;
        console.log(JSON.stringify(args));
        const {ACCOUNT_ID: accountId, REGION: region} = env;

        switch (event.info.fieldName) {
            case 'getGlobalTemplate':
                return downloadTemplate({accountId, region}, 'global-resources.template');
            case 'getRegionalTemplate':
                return downloadTemplate({accountId, region}, 'regional-resources.template');
            default:
                return Promise.reject(new Error(`Unknown field, unable to resolve ${event.info.fieldName}.`));
        }
    }
}

exports.handler = handler(process.env);