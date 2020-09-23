/**
 * 
 * Generates the text that should be displayed on the graph next to each resource
 * 
 */

// sets the title to the resourceId - default
const buildGeneric = (data) => {
    data.properties.title = data.properties.resourceId;
}

// Sets the title to the resourceName
const buildResourceName = (data) => {
    data.properties.title = data.properties.resourceName;
}

const buildAutoscalingGroup = (data) => {
    const parsed = data.properties.arn.split(":");
    let almost = parsed[7].split("/");
    data.properties.title = almost[1];
}

const buildRDSCluster = (data) => {
    data.properties.title = data.properties.dbClusterIdentifier;
}

const buildEnvironmentVariableTitle = (data) => {
    data.properties.title = data.properties.key;
}

const buildTargetGroup = (data) => {
    const parsed = data.properties.arn.split(":");
    data.properties.title = parsed[5];
}

const buildCloudFormation = (data) => {
    data.properties.title = data.properties.resourceName;
}

const buildTag = (data) => {
    data.properties.title = data.properties.resourceId + " : " + data.properties.resourceValue;
}

const generateHeader = (data) => {

    switch (data.properties.resourceType) {
        case "AWS::CloudFormation::Stack":
            buildCloudFormation(data);
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

exports.generateHeader = generateHeader;