const { ECR_REPO_NAME } = process.env;
const _ = require('lodash');
const AWS = require('aws-sdk');

module.exports = (ecr) => {

  return {
    getLatestImage: () =>
    ecr
    .listImages({
      repositoryName: ECR_REPO_NAME,
      filter: { tagStatus: 'TAGGED' }
    })
    .promise()
    .then(data => {
      let img = _(data.imageIds)
        .sortBy('imageTag')
        .last();
      console.log(`the latest image is ${img.imageTag}`);
      return img.imageTag
    })
  };
};
