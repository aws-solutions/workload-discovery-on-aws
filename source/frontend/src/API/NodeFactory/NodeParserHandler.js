import { parseCustomerManagedPolicyStatement } from './NodeParsers/CustomerManagedPolicyStatement/CustomerManagedPolicyStatementParser';
import { parseEC2Instance } from './NodeParsers/EC2Instance/EC2InstanceParser';
import { parseDatabaseInstance } from './NodeParsers/DatabaseInstance/DatabaseInstanceParser';
import { parseAPIGatewayMethod } from './NodeParsers/APIGateway/Method/APIGatewayMethodParser';
import { parseAPIGatewayResource } from './NodeParsers/APIGateway/Resource/APIGatewayResourceParser';
import { parseLoadBalancer} from './NodeParsers/LoadBalancers/LoadBalancerParser';
import { parseCloudFrontDistribution} from './NodeParsers/CloudFrontDistribution/CloudFrontDistributionParser'
import { getStateInformation } from '../../Utils/Resources/ResourceStateParser';
import { fetchImage } from '../../Utils/ImageSelector';
import { parseAPIGatewayEndpoint } from './NodeParsers/APIGateway/Endpoint/APIGatewayEndpointParser';
import { parseS3Bucket } from './NodeParsers/S3Bucket/S3BucketParser';

const nodeParsers = new Map();

const buildNodeParserFactory = () => {
  nodeParsers.set('AWS::IAM::CustomerManagedPolicyStatement',parseCustomerManagedPolicyStatement);
  nodeParsers.set('AWS::EC2::Instance', parseEC2Instance)
  nodeParsers.set('AWS::RDS::DBInstance', parseDatabaseInstance)
  nodeParsers.set('AWS::ApiGateway::Method', parseAPIGatewayMethod)
  nodeParsers.set('AWS::ApiGateway::Resource', parseAPIGatewayResource)
  nodeParsers.set('AWS::ApiGateway::RestApi', parseAPIGatewayEndpoint)
  nodeParsers.set('AWS::ElasticLoadBalancingV2::LoadBalancer', parseLoadBalancer)
  nodeParsers.set('AWS::ElasticLoadBalancing::LoadBalancer', parseLoadBalancer)
  nodeParsers.set('AWS::S3::Bucket', parseS3Bucket)
  nodeParsers.set("AWS::CloudFront::Distribution", parseCloudFrontDistribution)
};

buildNodeParserFactory();

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
        colour: '#fff'
      },
      state: state,
      icon: fetchImage(properties.resourceType, state)
    };
};

const getState = properties => {
  if (properties.state) return getStateInformation(properties.state);
  if (properties.dBInstanceStatus)
    return getStateInformation(properties.dBInstanceStatus);
  return undefined;
};
