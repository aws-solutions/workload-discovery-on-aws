const AWS = require('aws-sdk');
const ResponseHandler = require('./response-handler');
const S3Handler = require('./s3-handler');
const cfnHandler = require('./cfn-handler');
const customerS3 = new AWS.S3();
const cloudformation = new AWS.CloudFormation();

// const { EXECUTION_ROLE } = process.env;

exports.handler = async (event, context, callback) => {
  
    const {
      setupUIFiles,
      setupDiscoveryFiles,
      writeAccountImportTemplate,
      writeRegionImportTemplate,
      removeFiles,
      writeSettings
    } = S3Handler(customerS3);
    const { executeStack } = cfnHandler(cloudformation);
    const { sendResponse } = ResponseHandler(event, context, callback);
    const eventType = event.RequestType;
    let actions;
    if (eventType === 'Delete') {
      console.log('Deleting resources');
      actions = [removeFiles()];
    } else {
      console.log('Creating resources');
      actions = [
        await setupUIFiles(),
        await setupDiscoveryFiles(),
        await writeAccountImportTemplate(),
        await writeRegionImportTemplate(),
        await writeSettings()
      ];
    }
    await Promise.all(actions)
      .then(() => {
        console.log('All actions successfully performed');
        return sendResponse('SUCCESS', {
          Message: `Resources successfully ${eventType.toLowerCase()}d`
        });
      })
      .catch(err => console.log(err) || sendResponse('FAILED'));
    if (eventType === 'Delete') {
      console.log("Deleting resources so don't execute stack");
    } else {
      await executeStack();
    }
    console.log('Finished');
  // };
};
