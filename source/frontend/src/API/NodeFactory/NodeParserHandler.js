// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {parseCustomerManagedPolicyStatement} from './NodeParsers/CustomerManagedPolicyStatement/CustomerManagedPolicyStatementParser.js';
import {parseEC2Instance} from './NodeParsers/EC2Instance/EC2InstanceParser.js';
import {parseDatabaseInstance} from './NodeParsers/DatabaseInstance/DatabaseInstanceParser.js';
import {parseAPIGatewayMethod} from './NodeParsers/APIGateway/Method/APIGatewayMethodParser.js';
import {parseAPIGatewayResource} from './NodeParsers/APIGateway/Resource/APIGatewayResourceParser.js';
import {parseLoadBalancer} from './NodeParsers/LoadBalancers/LoadBalancerParser.js';
import {parseCloudFrontDistribution} from './NodeParsers/CloudFrontDistribution/CloudFrontDistributionParser.js';
import {getStateInformation} from '../../Utils/Resources/ResourceStateParser.js';
import {fetchImage} from '../../Utils/ImageSelector.js';
import {parseAPIGatewayEndpoint} from './NodeParsers/APIGateway/Endpoint/APIGatewayEndpointParser.js';
import {parseS3Bucket} from './NodeParsers/S3Bucket/S3BucketParser.js';
import {parseLambdaFunction} from './NodeParsers/LambdaFunction/LambdaFunctionParser';
import {parseEbsVolume} from './NodeParsers/EbsVolume/EbsVolumeParser';

const nodeParsers = new Map([
    [
        'AWS::IAM::CustomerManagedPolicyStatement',
        parseCustomerManagedPolicyStatement,
    ],
    ['AWS::EC2::Instance', parseEC2Instance],
    ['AWS::EC2::Volume', parseEbsVolume],
    ['AWS::RDS::DBInstance', parseDatabaseInstance],
    ['AWS::ApiGateway::Method', parseAPIGatewayMethod],
    ['AWS::ApiGateway::Resource', parseAPIGatewayResource],
    ['AWS::ApiGateway::RestApi', parseAPIGatewayEndpoint],
    ['AWS::ElasticLoadBalancingV2::LoadBalancer', parseLoadBalancer],
    ['AWS::S3::Bucket', parseS3Bucket],
    ['AWS::CloudFront::Distribution', parseCloudFrontDistribution],
    ['AWS::Lambda::Function', parseLambdaFunction],
]);

export const parseNode = (properties, node) => {
    const parser = nodeParsers.get(properties.resourceType);
    const state = getState(properties);

    if (parser) return parser(node);
    else
        return {
            styling: {
                borderStyle: state ? 'dotted' : 'solid',
                borderColour: state ? state.color : '#545B64',
                borderOpacity: 0.25,
                borderSize: 1,
                message: '',
                colour: '#fff',
            },
            state: state,
            icon: fetchImage(properties.resourceType, state),
        };
};

const getState = properties => {
    if (properties.state) return getStateInformation(properties.state);
    if (properties.dBInstanceStatus)
        return getStateInformation(properties.dBInstanceStatus);
    return undefined;
};
