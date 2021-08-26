const R = require('ramda');
const uuidv4 = require('uuid/v4');

module.exports = (cloudfront, {getResourceTypes}) => {

    return {
        invalidateCache: () => {
            return getResourceTypes(['AWS::CloudFront::Distribution'])
                .then(R.head)
                .then(({PhysicalResourceId}) => cloudfront.createInvalidation({
                    DistributionId: PhysicalResourceId,
                    InvalidationBatch: {
                        CallerReference: uuidv4(),
                        Paths: {
                            Quantity: 1,
                            Items: [
                                '/*'
                            ]
                        }
                    }
                }).promise())
        }
    };

};
