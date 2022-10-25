const R = require('ramda');

const stringInterpolationRegex = /(?<=\$\{)(.*?)(?=\})/g;

function isObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function getRel(schema, rel) {
    const [k, ...path] = rel.split('.');
    return R.path(path, schema[k]);
}

const schema = {
    "$constants": {
        "accountId": "xxxxxxxxxxxx",
        "region": "eu-west-2"
    },
    "subnet": {
        "id": "${subnet.resourceId}_AWS::EC2::Subnet_${$constants.accountId}",
        "accountId": {"$rel":  "$constants.accountId"},
        "vpcId": "vpc-0123456789abcdef0",
        "resourceType": "AWS::EC2::Subnet",
        "resourceId": "subnet-0123456789abcdef",
        "relationships": []
    },
    "eni": {
        "id": "eni-0123456789abcdef0_AWS::EC2::NetworkInterface_xxxxxxxxxxxx",
        "accountId": {"$rel":  "$constants.accountId"},
        "description": "my eni",
        "relationships": [],
        "resourceType": "AWS::EC2::NetworkInterface",
        "resourceId": "eni-0123456789abcdef0"
    },
    "ecsTask": {
        "accountId": {"$rel":  "$constants.accountId"},
        "resourceId": "arn:aws:ecs:eu-west-2:xxxxxxxxxxxx:task/my-test-cluster/6bc30424ff0443a582ec97c21ddfac79",
        "resourceType": "AWS::ECS::Task",
        "relationships": [],
        "overrides": {}
    }
}

function generate(schema) {
    function interpolate(input) {
        if(isObject(input)) {
            return Object.entries(input).reduce((acc, [key, val]) => {
                acc[key] = interpolate(val);
                return acc;
            }, {});
        } else if(Array.isArray(input)) {
            return input.map(interpolate);
        } else {
            if(typeof input === 'string') {
                const matches = input.match(stringInterpolationRegex);
                if(matches != null) {
                    return matches.reduce((acc, match) => {
                        return acc.replace('${' + match + '}', getRel(schema, match));
                    }, input);
                }
            }
            return input;
        }
    }

    const interpolated = R.map(interpolate, R.map(interpolate, schema));

    function generateRec(input) {
        if(isObject(input)) {
            if(input.$rel != null) {
                return getRel(interpolated, input.$rel);
            } else {
                return Object.entries(input).reduce((acc, [key, val]) => {
                    acc[key] = generateRec(val);
                    return acc;
                }, {});
            }
        } else if(Array.isArray(input)) {
            return input.map(generateRec);
        } else {
            return input;
        }
    }

    return R.map(generateRec, interpolated);
}

const ACCOUNT_IDX = 'xxxxxxxxxxxx';
const EU_WEST_1 = 'eu-west-1';

function generateBaseResource(resourceType, num) {
    return {
        id: 'arn' + num,
        resourceId: 'resourceId' + num,
        resourceName: 'resourceName' + num, resourceType,
        accountId: ACCOUNT_IDX,
        arn: 'arn' + num,
        awsRegion: EU_WEST_1,
        relationships: [],
        tags: [],
        configuration: {a: +num}
    };
}

module.exports = {
    generate,
    generateBaseResource
}
