/** 
 * 
 * Example account login:
 * https://XXXXXXXXXXX1.signin.aws.amazon.com/console/ec2?region=eu-west-1#Instances:sort=instanceId
 * https://XXXXXXXXXXX1.signin.aws.amazon.com/console/ec2?region=eu-west-1#LoadBalancers:sort=loadBalancerName
 * https://XXXXXXXXXXX1.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/twobytwo-lambda-SentimentAnalysis-XN8MLZP7IX36?tab=graph
 * 
 * Example once logged in:
 * https://eu-west-1.console.aws.amazon.com/iam/home?region=eu-west-1#/users
 * https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Instances:sort=instanceId - ec2
 * https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#LoadBalancers:sort=loadBalancerName - load Balancer
 * https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#SecurityGroups:sort=groupId - security Group
 * https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/twobytwo-lambda-ClearDown-4EF6H592XV4?tab=graph - lambda function
 * https://eu-west-1.console.aws.amazon.com/vpc/home?region=eu-west-1#vpcs:sort=VpcId - VPC
 * https://eu-west-1.console.aws.amazon.com/vpc/home?region=eu-west-1#Addresses:sort=PublicIp - elastic ip
 * https://eu-west-1.console.aws.amazon.com/vpc/home?region=eu-west-1#RouteTables:sort=routeTableId - route table
 * https://eu-west-1.console.aws.amazon.com/vpc/home?region=eu-west-1#subnets:sort=SubnetId - subnet
 * https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Volumes:sort=desc:createTime - volumes
 * https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#alarm:alarmFilter=ANY
 * 
 * 
 * Example ARN:
 * arn:aws:ec2:eu-west-1:XXXXXXXXXXX1:instance/i-0de5d3dffcb58d553
 * arn:aws:ec2:eu-west-1:XXXXXXXXXXX1:subnet/subnet-07735f25386872c88
 * arn:aws:ec2:eu-west-1:XXXXXXXXXXX1:volume/vol-000b6f4ad820cd78a
 * arn:aws:lambda:eu-west-1:XXXXXXXXXXX1:function:twobytwo-lambda-ClearDown-4EF6H592XV4
 * arn:aws:dynamodb:eu-west-1:XXXXXXXXXXX1:table/autosave
 * arn:aws:autoscaling:eu-west-1:XXXXXXXXXXX1:autoScalingGroup:ef194843-edb2-4178-9e0f-72cb6372f6f8:autoScalingGroupName/zoom-ec2-autoscaling-group
 * 
*/

/*
    "Amazon-RDS" : "AWS::RDS::DBInstance",
    "DBSubnetGroup" : "AWS::RDS::DBSubnetGroup",
    "Amazon-DynamoDB" : "AWS::DynamoDB::Table",
    "AWS-CloudFormation" : "AWS::CloudFormation::Stack",
    "Amazon-CloudWatch_Alarm_light-bg":"AWS::CloudWatch::Alarm",
*/

const zoomUtils = require('./zoomUtils');
const util = require('util');

const urlEndings = {
    "AWS::S3::Bucket": { url: "", type: "s3", callType: "s3" },
    "AWS::VPC::EC2": { url: "vpcs:sort=VpcId", type: "vpc", callType: "default" },
    "AWS::EC2::VPC": { url: "vpcs:sort=VpcId", type: "vpc", callType: "default" },
    "AWS::EC2::NetworkInterface": { url: "NIC:sort=description", type: "ec2", callType: "default" },
    "AWS::EC2::Instance": { url: "Instances:sort=instanceId", type: "ec2", callType: "default" },
    "AWS::EC2::Volume": { url: "Volumes:sort=desc:name", type: "ec2", callType: "default" },
    "AWS::EC2::Subnet": { url: "subnets:sort=SubnetId", type: "vpc", callType: "default" },
    "AWS::EC2::SecurityGroup": { url: "SecurityGroups:sort=groupId", type: "ec2", callType: "default" },
    "AWS::EC2::RouteTable": { url: "RouteTables:sort=routeTableId", type: "vpc", callType: "default" },
    "AWS::EC2::InternetGateway": { url: "igws:sort=internetGatewayId", type: "vpc", callType: "default" },
    "AWS::EC2::NetworkAcl": { url: "acls:sort=networkAclId", type: "vpc", callType: "default" },
    "AWS::IAM::User": { url: "/users", type: "iam", callType: "iam" },
    "AWS::IAM::Role": { url: "/roles", type: "iam", callType: "iam" },
    "AWS::IAM::Policy": { url: "/policies", type: "iam", callType: "iam" },
    "AWS::IAM::Group": { url: "/groups", type: "iam", callType: "iam" },
    "AWS::ElasticLoadBalancingV2::LoadBalancer": { url: "LoadBalancers:", type: "ec2", callType: "default" },
    "AWS::ElasticLoadBalancingV2::TargetGroup": { url: "TargetGroups:", type: "ec2", callType: "default" },
    "AWS::ElasticLoadBalancingV2::Target": { url: "TargetGroups:", type: "ec2", callType: "default" },
    "AWS::ElasticLoadBalancingV2::Listener": { url: "LoadBalancers:", type: "ec2", callType: "default" },
    "AWS::EC2::EIP": { url: "Addresses:sort=PublicIp", type: "ec2", callType: "default" },
    "AWS::ApiGateway::RestApi": { url: "", callType: "apigateway" },
    "AWS::ApiGateway::Resource": { url: "", callType: "apigateway" },
    "AWS::ApiGateway::Method": { url: "", callType: "apigatewayMethod" },
    "AWS::Lambda::Function": { callType: "lambda" },
    "AWS::AutoScaling::AutoScalingGroup": {callType: "autoscaling"}
};

const dispatchFunc = (node) => {
    return node && node.callType;
};

const noMatch = (node) => {
    return { undefined, undefined };
};

let buildConsoleURL = zoomUtils.createMultiMethod(dispatchFunc, noMatch);

buildConsoleURL.s3 = (urlBuilder) => {
    let loginURL = buildLoginURLS3(urlBuilder.node.properties.accountId, urlBuilder.node.properties.awsRegion, urlBuilder.node.properties.resourceName);
    let loggedInURL = buildLoggedInURLS3(urlBuilder.node.properties.accountId, urlBuilder.node.properties.awsRegion, urlBuilder.node.properties.resourceName);
    return { loginURL, loggedInURL };
};

buildConsoleURL.default = (urlBuilder) => {
    let loginURL = buildLoginURL(urlBuilder.node.properties.accountId, urlBuilder.node.properties.awsRegion, urlBuilder.urlType, urlBuilder.urlEnding);
    let loggedInURL = buildLoggedInURL(urlBuilder.node.properties.awsRegion, urlBuilder.urlType, urlBuilder.urlEnding);
    return { loginURL, loggedInURL };
};

buildConsoleURL.iam = (urlBuilder) => {
    let loginURL = buildLoginURLIAM(urlBuilder.node.properties.accountId, urlBuilder.node.properties.awsRegion, urlBuilder.urlType, urlBuilder.urlEnding);
    let loggedInURL = buildLoggedInURLIAM(urlBuilder.urlEnding);
    return { loginURL, loggedInURL };
};

buildConsoleURL.lambda = (urlBuilder) => {
    let loginURL = buildLogInURLLambda(urlBuilder.node.properties.accountId, urlBuilder.node.properties.awsRegion, urlBuilder.node.properties.resourceName);
    let loggedInURL = buildLoggedInURLLambda(urlBuilder.node.properties.awsRegion, urlBuilder.node.properties.resourceName);
    return { loginURL, loggedInURL };
};

buildConsoleURL.apigateway = (urlBuilder) => {
    let resource = (urlBuilder.node.properties.restApiId !== urlBuilder.node.properties.resourceId) ? urlBuilder.node.properties.resourceId : undefined;
    let loginURL = buildLogInURLAPIGateway(urlBuilder.node.properties.accountId, urlBuilder.node.properties.awsRegion, urlBuilder.node.properties.restApiId, resource);// method = "");
    let loggedInURL = buildLoggedInURLAPIGateway(urlBuilder.node.properties.awsRegion, urlBuilder.node.properties.restApiId, resource);
    return { loginURL, loggedInURL };
};

buildConsoleURL.apigatewayMethod = (urlBuilder) => {
    let split = urlBuilder.node.properties.resourceId.split("_");
    let restApiId = split[0];
    let resourceId = split[1];
    let method = split[2];

    let loginURL = buildLogInURLAPIGateway(urlBuilder.node.properties.accountId, urlBuilder.node.properties.awsRegion, restApiId, resourceId, method);
    let loggedInURL = buildLoggedInURLAPIGateway(urlBuilder.node.properties.awsRegion, restApiId, resourceId, method);
    return { loginURL, loggedInURL };
};

/**
 * TODO: find url to support login
 */
buildConsoleURL.autoscaling = (urlBuilder) => {
    let loginURL = buildLoginAutoscale(urlBuilder.node.properties.accountId, urlBuilder.node.properties.awsRegion, urlBuilder.node.properties.resourceName);
    let loggedInURL = buildLoggedInURLAutoscale(urlBuilder.node.properties.awsRegion, urlBuilder.node.properties.resourceName);
    return { undefined, loggedInURL };
}

const buildLoggedInURLAPIGateway = (region, restApiId, resource, method) => {
    let url = `https://${region}.console.aws.amazon.com/apigateway/home?region=${region}#/apis/${restApiId}/resources`;
    url = appendItem(url, resource);
    url = appendItem(url, method, "methods");
    return url;
};

const buildLogInURLAPIGateway = (accountId, region, restApiId, resource, method) => {
    let url = `https://${accountId}.signin.aws.amazon.com/console/apigateway?region=${region}#/apis/${restApiId}/resources`;
    url = appendItem(url, resource);
    url = appendItem(url, method, "methods");
    return url;
};

const appendItem = (url, item, option) => {
    return item ?
        option ?
            url + "/" + option + "/" + item
            : url + "/" + item
        : url;
};

const buildLoggedInURLAutoscale = (region, id) => {
    return `https://${region}.console.aws.amazon.com/ec2/autoscaling/home?region=${region}#AutoScalingGroups:id=${id};view=details`;
};

const buildLoginAutoscale = (accountId, region, id) => {
    return `https://${accountId}.signin.aws.amazon.com/console/ec2/autoscaling/home?region=${region}#AutoScalingGroups:id=${id};view=details`;
};

const buildLoggedInURLLambda = (region, f) => {
    return `https://${region}.console.aws.amazon.com/lambda/home?region=${region}#/functions/${f}?tab=graph`;
};

const buildLogInURLLambda = (accountId, region, f) => {
    return `https://${accountId}.signin.aws.amazon.com/console/lambda?region=${region}#/functions/${f}?tab=graph`;
};

const buildLoggedInURLCloudWatch = (region) => {
    return `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#alarm:alarmFilter=ANY`;
};

const buildLogInURLCloudWatch = (accountId, region) => {
    return `https://${accountId}.signin.aws.amazon.com/cloudwatch/home?region=${region}#alarm:alarmFilter=ANY`;
};

const buildLoggedInURLS3 = (accountId, region, bucketName) => {
    return `https://s3.console.aws.amazon.com/s3/buckets/${bucketName}/?region=${region}`;
};

const buildLoginURLS3 = (accountId, region, bucketName) => {
    return `https://${accountId}.signin.aws.amazon.com/console/s3?bucket=${bucketName}`;
};

const buildLoginURL = (accountId, region, type, component) => {
    return `https://${accountId}.signin.aws.amazon.com/console/${type}?region=${region}#${component}`;
};

const buildLoggedInURL = (region, type, component) => {
    return `https://${region}.console.aws.amazon.com/${type}/v2/home?region=${region}#${component}`;
};

const buildLoginURLIAM = (accountId, region, type, component) => {
    return `https://${accountId}.signin.aws.amazon.com/console/iam?home?#${component}`;
};

const buildLoggedInURLIAM = (component) => {
    return `https://console.aws.amazon.com/iam/home?#${component}`;
};

const getConsoleURLs = (node) => {
    let calcProperties = urlEndings[node.properties.resourceType];

    let calculation = calcProperties !== undefined ?
        { node: node, urlType: calcProperties.type, urlEnding: calcProperties.url, callType: calcProperties.callType }
        : { node: node, urlType: "undefined", urlEnding: "" };

    return buildConsoleURL(calculation);
};

exports.getConsoleURLs = getConsoleURLs;