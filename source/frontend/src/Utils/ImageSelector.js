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
  'Amazon-EC2_C5a-Instance_light-bg-error': 'c5a-status-negative',
  'Amazon-EC2_C5a-Instance_light-bg-warning': 'c5a-status-warning',
  'Amazon-EC2_C5a-Instance_light-bg': 'c5a-status-available',
  'Amazon-EC2_C6i-Instance_light-bg-error': 'c6i-status-negative',
  'Amazon-EC2_C6i-Instance_light-bg-warning': 'c6i-status-warning',
  'Amazon-EC2_C6i-Instance_light-bg': 'c6i-status-available',
  'Amazon-EC2_C6g-Instance_light-bg-error': 'c6g-status-negative',
  'Amazon-EC2_C6g-Instance_light-bg-warning': 'c6g-status-warning',
  'Amazon-EC2_C6g-Instance_light-bg': 'c6g-status-available',
  'Amazon-EC2_C6gn-Instance_light-bg-error': 'c6gn-status-negative',
  'Amazon-EC2_C6gn-Instance_light-bg-warning': 'c6gn-status-warning',
  'Amazon-EC2_C6gn-Instance_light-bg': 'c6gn-status-available',
  'Amazon-EC2_C7g-Instance_light-bg-error': 'c7g-status-negative',
  'Amazon-EC2_C7g-Instance_light-bg-warning': 'c7g-status-warning',
  'Amazon-EC2_C7g-Instance_light-bg': 'c7g-status-available',
  'Amazon-EC2_D2-Instance_light-bg-error': 'd2-status-negative',
  'Amazon-EC2_D2-Instance_light-bg-warning': 'd2-status-warning',
  'Amazon-EC2_D2-Instance_light-bg': 'd2-status-available',
  'Amazon-EC2_M1-Instance_light-bg-error': 'm1-status-negative',
  'Amazon-EC2_M1-Instance_light-bg-warning': 'm1-status-warning',
  'Amazon-EC2_M1-Instance_light-bg': 'm1-status-available',
  'Amazon-EC2_IM4gn-Instance_light-bg-error': 'im4gn-status-negative',
  'Amazon-EC2_IM4gn-Instance_light-bg-warning': 'im4gn-status-warning',
  'Amazon-EC2_IM4gn-Instance_light-bg': 'im4gn-status-available',
  'Amazon-EC2_IS4gen-Instance_light-bg-error': 'is4gen-status-negative',
  'Amazon-EC2_IS4gen-Instance_light-bg-warning': 'is4gen-status-warning',
  'Amazon-EC2_IS4gen-Instance_light-bg': 'is4gen-status-available',
  'Amazon-EC2_I4i-Instance_light-bg-error': 'i4i-status-negative',
  'Amazon-EC2_I4i-Instance_light-bg-warning': 'i4i-status-warning',
  'Amazon-EC2_I4i-Instance_light-bg': 'i4i-status-available',
  'Amazon-EC2_I3-Instance_light-bg-error': 'i3-status-negative',
  'Amazon-EC2_I3-Instance_light-bg-warning': 'i3-status-warning',
  'Amazon-EC2_I3-Instance_light-bg': 'i3-status-available',
  'Amazon-EC2_I3en-Instance_light-bg-error': 'i3en-status-negative',
  'Amazon-EC2_I3en-Instance_light-bg-warning': 'i3en-status-warning',
  'Amazon-EC2_I3en-Instance_light-bg': 'i3en-status-available',
  'Amazon-EC2_D3-Instance_light-bg-error': 'd3-status-negative',
  'Amazon-EC2_D3-Instance_light-bg-warning': 'd3-status-warning',
  'Amazon-EC2_D3-Instance_light-bg': 'd3-status-available',
  'Amazon-EC2_D3en-Instance_light-bg-error': 'd3en-status-negative',
  'Amazon-EC2_D3en-Instance_light-bg-warning': 'd3en-status-warning',
  'Amazon-EC2_D3en-Instance_light-bg': 'd3en-status-available',
  'Amazon-EC2_H1-Instance_light-bg-error': 'h1-status-negative',
  'Amazon-EC2_H1-Instance_light-bg-warning': 'h1-status-warning',
  'Amazon-EC2_H1-Instance_light-bg': 'h1-status-available',
  'Amazon-EC2_F1-Instance_light-bg-error': 'f1-status-negative',
  'Amazon-EC2_F1-Instance_light-bg-warning': 'f1-status-warning',
  'Amazon-EC2_F1-Instance_light-bg': 'f1-status-available',
  'Amazon-EC2_G3-Instance_light-bg-error': 'g3-status-negative',
  'Amazon-EC2_G3-Instance_light-bg-warning': 'g3-status-warning',
  'Amazon-EC2_G3-Instance_light-bg': 'g3-status-available',
  'Amazon-EC2_HMem6-Instance_light-bg-error': 'u-6tb1-status-negative',
  'Amazon-EC2_HMem6-Instance_light-bg-warning': 'u-6tb1-status-warning',
  'Amazon-EC2_HMem6-Instance_light-bg': 'u-6tb1-status-available',
  'Amazon-EC2_HMem9-Instance_light-bg-error': 'u-9tb1-status-negative',
  'Amazon-EC2_HMem9-Instance_light-bg-warning': 'u-9tb1-status-warning',
  'Amazon-EC2_HMem9-Instance_light-bg': 'u-9tb1-status-available',
  'Amazon-EC2_HMem12-Instance_light-bg-error': 'u-12tb1-status-negative',
  'Amazon-EC2_HMem12-Instance_light-bg-warning': 'u-12tb1-status-warning',
  'Amazon-EC2_HMem12-Instance_light-bg': 'u-12tb1-status-available',
  'Amazon-EC2_HMem18-Instance_light-bg-error': 'u-18tb1-status-negative',
  'Amazon-EC2_HMem18-Instance_light-bg-warning': 'u-18tb1-status-warning',
  'Amazon-EC2_HMem18-Instance_light-bg': 'u-18tb1-status-available',
  'Amazon-EC2_HMem24-Instance_light-bg-error': 'u-24tb1-status-negative',
  'Amazon-EC2_HMem24-Instance_light-bg-warning': 'u-24tb1-status-warning',
  'Amazon-EC2_HMem24-Instance_light-bg': 'u-24tb1-status-available',
  'Amazon-EC2_M4-Instance_light-bg-error': 'm4-status-negative',
  'Amazon-EC2_M4-Instance_light-bg-warning': 'm4-status-warning',
  'Amazon-EC2_M4-Instance_light-bg': 'm4-status-available',
  'Amazon-EC2_M5-Instance_light-bg-error': 'm5-status-negative',
  'Amazon-EC2_M5-Instance_light-bg-warning': 'm5-status-warning',
  'Amazon-EC2_M5-Instance_light-bg': 'm5-status-available',
  'Amazon-EC2_M5a-Instance_light-bg-error': 'm5a-status-negative',
  'Amazon-EC2_M5a-Instance_light-bg-warning': 'm5a-status-warning',
  'Amazon-EC2_M5a-Instance_light-bg': 'm5a-status-available',
  'Amazon-EC2_M5zn-Instance_light-bg-error': 'm5zn-status-negative',
  'Amazon-EC2_M5zn-Instance_light-bg-warning': 'm5zn-status-warning',
  'Amazon-EC2_M5zn-Instance_light-bg': 'm5zn-status-available',
  'Amazon-EC2_M5n-Instance_light-bg-error': 'm5n-status-negative',
  'Amazon-EC2_M5n-Instance_light-bg-warning': 'm5n-status-warning',
  'Amazon-EC2_M5n-Instance_light-bg': 'm5n-status-available',
  'Amazon-EC2_M6i-Instance_light-bg-error': 'm6i-status-negative',
  'Amazon-EC2_M6i-Instance_light-bg-warning': 'm6i-status-warning',
  'Amazon-EC2_M6i-Instance_light-bg': 'm6i-status-available',
  'Amazon-EC2_M6g-Instance_light-bg-error': 'm6g-status-negative',
  'Amazon-EC2_M6g-Instance_light-bg-warning': 'm6g-status-warning',
  'Amazon-EC2_M6g-Instance_light-bg': 'm6g-status-available',
  'Amazon-EC2_P2-Instance_light-bg-error': 'p2-status-negative',
  'Amazon-EC2_P2-Instance_light-bg-warning': 'p2-status-warning',
  'Amazon-EC2_P2-Instance_light-bg': 'p2-status-available',
  'Amazon-EC2_P3-Instance_light-bg-error': 'p3-status-negative',
  'Amazon-EC2_P3-Instance_light-bg-warning': 'p3-status-warning',
  'Amazon-EC2_P3-Instance_light-bg': 'p3-status-available',
  'Amazon-EC2_P4-Instance_light-bg-error': 'p4d-status-negative',
  'Amazon-EC2_P4-Instance_light-bg-warning': 'p4d-status-warning',
  'Amazon-EC2_P4-Instance_light-bg': 'p4d-status-available',
  'Amazon-EC2_DL1-Instance_light-bg-error': 'dl1-status-negative',
  'Amazon-EC2_DL1-Instance_light-bg-warning': 'dl1-status-warning',
  'Amazon-EC2_DL1-Instance_light-bg': 'dl1-status-available',
  'Amazon-EC2_P3dn-Instance_light-bg-error': 'p3dn-status-negative',
  'Amazon-EC2_P3dn-Instance_light-bg-warning': 'p3dn-status-warning',
  'Amazon-EC2_P3dn-Instance_light-bg': 'p3dn-status-available',
  'Amazon-EC2_TRN1-Instance_light-bg-error': 'trn1-status-negative',
  'Amazon-EC2_TRN1-Instance_light-bg-warning': 'trn1-status-warning',
  'Amazon-EC2_TRN1-Instance_light-bg': 'trn1-status-available',
  'Amazon-EC2_INF1-Instance_light-bg-error': 'inf1-status-negative',
  'Amazon-EC2_INF1-Instance_light-bg-warning': 'inf1-status-warning',
  'Amazon-EC2_INF1-Instance_light-bg': 'inf1-status-available',
  'Amazon-EC2_G5-Instance_light-bg-error': 'g5-status-negative',
  'Amazon-EC2_G5-Instance_light-bg-warning': 'g5-status-warning',
  'Amazon-EC2_G5-Instance_light-bg': 'g5-status-available',
  'Amazon-EC2_G5g-Instance_light-bg-error': 'g5g-status-negative',
  'Amazon-EC2_G5g-Instance_light-bg-warning': 'g5g-status-warning',
  'Amazon-EC2_G5g-Instance_light-bg': 'g5g-status-available',
  'Amazon-EC2_G4dn-Instance_light-bg-error': 'g4dn-status-negative',
  'Amazon-EC2_G4dn-Instance_light-bg-warning': 'g4dn-status-warning',
  'Amazon-EC2_G4dn-Instance_light-bg': 'g4dn-status-available',
  'Amazon-EC2_G4ad-Instance_light-bg-error': 'g4ad-status-negative',
  'Amazon-EC2_G4ad-Instance_light-bg-warning': 'g4ad-status-warning',
  'Amazon-EC2_G4ad-Instance_light-bg': 'g4ad-status-available',
  'Amazon-EC2_VT1-Instance_light-bg-error': 'vt1-status-negative',
  'Amazon-EC2_VT1-Instance_light-bg-warning': 'vt1-status-warning',
  'Amazon-EC2_VT1-Instance_light-bg': 'vt1-status-available',
  'Amazon-EC2_R4-Instance_light-bg-error': 'r4-status-negative',
  'Amazon-EC2_R4-Instance_light-bg-warning': 'r4-status-warning',
  'Amazon-EC2_R4-Instance_light-bg': 'r4-status-available',
  'Amazon-EC2_R5-Instance_light-bg-error': 'r5-status-negative',
  'Amazon-EC2_R5-Instance_light-bg-warning': 'r5-status-warning',
  'Amazon-EC2_R5-Instance_light-bg': 'r5-status-available',
  'Amazon-EC2_R6g-Instance_light-bg': 'r6g-status-available',
  'Amazon-EC2_R6g-Instance_light-bg-error': 'r6g-status-negative',
  'Amazon-EC2_R6g-Instance_light-bg-warning': 'r6g-status-warning',
  'Amazon-EC2_R6i-Instance_light-bg': 'R6i-status-available',
  'Amazon-EC2_R6i-Instance_light-bg-error': 'R6i-status-negative',
  'Amazon-EC2_R6i-Instance_light-bg-warning': 'R6i-status-warning',
  'Amazon-EC2_R5a-Instance_light-bg': 'R5a-status-available',
  'Amazon-EC2_R5a-Instance_light-bg-error': 'R5a-status-negative',
  'Amazon-EC2_R5a-Instance_light-bg-warning': 'R5a-status-warning',
  'Amazon-EC2_R5b-Instance_light-bg': 'R5b-status-available',
  'Amazon-EC2_R5b-Instance_light-bg-error': 'R5b-status-negative',
  'Amazon-EC2_R5b-Instance_light-bg-warning': 'R5n-status-warning',
  'Amazon-EC2_R5n-Instance_light-bg': 'R5n-status-available',
  'Amazon-EC2_R5n-Instance_light-bg-error': 'R5n-status-negative',
  'Amazon-EC2_R5n-Instance_light-bg-warning': 'r5-status-warning',
  'Amazon-EC2_X2gd-Instance_light-bg': 'X2gd-status-available',
  'Amazon-EC2_X2gd-Instance_light-bg-error': 'X2gd-status-negative',
  'Amazon-EC2_X2gd-Instance_light-bg-warning': 'X2gd-status-warning',
  'Amazon-EC2_X2idn-Instance_light-bg': 'X2idn-status-available',
  'Amazon-EC2_X2idn-Instance_light-bg-error': 'X2idn-status-negative',
  'Amazon-EC2_X2idn-Instance_light-bg-warning': 'X2idn-status-warning',
  'Amazon-EC2_X2iedn-Instance_light-bg': 'X2iedn-status-available',
  'Amazon-EC2_X2iedn-Instance_light-bg-error': 'X2iedn-status-negative',
  'Amazon-EC2_X2iedn-Instance_light-bg-warning': 'X2iedn-status-warning',
  'Amazon-EC2_X2iezn-Instance_light-bg-error': 'X2iezn-status-negative',
  'Amazon-EC2_X2iezn-Instance_light-bg-warning': 'X2iezn-status-warning',
  'Amazon-EC2_X2iezn-Instance_light-bg': 'X2iezn-status-available',
  'Amazon-EC2_T3-Instance_light-bg-error': 't3-status-negative',
  'Amazon-EC2_T3-Instance_light-bg-warning': 't3-status-warning',
  'Amazon-EC2_T3-Instance_light-bg': 't3-status-available',
  'Amazon-EC2_T3a-Instance_light-bg-error': 't3a-status-negative',
  'Amazon-EC2_T3a-Instance_light-bg-warning': 't3a-status-warning',
  'Amazon-EC2_T3a-Instance_light-bg': 't3a-status-available',
  'Amazon-EC2_T4g-Instance_light-bg-error': 't4g-status-negative',
  'Amazon-EC2_T4g-Instance_light-bg-warning': 't4g-status-warning',
  'Amazon-EC2_T4g-Instance_light-bg': 't4g-status-available',
  'Amazon-EC2_X1-Instance_light-bg-error': 'x1-status-negative',
  'Amazon-EC2_X1-Instance_light-bg-warning': 'x1-status-warning',
  'Amazon-EC2_X1-Instance_light-bg': 'x1-status-available',
  'Amazon-EC2_X1e-Instance_light-bg-error': 'x1e-status-negative',
  'Amazon-EC2_X1e-Instance_light-bg-warning': 'x1e-status-warning',
  'Amazon-EC2_X1e-Instance_light-bg': 'x1e-status-available',
  'Amazon-EC2_z1d-Instance_light-bg-error': 'z1d-status-negative',
  'Amazon-EC2_z1d-Instance_light-bg-warning': 'z1d-status-warning',
  'Amazon-EC2_z1d-Instance_light-bg': 'z1d-status-available',
  'Amazon-EC2_MAC-Instance_light-bg-error': 'mac1-status-negative',
  'Amazon-EC2_MAC-Instance_light-bg-warning': 'mac1-status-warning',
  'Amazon-EC2_MAC-Instance_light-bg': 'mac1-status-available',
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
  'Amazon-DBClusterSnapshot': 'AWS::RDS::DBClusterSnapshot',
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
  'AWS-Tags-bg': 'AWS::Tags::Tag',
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
    'AWS::IAM::InlinePolicy',
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
  'Amazon-Redshift_light-parameter-group': 'AWS::Redshift::ClusterParameterGroup',
  'Amazon-Redshift_light-subnet-group': 'AWS::Redshift::ClusterSubnetGroup',
  'Amazon-Redshift_light-snapshot': 'AWS::Redshift::ClusterSnapshot',
  'Amazon-EC2-Container-Registry': 'AWS::ECR::Repository',
  'Amazon-Elastic-Kubernetes-Service-menu': 'AWS::EKS::Cluster',
  'Amazon-Elastic-Kubernetes-Service-error':
    'AWS::EKS::Cluster-status-negative',
  'Amazon-Elastic-Kubernetes-Service-warning':
    'AWS::EKS::Cluster-status-warning',
  'Amazon-Elastic-Kubernetes-Service': 'AWS::EKS::Cluster-status-available',
  'Amazon-VPN_Connection_light-bg-menu': 'AWS::EC2::VPNConnection',
  'Amazon-VPN_Connection_light-bg': 'AWS::EC2::VPNConnection-status-available',
  'Amazon-VPN_Connection_light-bg-warning':
    'AWS::EC2::VPNConnection-status-warning',
  'Amazon-VPN_Connection_light-bg-error':
    'AWS::EC2::VPNConnection-status-negative',
  'Amazon-VPN_Connection_Route_light-bg-menu': 'AWS::EC2::VPNConnectionRoute',
  'Amazon-VPN_Connection_Route_light-bg':
    'AWS::EC2::VPNConnectionRoute-status-available',
  'Amazon-VPN_Connection_Route_light-bg-warning':
    'AWS::EC2::VPNConnectionRoute-status-warning',
  'Amazon-VPN_Connection_Route_light-bg-error':
    'AWS::EC2::VPNConnectionRoute-status-negative',
  'Amazon-VPN_Gateway_light-bg-menu': 'AWS::EC2::VPNGateway',
  'Amazon-VPN_Gateway_light-bg': 'AWS::EC2::VPNGateway-status-available',
  'Amazon-VPN_Gateway_light-bg-warning': 'AWS::EC2::VPNGateway-status-warning',
  'Amazon-VPN_Gateway_light-bg-error': 'AWS::EC2::VPNGateway-status-negative',
  'Amazon-VPC_Customer_Gateway_light-bg-menu': 'AWS::EC2::CustomerGateway',
  'Amazon-VPC_Customer_Gateway_light-bg':
    'AWS::EC2::CustomerGateway-status-available',
  'Amazon-VPC_Customer_Gateway_light-bg-warning':
    'AWS::EC2::CustomerGateway-status-warning',
  'Amazon-VPC_Customer_Gateway_light-bg-error':
    'AWS::EC2::CustomerGateway-status-negative',
    'AWS-Systems-Manager_Inventory': 'AWS::SSM::ManagedInstanceInventory',
    'AWS-AutoScaling-LaunchConfiguration': 'AWS::AutoScaling::LaunchConfiguration',
    'API-Gateway-Stage': 'AWS::ApiGateway::Stage',
    'AWSDBSecurityGroup': 'AWS::RDS::DBSecurityGroup',
    'Amazon-S3_public_access_block': 'AWS::S3::AccountPublicAccessBlock',
    'Amazon-RDS_Amazon-RDS_Snapshot_light-bg' : 'AWS::RDS::DBSnapshot',
    'Amazon-CloudTrail-trail-light-bg': 'AWS::CloudTrail::Trail',
    'treeview-expand': 'expand',
    'treeview-collapse': 'collapse',
  'default-icon': 'default-icon',
  'Res_AWS-Backup_Backup-Plan_48_Light': 'AWS::Backup::BackupPlan',
  'Res_AWS-Backup_Recovery-Point-Objective_48_Light': 'AWS::Backup::RecoveryPoint',
  'Res_AWS-Backup_Backup-Vault_48_Light' : 'AWS::Backup::BackupVault',
  'Arch_Amazon-Kinesis-Data-Streams_64' : 'AWS::Kinesis::Stream',
  'Res_Amazon-Elastic-File-System_File-System_48_Light': 'AWS::EFS::FileSystem',
  'Res_Amazon-Simple-Storage-Service_General-Access-Points_48_Light' : 'AWS::EFS::AccessPoint',
  'Res_AWS-Identity-Access-Management_Permissions_48_Light': 'AWS::IAM::InlinePolicy',
  'Arch_Amazon-EKS-Distro_64': 'AWS::EKS::Nodegroup',
  'Arch_AWS-Config_64': 'AWS::Config::ResourceCompliance',
  'Arch_Amazon-Cognito_64': 'AWS::Cognito::UserPool',
  'AWS-AutoScaling-ScalingPolicy': 'AWS::AutoScaling::ScalingPolicy',
  'API-GatewayV2-Stage': 'AWS::ApiGatewayV2::Stage',
  'Res_Amazon-API-Gateway_Endpoint_48_Light': 'AWS::ApiGatewayV2::Api',
  'AWS-Backup-Selection': 'AWS::Backup::BackupSelection',
  'API-Gateway-Authorizer': 'AWS::ApiGateway::Authorizer',
  'Res_Amazon-SageMaker_Model_48_Light': 'AWS::SageMaker::Model',
  'Arch_AWS-Step-Functions_64': 'AWS::StepFunctions::StateMachine',
  'StepFunctionsActivity': 'AWS::StepFunctions::Activity',
  'Arch_Amazon-Managed-Streaming-for-Apache-Kafka_64': 'AWS::MSK::Cluster',
  'Arch_AWS-WorkSpaces_64': 'AWS::WorkSpaces::Workspace',
  'WorkspacesConnectionAlias': 'AWS::WorkSpaces::ConnectionAlias',
  'DMSReplicationSubnetGroup': 'AWS::DMS::ReplicationSubnetGroup',
  'Res_Amazon-Simple-Notification-Service_DMS_Notification_48_Light': 'AWS::DMS::EventSubscription',
  'Res_AWS-Identity-Access-Management_AWS-IAM-Access-Analyzer_48_Light': 'AWS::AccessAnalyzer::Analyzer',
  'Arch_AWS-Batch_Queue_64': 'AWS::Batch::JobQueue',
  'Res_AWS-Batch_Compute_48_Light.svg': 'AWS::Batch::ComputeEnvironment',
  'Res_Amazon-Route-53_Resolver-Rule_48_Light': 'AWS::Route53Resolver::ResolverRule',
  'Res_Amazon-Route-53_Resolver-Rule-Association_48_Light': 'AWS::Route53Resolver::ResolverRuleAssociation',
  'Res_Amazon-Route-53_Resolver-Endpoint_48_Light': 'AWS::Route53Resolver::ResolverRuleEndpoint',
  'Res_AWS-EC2_Launch_Template_48_Light': 'AWS::EC2::LaunchTemplate',
  'Arch_AWS-Transit-Gateway_64': 'AWS::EC2::TransitGateway',
  'Res_AWS-Transit-Gateway_Attachment_48_Dark': 'AWS::EC2::TransitGatewayAttachment',
  'Res_Amazon-Route-53_Route-Table_48_Dark': 'AWS::EC2::TransitGatewayRouteTable',
  'Arch_Amazon-OpenSearch-Service_64': 'AWS::OpenSearch::Domain',
  'Res_AWS-Certificate-Manager_Certificate_48_Light': 'AWS::ACM::Certificate',
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
    image = icons.get('default-icon');
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
