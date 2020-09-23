const util = require('util');
const AWS = require('aws-sdk');
const sts = new AWS.STS();

const login = async (role) => {
    const {Credentials: creds } = await sts.assumeRole({
        RoleArn: `${role}`,
        //RoleArn: `arn:aws:iam::${zoomAccount.accountId}:role/${role}`,
        RoleSessionName: 'discovery'
      }
  ).promise();

  const awsCreds = new AWS.Credentials(creds.AccessKeyId, creds.SecretAccessKey, creds.SessionToken);

  return awsCreds;
}

exports.login = login;