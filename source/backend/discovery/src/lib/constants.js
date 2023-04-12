// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

module.exports = {
    IS_ASSOCIATED_WITH: 'Is associated with ',
    CONTAINS: 'Contains ',
    IS_CONTAINED_IN: 'Is contained in ',
    IS_ATTACHED_TO: 'Is attached to ',
    ACCESS_DENIED: 'AccessDenied',
    AWS: 'aws',
    AWS_API_GATEWAY_AUTHORIZER: 'AWS::ApiGateway::Authorizer',
    AWS_API_GATEWAY_METHOD: 'AWS::ApiGateway::Method',
    AWS_API_GATEWAY_REST_API: 'AWS::ApiGateway::RestApi',
    AWS_API_GATEWAY_RESOURCE: 'AWS::ApiGateway::Resource',
    AWS_CLOUDFRONT_DISTRIBUTION: 'AWS::CloudFront::Distribution',
    AWS_CLOUDFRONT_STREAMING_DISTRIBUTION: 'AWS::CloudFront::StreamingDistribution',
    AWS_COGNITO_USER_POOL: 'AWS::Cognito::UserPool',
    AWS_CONFIG_RESOURCE_COMPLIANCE: 'AWS::Config::ResourceCompliance',
    AWS_DYNAMODB_STREAM: 'AWS::DynamoDB::Stream',
    AWS_DYNAMODB_TABLE: 'AWS::DynamoDB::Table',
    AWS_EC2_INSTANCE: 'AWS::EC2::Instance',
    AWS_EC2_INTERNET_GATEWAY: 'AWS::EC2::InternetGateway',
    AWS_EC2_LAUNCH_TEMPLATE: 'AWS::EC2::LaunchTemplate',
    AWS_EC2_NAT_GATEWAY: 'AWS::EC2::NatGateway',
    AWS_EC2_NETWORK_ACL: 'AWS::EC2::NetworkAcl',
    AWS_EC2_NETWORK_INTERFACE: 'AWS::EC2::NetworkInterface',
    AWS_EC2_ROUTE_TABLE: 'AWS::EC2::RouteTable',
    AWS_EC2_SPOT: 'AWS::EC2::Spot',
    AWS_EC2_SPOT_FLEET: 'AWS::EC2::SpotFleet',
    AWS_EC2_SUBNET: 'AWS::EC2::Subnet',
    AWS_EC2_SECURITY_GROUP: 'AWS::EC2::SecurityGroup',
    AWS_EC2_TRANSIT_GATEWAY: 'AWS::EC2::TransitGateway',
    AWS_EC2_TRANSIT_GATEWAY_ATTACHMENT: 'AWS::EC2::TransitGatewayAttachment',
    AWS_EC2_TRANSIT_GATEWAY_ROUTE_TABLE: 'AWS::EC2::TransitGatewayRouteTable',
    AWS_EC2_VOLUME: 'AWS::EC2::Volume',
    AWS_EC2_VPC: 'AWS::EC2::VPC',
    AWS_EC2_VPC_ENDPOINT: 'AWS::EC2::VPCEndpoint',
    AWS_ECR_REPOSITORY: 'AWS::ECR::Repository',
    AWS_ECS_CLUSTER: 'AWS::ECS::Cluster',
    AWS_ECS_SERVICE: 'AWS::ECS::Service',
    AWS_ECS_TASK: 'AWS::ECS::Task',
    AWS_ECS_TASK_DEFINITION: 'AWS::ECS::TaskDefinition',
    AWS_ELASTICSEARCH_DOMAIN: 'AWS::Elasticsearch::Domain',
    AWS_KMS_KEY: 'AWS::KMS::Key',
    AWS_OPENSEARCH_DOMAIN: 'AWS::OpenSearch::Domain',
    AWS_ELASTIC_LOAD_BALANCING_LOADBALANCER: 'AWS::ElasticLoadBalancing::LoadBalancer',
    AWS_ELASTIC_LOAD_BALANCING_V2_LOADBALANCER: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
    AWS_ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP: 'AWS::ElasticLoadBalancingV2::TargetGroup',
    AWS_ELASTIC_LOAD_BALANCING_V2_LISTENER: 'AWS::ElasticLoadBalancingV2::Listener',
    AWS_LAMBDA_FUNCTION: 'AWS::Lambda::Function',
    AWS_RDS_DB_SUBNET_GROUP: 'AWS::RDS::DBSubnetGroup',
    AWS_RDS_DB_CLUSTER: 'AWS::RDS::DBCluster',
    AWS_RDS_DB_INSTANCE: 'AWS::RDS::DBInstance',
    AWS_IAM_GROUP: 'AWS::IAM::Group',
    AWS_IAM_ROLE: 'AWS::IAM::Role',
    AWS_IAM_USER: 'AWS::IAM::User',
    AWS_IAM_AWS_MANAGED_POLICY: 'AWS::IAM::AWSManagedPolicy',
    AWS_IAM_INLINE_POLICY: 'AWS::IAM::InlinePolicy',
    AWS_IAM_POLICY: 'AWS::IAM::Policy',
    AWS_CODEBUILD_PROJECT: 'AWS::CodeBuild::Project',
    AWS_CODE_PIPELINE_PIPELINE: 'AWS::CodePipeline::Pipeline',
    AWS_EC2_EIP: 'AWS::EC2::EIP',
    AWS_EFS_FILE_SYSTEM: 'AWS::EFS::FileSystem',
    AWS_EFS_ACCESS_POINT: 'AWS::EFS::AccessPoint',
    AWS_ELASTIC_BEANSTALK_APPLICATION_VERSION: 'AWS::ElasticBeanstalk::ApplicationVersion',
    AWS_EKS_CLUSTER: 'AWS::EKS::Cluster',
    AWS_EKS_NODE_GROUP: 'AWS::EKS::Nodegroup',
    AWS_AUTOSCALING_AUTOSCALING_GROUP: 'AWS::AutoScaling::AutoScalingGroup',
    AWS_AUTOSCALING_SCALING_POLICY: 'AWS::AutoScaling::ScalingPolicy',
    AWS_AUTOSCALING_LAUNCH_CONFIGURATION: 'AWS::AutoScaling::LaunchConfiguration',
    AWS_KINESIS_STREAM: 'AWS::Kinesis::Stream',
    AWS_MSK_CLUSTER: 'AWS::MSK::Cluster',
    AWS_REDSHIFT_CLUSTER: 'AWS::Redshift::Cluster',
    AWS_S3_BUCKET: 'AWS::S3::Bucket',
    AWS_S3_ACCOUNT_PUBLIC_ACCESS_BLOCK: 'AWS::S3::AccountPublicAccessBlock',
    AWS_SNS_TOPIC: 'AWS::SNS::Topic',
    AWS_SQS_QUEUE: 'AWS::SQS::Queue',
    AWS_TAGS_TAG: 'AWS::Tags::Tag',
    AWS_ORGANIZATIONS: 'AWS_ORGANIZATIONS',
    DISCOVERY_ROLE_NAME: 'WorkloadDiscoveryRole',
    ECS: 'ecs',
    ELASTIC_LOAD_BALANCING: 'elasticloadbalancing',
    LOAD_BALANCER: 'loadbalancer',
    ENI_NAT_GATEWAY_INTERFACE_TYPE: 'nat_gateway',
    ENI_ALB_DESCRIPTION_PREFIX: 'ELB app',
    ENI_ELB_DESCRIPTION_PREFIX: 'ELB ',
    ENI_VPC_ENDPOINT_INTERFACE_TYPE: 'vpc_endpoint',
    ENI_SEARCH_DESCRIPTION_PREFIX: 'ES ', // this value is the same for both Opensearch and ES ENIs
    ENI_SEARCH_REQUESTER_ID: 'amazon-elasticsearch', // this value is the same for both Opensearch and ES ENIs
    IAM: 'iam',
    ROLE: 'role',
    LAMBDA: 'lambda',
    GLOBAL: 'global',
    REGION: 'region',
    REGIONAL: 'regional',
    NETWORK_INTERFACE_ID: 'networkInterfaceId',
    NOT_APPLICABLE: 'Not Applicable',
    MULTIPLE_AVAILABILITY_ZONES: 'Multiple Availability Zones',
    SPOT_FLEET_REQUEST_ID_TAG: 'aws:ec2spot:fleet-request-id',
    SUBNET_ID: 'subnetId',
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    SUBNET: 'Subnet',
    OPENSEARCH: 'OpenSearch',
    SECURITY_GROUP: 'SecurityGroup',
    RESOURCE_DISCOVERED:  'ResourceDiscovered',
    EC2: 'ec2',
    SPOT_FLEET_REQUEST: 'spot-fleet-request',
    SPOT_INSTANCE_REQUEST: 'spot-instance-request',
    INLINE_POLICY: 'inlinePolicy',
    TAG: 'tag',
    TAGS: 'tags',
    VPC: 'Vpc',
    APIGATEWAY: 'apigateway',
    RESTAPIS: 'restapis',
    RESOURCES: 'resources',
    METHODS: 'methods',
    AUTHORIZERS: 'authorizers',
    NAME: 'Name',
    NOT_FOUND_EXCEPTION: 'NotFoundException',
    CN_NORTH_1: 'cn-north-1',
    CN_NORTHWEST_1: 'cn-northwest-1',
    US_GOV_EAST_1: 'us-gov-east-1',
    US_GOV_WEST_1: 'us-gov-west-1',
    AWS_CN: 'aws-cn',
    AWS_US_GOV: 'aws-us-gov',
    CONNECTION_CLOSED_PREMATURELY: 'Connection closed prematurely',
    PERSPECTIVE: 'perspective',
    TASK_DEFINITION: 'task-definition',
    TRANSIT_GATEWAY_ATTACHMENT: 'transit-gateway-attachment',
    UNKNOWN: 'unknown',
    DISCOVERY_PROCESS_RUNNING: 'Discovery process ECS task is already running in cluster.',
    CONSOLE: 'console',
    SIGN_IN: 'signin',
    AWS_AMAZON_COM: 'aws.amazon.com',
    S3: 's3',
    HOME: 'home',
    FULFILLED: 'fulfilled',
    FUNCTION_RESPONSE_SIZE_TOO_LARGE: 'Function.ResponseSizeTooLarge',
    WORKLOAD_DISCOVERY_TASKGROUP: 'workload-discovery-taskgroup'
}