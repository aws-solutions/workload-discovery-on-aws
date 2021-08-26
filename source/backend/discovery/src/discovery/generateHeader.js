const R = require('ramda');

/**
 *
 * Generates the text that should be displayed on the graph next to each resource
 *
 */

const buildGeneric = ({properties}) => {
    properties.title = R.defaultTo(properties.resourceId, properties.resourceName);
}

const buildResourceName = (data) => {
    data.properties.title = data.properties.resourceName;
}

const buildAutoscalingGroup = ({properties}) => {
    const parsed = R.last(properties.arn.split(":"));
    properties.title = R.last(parsed.split("/"));
}

const buildRDSCluster = (data) => {
    data.properties.title = data.properties.dbClusterIdentifier;
}

const buildEnvironmentVariableTitle = (data) => {
    data.properties.title = data.properties.key;
}

const buildTargetGroup = ({properties}) => {
    properties.title = R.last(properties.arn.split(":"));
}

const buildTag = (data) => {
    data.properties.title = data.properties.resourceId + " : " + data.properties.resourceValue;
}

const generateHeader = (data) => {

    switch (data.properties.resourceType) {
        case "AWS::CloudFormation::Stack":
            buildResourceName(data);
            break;
        case "AWS::VPC::EC2":
            buildGeneric(data);
            break;
        case "AWS::EC2::NetworkInterface":
            buildGeneric(data);
            break;
        case "AWS::EC2::Instance":
            buildGeneric(data);
            break;
        case "AWS::EC2::Volume":
            buildGeneric(data);
            break;
        case "AWS::EC2::Subnet":
            buildGeneric(data);
            break;
        case "AWS::EC2::SecurityGroup":
            buildGeneric(data);
            break;
        case "AWS::EC2::RouteTable":
            buildGeneric(data);
            break;
        case "AWS::EC2::InternetGateway":
            buildGeneric(data);
            break;
        case "AWS::EC2::NetworkAcl":
            buildGeneric(data);
            break;
        case "AWS::IAM::User":
            buildResourceName(data);
            break;
        case "AWS::IAM::Role":
            buildResourceName(data);
            break;
        case "AWS::IAM::Policy":
            buildResourceName(data);
            break;
        case "AWS::IAM::Group":
            buildResourceName(data);
            break
        case "AWS::S3::Bucket":
            buildGeneric(data);
            break;
        case "AWS::ElasticLoadBalancingV2::LoadBalancer":
            buildResourceName(data);
            break;
        case "AWS::ElasticLoadBalancingV2::TargetGroup":
            buildTargetGroup(data);
            break;
        case "AWS::ElasticLoadBalancingV2::Target":
            buildTargetGroup(data);
            break;
        case "AWS::ElasticLoadBalancingV2::Listener":
            buildTargetGroup(data);
            break;
        case "AWS::EC2::EIP":
            buildGeneric(data);
            break;
        case "AWS::ApiGateway::RestApi":
            buildGeneric(data);
            break;
        case "AWS::ApiGateway::Resource":
            buildGeneric(data);
            break;
        case "AWS::ApiGateway::Method":
            buildGeneric(data);
            break;
        case "AWS::Lambda::Function":
            buildGeneric(data);
            break;
        case "AWS::CloudWatch::Alarm":
            buildGeneric(data);
            break;
        case "AWS::TAGS::TAG":
            buildTag(data);
            break;
        case "AWS::AutoScaling::AutoScalingGroup":
            buildAutoscalingGroup(data);
            break;
        case "AWS::RDS::DBCluster":
            buildRDSCluster(data);
            break;
        case "AWS::Lambda::Environment::Variable":
            buildEnvironmentVariableTitle(data);
            break;
        default:
            buildGeneric(data);
    }

}

module.exports = {
    generateHeader
};