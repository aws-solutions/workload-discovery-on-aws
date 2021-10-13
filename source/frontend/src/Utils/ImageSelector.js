const serviceIconMap = {
  'AWS-Cloud-alt_light-bg': 'account',
  'Region_light-bg': 'region',
  'AWS-Cloud_light-bg': 'cloud',
  'VPC-error': 'AWS::EC2::VPC-status-negative',
  'VPC-warning': 'AWS::EC2::VPC-status-warning',
  'VPC-menu': 'AWS::EC2::VPC',
  'VPC-collapsed': 'vpc',
  VPC: 'AWS::EC2::VPC-status-available',
  'Amazon-EC2_Instance_light-bg': 'AWS::EC2::Instance',
  'Amazon-EC2_T2-Instance_light-bg-error': 't2-status-negative',
  'Amazon-EC2_T2-Instance_light-bg-warning': 't2-status-warning',
  'Amazon-EC2_T2-Instance_light-bg': 't2-status-available',
  'Amazon-EC2_A1-Instance_light-bg-error': 'a1-status-negative',
  'Amazon-EC2_A1-Instance_light-bg-warning': 'a1-status-warning',
  'Amazon-EC2_A1-Instance_light-bg': 'a1-status-available',
  'Amazon-EC2_C4-Instance_light-bg-error': 'c4-status-negative',
  'Amazon-EC2_C4-Instance_light-bg-warning': 'c4-status-warning',
  'Amazon-EC2_C4-Instance_light-bg': 'c4-status-available',
  'Amazon-EC2_C5-Instance_light-bg-error': 'c5-status-negative',
  'Amazon-EC2_C5-Instance_light-bg-warning': 'c5-status-warning',
  'Amazon-EC2_C5-Instance_light-bg': 'c5-status-available',
  'Amazon-EC2_C5n-Instance_light-bg-error': 'c5n-status-negative',
  'Amazon-EC2_C5n-Instance_light-bg-warning': 'c5n-status-warning',
  'Amazon-EC2_C5n-Instance_light-bg': 'c5n-status-available',
  'Amazon-EC2_D2-Instance_light-bg-error': 'd2-status-negative',
  'Amazon-EC2_D2-Instance_light-bg-warning': 'd2-status-warning',
  'Amazon-EC2_D2-Instance_light-bg': 'd2-status-available',
  'Amazon-EC2_F1-Instance_light-bg-error': 'f1-status-negative',
  'Amazon-EC2_F1-Instance_light-bg-warning': 'f1-status-warning',
  'Amazon-EC2_F1-Instance_light-bg': 'f1-status-available',
  'Amazon-EC2_G3-Instance_light-bg-error': 'g3-status-negative',
  'Amazon-EC2_G3-Instance_light-bg-warning': 'g3-status-warning',
  'Amazon-EC2_G3-Instance_light-bg': 'g3-status-available',
  'Amazon-EC2_H1-Instance_light-bg-error': 'h1-status-negative',
  'Amazon-EC2_H1-Instance_light-bg-warning': 'h1-status-warning',
  'Amazon-EC2_H1-Instance_light-bg': 'h1-status-available',
  'Amazon-EC2_I3-Instance_light-bg-error': 'i3-status-negative',
  'Amazon-EC2_I3-Instance_light-bg-warning': 'i3-status-warning',
  'Amazon-EC2_I3-Instance_light-bg': 'i3-status-available',
  'Amazon-EC2_M4-Instance_light-bg-error': 'm4-status-negative',
  'Amazon-EC2_M4-Instance_light-bg-warning': 'm4-status-warning',
  'Amazon-EC2_M4-Instance_light-bg': 'm4-status-available',
  'Amazon-EC2_M5-Instance_light-bg-error': 'm5-status-negative',
  'Amazon-EC2_M5-Instance_light-bg-warning': 'm5-status-warning',
  'Amazon-EC2_M5-Instance_light-bg': 'm5-status-available',
  'Amazon-EC2_M5a-Instance_light-bg-error': 'm5a-status-negative',
  'Amazon-EC2_M5a-Instance_light-bg-warning': 'm5a-status-warning',
  'Amazon-EC2_M5a-Instance_light-bg': 'm5a-status-available',
  'Amazon-EC2_P2-Instance_light-bg-error': 'p2-status-negative',
  'Amazon-EC2_P2-Instance_light-bg-warning': 'p2-status-warning',
  'Amazon-EC2_P2-Instance_light-bg': 'p2-status-available',
  'Amazon-EC2_P3-Instance_light-bg-error': 'p3-status-negative',
  'Amazon-EC2_P3-Instance_light-bg-warning': 'p3-status-warning',
  'Amazon-EC2_P3-Instance_light-bg': 'p3-status-available',
  'Amazon-EC2_R4-Instance_light-bg-error': 'r4-status-negative',
  'Amazon-EC2_R4-Instance_light-bg-warning': 'r4-status-warning',
  'Amazon-EC2_R4-Instance_light-bg': 'r4-status-available',
  'Amazon-EC2_R5-Instance_light-bg-error': 'r5-status-negative',
  'Amazon-EC2_R5-Instance_light-bg-warning': 'r5-status-warning',
  'Amazon-EC2_R5-Instance_light-bg': 'r5-status-available',
  'Amazon-EC2_T3-Instance_light-bg-error': 't3-status-negative',
  'Amazon-EC2_T3-Instance_light-bg-warning': 't3-status-warning',
  'Amazon-EC2_T3-Instance_light-bg': 't3-status-available',
  'Amazon-EC2_T3a-Instance_light-bg-error': 't3a-status-negative',
  'Amazon-EC2_T3a-Instance_light-bg-warning': 't3a-status-warning',
  'Amazon-EC2_T3a-Instance_light-bg': 't3a-status-available',
  'Amazon-EC2_X1-Instance_light-bg-error': 'x1-status-negative',
  'Amazon-EC2_X1-Instance_light-bg-warning': 'x1-status-warning',
  'Amazon-EC2_X1-Instance_light-bg': 'x1-status-available',
  'Amazon-EC2_X1e-Instance_light-bg-error': 'x1e-status-negative',
  'Amazon-EC2_X1e-Instance_light-bg-warning': 'x1e-status-warning',
  'Amazon-EC2_X1e-Instance_light-bg': 'x1e-status-available',
  'Amazon-EC2_z1d-Instance_light-bg-error': 'z1d-status-negative',
  'Amazon-EC2_z1d-Instance_light-bg-warning': 'z1d-status-warning',
  'Amazon-EC2_z1d-Instance_light-bg': 'z1d-status-available',
  'Amazon-VPC_Endpoints_light-bg-menu': 'AWS::VPC::Endpoint',
  'Amazon-VPC_Endpoints_light-bg': 'AWS::VPC::Endpoint-status-available',
  'Amazon-VPC_Endpoints_light-bg-warning': 'AWS::VPC::Endpoint-status-warning',
  'Amazon-VPC_Endpoints_light-bg-error': 'AWS::VPC::Endpoint-status-negative',
  'Amazon-EC2_VPC_Endpoints_light-bg': 'AWS::EC2::VPCEndpoint-status-available',
  'Amazon-EC2_VPC_Endpoints_light-bg-warning':
    'AWS::EC2::VPCEndpoint-status-warning',
  'Amazon-EC2_VPC_Endpoints_light-bg-error':
    'AWS::EC2::VPCEndpoint-status-negative',
  'Amazon-EC2_VPC_Endpoints_light-bg-menu': 'AWS::EC2::VPCEndpoint',
  'VPC-subnet-private_light-bg-collapsed': 'subnet',
  'VPC-subnet-private_light-bg-menu': 'AWS::EC2::Subnet',
  'VPC-subnet-private_light-bg-error': 'AWS::EC2::Subnet-status-negative',
  'VPC-subnet-private_light-bg-warning': 'AWS::EC2::Subnet-status-warning',
  'VPC-subnet-private_light-bg': 'AWS::EC2::Subnet-status-available',
  'VPC-subnet-public_light-bg-menu': 'AWS::EC2::Subnet-public',
  'VPC-subnet-public_light-bg-error': 'AWS::EC2::Subnet-public-status-negative',
  'VPC-subnet-public_light-bg-warning':
    'AWS::EC2::Subnet-public-status-warning',
  'VPC-subnet-public_light-bg': 'AWS::EC2::Subnet-public-status-available',
  'Amazon-VPC_Elastic-Network-Interface_light-bg': 'AWS::EC2::NetworkInterface',
  'AWS-Lambda-menu': 'AWS::Lambda::Function',
  'AWS-Lambda': 'AWS::Lambda::Function-status-available',
  'AWS-Lambda-warning': 'AWS::Lambda::Function-status-warning',
  'AWS-Lambda-error': 'AWS::Lambda::Function-status-negative',
  'Amazon-API-Gateway_Endpoint_light-bg': 'AWS::ApiGateway::RestApi',
  AWSSecurityGroup: 'AWS::EC2::SecurityGroup',
  'Amazon-VPC_Internet-Gateway_light-bg': 'AWS::EC2::InternetGateway',
  'Amazon-VPC_Router_light-bg': 'AWS::EC2::RouteTable',
  'Amazon-VPC_Network-Access-Control-List_light-bg': 'AWS::EC2::NetworkAcl',
  'Amazon-RDS_Amazon-RDS_instance_light-bg-menu': 'AWS::RDS::DBInstance',
  'Amazon-RDS_Amazon-RDS_instance_light-bg':
    'AWS::RDS::DBInstance-status-available',
  'Amazon-RDS_Amazon-RDS_instance_light-bg-warning':
    'AWS::RDS::DBInstance-status-warning',
  'Amazon-RDS_Amazon-RDS_instance_light-bg-error':
    'AWS::RDS::DBInstance-status-negative',
  'Amazon-DBCluster': 'AWS::RDS::DBCluster',
  'Amazon-Neptune_light-bg-menu': 'AWS::RDS::DBInstance-neptune',
  'Amazon-Neptune_light-bg': 'AWS::RDS::DBInstance-neptune-status-available',
  'Amazon-Neptune_light-bg-warning':
    'AWS::RDS::DBInstance-neptune-status-warning',
  'Amazon-Neptune_light-bg-error':
    'AWS::RDS::DBInstance-neptune-status-negative',
  'Amazon-RDS_MySQL_instance_light-bg-menu': 'AWS::RDS::DBInstance-mysql',
  'Amazon-RDS_MySQL_instance_light-bg':
    'AWS::RDS::DBInstance-mysql-status-available',
  'Amazon-RDS_MySQL_instance_light-bg-warning':
    'AWS::RDS::DBInstance-mysql-status-warning',
  'Amazon-RDS_MySQL_instance_light-bg-error':
    'AWS::RDS::DBInstance-mysql-status-negative',
  'Amazon-RDS_PostgreSQL_instance_light-bg-menu':
    'AWS::RDS::DBInstance-postgres',
  'Amazon-RDS_PostgreSQL_instance_light-bg':
    'AWS::RDS::DBInstance-postgres-status-available',
  'Amazon-RDS_PostgreSQL_instance_light-bg-warning':
    'AWS::RDS::DBInstance-postgres-status-warning',
  'Amazon-RDS_PostgreSQL_instance_light-bg-error':
    'AWS::RDS::DBInstance-postgres-status-negative',
  'Amazon-RDS_MariaDB_instance_light-bg-menu': 'AWS::RDS::DBInstance-mariadb',
  'Amazon-RDS_MariaDB_instance_light-bg':
    'AWS::RDS::DBInstance-mariadb-status-available',
  'Amazon-RDS_MariaDB_instance_light-bg-warning':
    'AWS::RDS::DBInstance-mariadb-status-warning',
  'Amazon-RDS_MariaDB_instance_light-bg-error':
    'AWS::RDS::DBInstance-mariadb-status-negative',
  'Amazon-RDS_SQL-Server_instance_light-bg-menu':
    'AWS::RDS::DBInstance-sqlserver-ex',
  'Amazon-RDS_SQL-Server_instance_light-bg':
    'AWS::RDS::DBInstance-sqlserver-ex-status-available',
  'Amazon-RDS_SQL-Server_instance_light-bg-warning':
    'AWS::RDS::DBInstance-sqlserver-ex-status-warning',
  'Amazon-RDS_SQL-Server_instance_light-bg-error':
    'AWS::RDS::DBInstance-sqlserver-ex-status-negative',
  'Amazon-RDS_Amazon-Aurora_instance_light-bg-menu':
    'AWS::RDS::DBInstance-aurora',
  'Amazon-RDS_Amazon-Aurora_instance_light-bg':
    'AWS::RDS::DBInstance-aurora-status-available',
  'Amazon-RDS_Amazon-Aurora_instance_light-bg-warning':
    'AWS::RDS::DBInstance-aurora-status-warning',
  'Amazon-RDS_Amazon-Aurora_instance_light-bg-error':
    'AWS::RDS::DBInstance-aurora-status-negative',
  'Amazon-RDS_Amazon-Aurora_instance_postgresql_light-bg-menu':
    'AWS::RDS::DBInstance-aurora-postgresql',
  'Amazon-RDS_Amazon-Aurora_instance_postgresql_light-bg':
    'AWS::RDS::DBInstance-aurora-postgresql-status-available',
  'Amazon-RDS_Amazon-Aurora_instance_postgresql_light-bg-warning':
    'AWS::RDS::DBInstance-aurora-postgresql-status-warning',
  'Amazon-RDS_Amazon-Aurora_instance_postgresql_light-bg-error':
    'AWS::RDS::DBInstance-aurora-postgresql-status-negative',
  'Amazon-RDS_Amazon-Aurora_instance_mysql_light-bg-menu':
    'AWS::RDS::DBInstance-aurora-mysql',
  'Amazon-RDS_Amazon-Aurora_instance_mysql_light-bg':
    'AWS::RDS::DBInstance-aurora-mysql-status-available',
  'Amazon-RDS_Amazon-Aurora_instance_mysql_light-bg-warning':
    'AWS::RDS::DBInstance-aurora-mysql-status-warning',
  'Amazon-RDS_Amazon-Aurora_instance_mysql_light-bg-error':
    'AWS::RDS::DBInstance-aurora-mysql-status-negative',
  'API-Gateway-method-Other_light-bg': 'AWS::ApiGateway::Method',
  'API-Gateway-method-Patch_light-bg': 'PATCH',
  'API-Gateway-method-Get_light-bg': 'GET',
  'API-Gateway-method-Delete_light-bg': 'DELETE',
  'API-Gateway-method-Put_light-bg': 'PUT',
  'API-Gateway-method-Post_light-bg': 'POST',
  'API-Gateway-Resource-light-bg': 'AWS::ApiGateway::Resource',
  'AWS-Identity-and-Access-Management-IAM_Role_light-bg': 'AWS::IAM::Role',
  'User_light-bg': 'AWS::IAM::User',
  IAM_Policy: 'AWS::IAM::Policy',
  'Users_light-bg': 'AWS::IAM::Group',
  'AWS-Identity-and-Access-Management-IAM_Permissions_light-bg':
    'AWS::IAM::AWSPolicyStatement',
  DBSubnetGroup: 'AWS::RDS::DBSubnetGroup',
  'Amazon-Simple-Storage-Service-S3': 'AWS::S3::Bucket',
  'Amazon-DynamoDB_Table_light-bg': 'AWS::DynamoDB::Table',
  'AWS-Tags-bg': 'AWS::TAGS::TAG',
  'AWS-Identity-and-Access-Management-IAM_Permissions_AWSPolicyStatement-light-bg':
    'AWS::IAM::AWSPolicyStatement',
  'AWS-Identity-and-Access-Management-IAM_Permissions_CustomerManagedPolicy-light-bg-menu':
    'AWS::IAM::CustomerManagedPolicyStatement',
  'AWS-Identity-and-Access-Management-IAM_Permissions_CustomerManagedPolicy-light-bg-good':
    'AWS::IAM::CustomerManagedPolicyStatement-status-available',
  'AWS-Identity-and-Access-Management-IAM_Permissions_CustomerManagedPolicy-light-bg-warning':
    'AWS::IAM::CustomerManagedPolicyStatement-status-warning',
  'AWS-Identity-and-Access-Management-IAM_Permissions_CustomerManagedPolicy-light-bg-error':
    'AWS::IAM::CustomerManagedPolicyStatement-status-negative',
  'AWS-Identity-and-Access-Management-IAM_Permissions_RoleInLinePolicy-light-bg':
    'AWS::IAM::Role_In_Line_Policy',
  'AWS-Identity-and-Access-Management-IAM_Permissions_AWSManagedPolicy-light-bg':
    'AWS::IAM::AWSManagedPolicy',
  'AWS-CloudFormation': 'AWS::CloudFormation::Stack',
  'Amazon-Elastic-Block-Store-EBS_Volume_light-bg-menu': 'AWS::EC2::Volume',
  'Amazon-Elastic-Block-Store-EBS_Volume_light-bg':
    'AWS::EC2::Volume-status-available',
  'Amazon-Elastic-Block-Store-EBS_Volume_light-bg-warning':
    'AWS::EC2::Volume-status-warning',
  'Amazon-Elastic-Block-Store-EBS_Volume_light-bg-error':
    'AWS::EC2::Volume-status-negative',
  'Amazon-CloudWatch_Alarm_light-bg': 'AWS::CloudWatch::Alarm',
  'Amazon-EC2_Elastic-IP-Address_light-bg': 'AWS::EC2::EIP',
  'Elastic-Load-Balancing_Classic-load-balancer_light-bg-error':
    'AWS::ElasticLoadBalancing::LoadBalancer-status-negative',
  'Elastic-Load-Balancing_Classic-load-balancer_light-bg':
    'AWS::ElasticLoadBalancing::LoadBalancer-status-available',
  'Elastic-Load-Balancing_Classic-load-balancer_light-bg-warning':
    'AWS::ElasticLoadBalancing::LoadBalancer-status-warning',
  'Elastic-Load-Balancing_Classic-load-balancer_light-bg-menu':
    'AWS::ElasticLoadBalancing::LoadBalancer',
  'Elastic-Load-Balancing-ELB_Application-load-balancer_light-bg':
    'AWS::ElasticLoadBalancingV2::LoadBalancer-application-status-available',
  'Elastic-Load-Balancing-ELB_Application-load-balancer_light-bg-error':
    'AWS::ElasticLoadBalancingV2::LoadBalancer-application-status-negative',
  'Elastic-Load-Balancing-ELB_Application-load-balancer_light-bg-warning':
    'AWS::ElasticLoadBalancingV2::LoadBalancer-application-status-warning',
  'Elastic-Load-Balancing-ELB_Application-load-balancer_light-bg-menu':
    'AWS::ElasticLoadBalancingV2::LoadBalancer',
  'Elastic-Load-Balancing-ELB_Network-load-balancer_light-bg':
    'AWS::ElasticLoadBalancingV2::LoadBalancer-network-status-available',
  'Elastic-Load-Balancing-ELB_Network-load-balancer_light-bg-error':
    'AWS::ElasticLoadBalancingV2::LoadBalancer-network-status-negative',
  'Elastic-Load-Balancing-ELB_Network-load-balancer_light-bg-warning':
    'AWS::ElasticLoadBalancingV2::LoadBalancer-network-status-warning',
  'Elastic-Load-Balancing-ELB_Network-load-balancer_light-bg-menu':
    'AWS::ElasticLoadBalancingV2::LoadBalancer-network',
  'ELB-Listener-light-bg': 'AWS::ElasticLoadBalancingV2::Listener',
  'ELB-Target-light-bg': 'AWS::ElasticLoadBalancingV2::Target',
  'ELB-Target-group-light-bg': 'AWS::ElasticLoadBalancingV2::TargetGroup',
  'Amazon-EC2-Auto-Scaling': 'AWS::AutoScaling::AutoScalingGroup',
  'Amazon-VPC_NAT-Gateway_light-bg': 'AWS::EC2::NatGateway-status-available',
  'Amazon-VPC_NAT-Gateway_light-bg-menu': 'AWS::EC2::NatGateway',
  'Amazon-VPC_NAT-Gateway_light-bg-error':
    'AWS::EC2::NatGateway-status-negative',
  'Amazon-VPC_NAT-Gateway_light-bg-warning':
    'AWS::EC2::NatGateway-status-warning',
  'Env-variable-light-bg': 'AWS::Lambda::EnvironmentVariable',
  'Amazon-Elastic-Container-Service': 'AWS::ECS::Cluster-status-available',
  'Amazon-Elastic-Container-Service-menu': 'AWS::ECS::Cluster',
  'Amazon-Elastic-Container-Service-warning':
    'AWS::ECS::Cluster-status-warning',
  'Amazon-Elastic-Container-Service-error': 'AWS::ECS::Cluster-status-negative',
  'Amazon-Elastic-Container-Service_Service_light-bg':
    'AWS::ECS::Service-status-available',
  'Amazon-Elastic-Container-Service_Service_light-bg-warning':
    'AWS::ECS::Service-status-warning',
  'Amazon-Elastic-Container-Service_Service_light-bg-error':
    'AWS::ECS::Service-status-error',
  'Amazon-Elastic-Container-Service_Service_light-bg-menu': 'AWS::ECS::Service',
  'Amazon-Elastic-Container-Service_Task_light-bg':
    'AWS::ECS::Task-status-available',
  'Amazon-Elastic-Container-Service_Task_light-bg-warning':
    'AWS::ECS::Task-status-warning',
  'Amazon-Elastic-Container-Service_Task_light-bg-error':
    'AWS::ECS::Task-status-error',
  'Amazon-Elastic-Container-Service_Task_light-bg-menu': 'AWS::ECS::Task',
  'ECS-Task-Definition-light-bg': 'AWS::ECS::TaskDefinition-status-available',
  'ECS-Task-Definition-light-bg-warning':
    'AWS::ECS::TaskDefinition-status-warning',
  'ECS-Task-Definition-light-bg-error': 'AWS::ECS::TaskDefinition-status-error',
  'ECS-Task-Definition-light-bg-menu': 'AWS::ECS::TaskDefinition',
  'Env-variable-ECS-light-bg': 'AWS::ECS::EnvironmentVariable',
  'Amazon-EC2_Spot-Instance_light-bg-error': 'AWS::EC2::Spot-status-negative',
  'Amazon-EC2_Spot-Instance_light-bg-warning': 'AWS::EC2::Spot-status-warning',
  'Amazon-EC2_Spot-Instance_light-bg': 'AWS::EC2::Spot-status-available',
  'Amazon-EC2_Spot-Instance_light-bg-menu': 'AWS::EC2::Spot',
  'Spot-fleet_light-bg': 'AWS::EC2::SpotFleet',
  'AWS-Zoom-trans-bg': 'logo-transparent',
  'AWS-Zoom_light-bg': 'logo',
  'AWS-Identity-and-Access-Management-IAM_Data-Encryption-Key_light-bg':
    'AWS::KMS::Key',
  'Amazon-Elasticsearch-Service_light-bg': 'AWS::Elasticsearch::Domain',
  'AWS-CodeBuild_light-bg': 'AWS::CodeBuild::Project',
  'AWS-CodePipeline_light-bg': 'AWS::CodePipeline::Pipeline',
  'status-warning': 'status-warning',
  'status-negative': 'status-negative',
  'status-positive': 'status-available',
  add_circle: 'expand_icon',
  remove_circle: 'collapse_icon',
  availabilityZone: 'availabilityZone',
  'Amazon-VPC_Flow-Logs_light-bg': 'AWS::EC2::FlowLog',
  'Amazon-Simple-Notification-Service-SNS_Topic_light-bg': 'AWS::SNS::Topic',
  search: 'search',
  'Amazon-CloudFront_light-bg': 'AWS::CloudFront::Distribution',
  'Amazon-CloudFront_Streaming-Distribution_light-bg':
    'AWS::CloudFront::StreamingDistribution',
  'AWS-WAF_rate-based-rule-bg': 'AWS::WAF::RateBasedRule',
  'AWS-WAF_rule-bg': 'AWS::WAF::Rule',
  'AWS-WAF_webacl-bg': 'AWS::WAF::WebACL',
  'AWS-WAF_rule-group-bg': 'AWS::WAF::RuleGroup',
  'AWS-WAF_regional-rate-based-rule-bg': 'AWS::WAFRegional::RateBasedRule',
  'AWS-WAF_regional-rule-bg': 'AWS::WAFRegional::Rule',
  'AWS-WAF_regional-webacl-bg': 'AWS::WAFRegional::WebACL',
  'AWS-Shield-bg': 'AWS::Shield::Protection',
  'AWS-Shield_regional-bg': 'AWS::ShieldRegional::Protection',
  'Amazon-Simple-Queue-Service-SQS_Queue_light-bg': 'AWS::SQS::Queue',
  'Amazon-Quantum-Ledger-Database_QLDB_light-bg-error':
    'AWS::QLDB::Ledger-status-negative',
  'Amazon-Quantum-Ledger-Database_QLDB_light-bg-menu': 'AWS::QLDB::Ledger',
  'Amazon-Quantum-Ledger-Database_QLDB_light-bg-warning':
    'AWS::QLDB::Ledger-status-warning',
  'Amazon-Quantum-Ledger-Database_QLDB_light-bg':
    'AWS::QLDB::Ledger-status-available',
  'Amazon-Redshift_light-bg-error': 'AWS::Redshift::Cluster-status-negative',
  'Amazon-Redshift_light-bg-warning': 'AWS::Redshift::Cluster-status-warning',
  'Amazon-Redshift_light-bg': 'AWS::Redshift::Cluster-status-available',
  'Amazon-Redshift_light-bg-menu': 'AWS::Redshift::Cluster',
  'Amazon-EC2-Container-Registry': 'AWS::ECR::Repository',
  'Amazon-Elastic-Kubernetes-Service-menu': 'AWS::EKS::Cluster',
  'Amazon-Elastic-Kubernetes-Service-error':
    'AWS::EKS::Cluster-status-negative',
  'Amazon-Elastic-Kubernetes-Service-warning':
    'AWS::EKS::Cluster-status-warning',
  'Amazon-Elastic-Kubernetes-Service': 'AWS::EKS::Cluster-status-available',
};

const icons = new Map();

for (let [key, value] of Object.entries(serviceIconMap)) {
  icons.set(value, key);
}

export const fetchImage = (type, state) => {
  let image;
  if (state && type) {
    image = icons.get(`${type}-${state.status}`);
  } else if (state && !type) {
    image = icons.get(state.status);
  } else if (!state && type) {
    image = icons.get(type);
  } else {
    return undefined;
  }
  return image ? buildURL(image) : undefined;
};

const buildURL = (image) => {
  return `${process.env.PUBLIC_URL}/icons/${image}.svg`;
};

export const fetchLogo = (transparent) => {
  return transparent
    ? `${process.env.PUBLIC_URL}/icons/${icons.get('logo-transparent')}.svg`
    : `${process.env.PUBLIC_URL}/icons/${icons.get('logo')}.svg`;
};
