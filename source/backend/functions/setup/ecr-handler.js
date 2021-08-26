const { ECR_REPO_NAME } = require('./config');
const R = require('ramda');

module.exports = (ecr) => {

  return {
    getLatestImage: () =>
    ecr
      .listImages({
        repositoryName: ECR_REPO_NAME,
        filter: { tagStatus: 'TAGGED' }
      })
      .promise()
      .then(({imageIds}) => {
        const {imageTag} = R.last(R.sortBy(R.prop('imageTag'), imageIds))
        console.log(`the latest image is ${imageTag}`);
        return imageTag
      })
  };
};
