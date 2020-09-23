const aws4 = require('aws4');

/**
 * Calculates the AWS Signature 4 for IAM authentication on Neptune
 * @return {Promise}
 */
const getUrlAndHeaders = (
  host,
  port,
  options,
  canonicalUri = '/gremlin',
  protocol = 'wss'
) => {

  if (!host || !port) {
    throw new Error('Host and port are required');
  }
  const accessKeyId = options.accessKey || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = options.secretKey || process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = options.sessionToken || process.env.AWS_SESSION_TOKEN;
  const region = options.region || process.env.AWS_REGION;

  if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error(
      'AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY and AWS_REGION are required'
    )
  }

  const awsCreds = {
    accessKeyId, secretAccessKey, sessionToken,
  };

  const sigOptions = {
    host: `${host}:${port}`,
    region,
    path: canonicalUri,
    service: 'neptune-db',
  };

  return  {
    url: `${protocol}://${host}:${port}${canonicalUri}`,
    headers: aws4.sign(sigOptions, awsCreds).headers
  }
};

module.exports = {
  getUrlAndHeaders
};
