const mime = require('mime-types');
const R = require('ramda');
const unzip = require('unzipper');

const ACL = 'private';
const UI_FILE = 'ui.zip';
const DISCOVERY_ZIP = 'discovery.zip';
const CONFIG_FILENAME = 'settings.js';

module.exports = (customerS3, config) => {
    const {
        ACCOUNT_ID,
        API_GATEWAY,
        DRAWIO_API_GATEWAY,
        COGNITO_IDENTITY_POOL,
        COGNITO_USER_POOL_ID,
        COGNITO_USER_POOL_WEB_CLIENT_ID,
        DEPLOYMENT_BUCKET,
        DEPLOYMENT_BUCKET_KEY,
        REGION,
        WEBUI_BUCKET,
        DISCOVERY_BUCKET,
        ANONYMOUS_METRIC_OPT_OUT,
        AMPLIFY_STORAGE_BUCKET,
        APPSYNC_API_GRAPHQL_URL,
        VERSION
    } = config;

  const customerListFiles = (params) => customerS3.listObjects(params).promise();
  const customerPutObject = (params) => customerS3.putObject(params).promise();
  const customerUpload = (params) => customerS3.upload(params).promise();

  console.dir(`${DEPLOYMENT_BUCKET}/${DEPLOYMENT_BUCKET_KEY}`);
  console.dir(`Uploading Web UI artifacts into ${WEBUI_BUCKET}`);
  console.dir(`Uploading Discovery artifacts into ${DISCOVERY_BUCKET}`);

  const deleteFiles = (objects, bucket, withVersioning) => {
    console.log('removing files as stack is being torn down.');
    const mapper = withVersioning
      ? ({ Key, VersionId }) => ({ Key, VersionId })
      : ({ Key }) => ({ Key });

    return customerS3
      .deleteObjects({
        Bucket: bucket,
        Delete: { Objects: objects.map(mapper), Quiet: false },
      })
      .promise();
  };

  return {
    setupUIFiles: () =>
      unzip.Open.s3(customerS3, {
        Bucket: DEPLOYMENT_BUCKET,
        Key: `${DEPLOYMENT_BUCKET_KEY}/${UI_FILE}`,
      })
        .then((directory) =>
          directory.files.filter((x) => x.type !== 'Directory')
        )
        .then((files) =>
            files.map(async file => {
                return customerUpload({
                    ACL,
                    Body: file.stream(),
                    Bucket: WEBUI_BUCKET,
                    ContentType: mime.lookup(file.path) || 'application/octet-stream',
                    Key: file.path,
                })
            })
        )
        .then(ps => Promise.all(ps))
        .catch(err => console.error(`${err} were detected in ui file copy`)),

    setupDiscoveryFiles: () =>
      customerS3
        .getObject({
          Bucket: DEPLOYMENT_BUCKET,
          Key: `${DEPLOYMENT_BUCKET_KEY}/${DISCOVERY_ZIP}`,
        })
        .promise()
        .then((response) =>
          customerUpload({
            ACL,
            Body: response.Body,
            Bucket: DISCOVERY_BUCKET,
            ContentType: response.ContentType,
            Key: DISCOVERY_ZIP,
          })
        )
        .catch((err) =>
          console.error(`${err} was detected in account import file copy`)
        ),

    removeFiles: () =>
      Promise.all([
        customerListFiles({ Bucket: WEBUI_BUCKET }),
        customerListFiles({ Bucket: DISCOVERY_BUCKET }),
      ])
        .then(([uiObjects, discoveryObjects]) => {
          const toDo = [];
          if (uiObjects.Contents.length > 0)
            toDo.push(deleteFiles(uiObjects.Contents, WEBUI_BUCKET, false));
          if (discoveryObjects.Contents.length > 0)
            toDo.push(
              deleteFiles(discoveryObjects.Contents, DISCOVERY_BUCKET, false)
            );
          return Promise.all(toDo);
        })
        .catch((err) =>
          console.error(`${err} was detected in deleting files copy`)
        ),

    writeSettings: () =>
      customerPutObject({
        ACL,
        Bucket: WEBUI_BUCKET,
        Key: CONFIG_FILENAME,
        ContentType: 'text/javascript',
        Body: `window.amplify = ${JSON.stringify({
          Auth: {
            mandatorySignIn: true,
            identityPoolId: COGNITO_IDENTITY_POOL,
            region: REGION,
            userPoolId: COGNITO_USER_POOL_ID,
            userPoolWebClientId: COGNITO_USER_POOL_WEB_CLIENT_ID,
          },
          API: {
            aws_appsync_graphqlEndpoint: APPSYNC_API_GRAPHQL_URL,
            aws_appsync_region: REGION,
            aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
            endpoints: [
              {
                name: 'PerspectiveWebRestAPI',
                endpoint: API_GATEWAY,
              },
              {
                name: 'PerspectiveDrawioWebRestAPI',
                endpoint: DRAWIO_API_GATEWAY,
              },
            ],
          },
          Storage: {
            AWSS3: {
              bucket: AMPLIFY_STORAGE_BUCKET,
              region: REGION, //OPTIONAL -  Amazon service region
            },
          },
        })};
        window.pinpoint = ${JSON.stringify({
          Auth: {
            identityPoolId: 'eu-west-1:07a0c94b-d3b7-47d4-b857-3cdd288c7973',
            region: 'eu-west-1',
          },
          Analytics: {
            autoSessionRecord: false,
            AWSPinpoint: {
              appId: '81a5891dfce54202ad80c5a3308dd61c',
              region: 'eu-west-1',
            },
          },
        })};
        window.perspectiveMetadata = ${JSON.stringify({
          rootAccount: ACCOUNT_ID,
          rootRegion: REGION,
          version: VERSION
        })};
        window.collectAnonymousMetrics = ${JSON.stringify({
          optOut: ANONYMOUS_METRIC_OPT_OUT === 'Yes' ? true : false,
        })};`,
      })
        .then(console.dir)
        .catch(console.error),
  };
};
