const AWS = require('aws-sdk');
const config = require('./config');
const ResponseHandler = require('./response-handler');
const S3Handler = require('./s3-handler');
const cfnHandler = require('./cfn-handler');
const cloudfrontHandler = require('./cloudfront-handler');

const customerS3 = new AWS.S3();
const cfn = new AWS.CloudFormation();
const cloudfront = new AWS.CloudFront();

exports.handler = async (event, context, callback) => {
    console.log('Event: ', JSON.stringify(event));

    const {
        setupUIFiles,
        setupDiscoveryFiles,
        removeFiles,
        writeSettings
    } = S3Handler(customerS3, config);

    const {createStack, updateStack, updateStackTermination, deleteStack, getResourceTypes} = cfnHandler(cfn, config);
    const {sendResponse} = ResponseHandler(event, context, callback);
    const {invalidateCache} = cloudfrontHandler(cloudfront, {getResourceTypes});

    const eventType = event.RequestType;

    let actions;
    if (eventType === 'Delete') {
        console.log('Deleting resources');
        actions = [removeFiles()];
    } else {
        console.log(`${eventType.slice(0, -1)}ing resources`);
        actions = [
            setupUIFiles(),
            setupDiscoveryFiles(),
            writeSettings()
        ];
    }

    await Promise.all(actions)
        .then(async () => {
            if (eventType === 'Delete') {
                console.log('disabling stack termination block')
                await updateStackTermination();
                console.log('disabled stack termination block')
                console.log('deleting stack')
                await deleteStack();
                console.log('deleted stack')
            } else if (eventType === 'Update') {
                await Promise.all([invalidateCache(), updateStack()]);
                console.log('Stack update and Cloudfront cache invalidation initiated.');
            } else {
                await createStack();
                console.log('Creating stack...');
            }

            console.log('All actions successfully performed');

            return sendResponse('SUCCESS', {
                Message: `Resources successfully ${eventType.toLowerCase()}d`
            });
        })
        .catch(err => console.log(err) || sendResponse('FAILED'));

    console.log('Finished');

};
