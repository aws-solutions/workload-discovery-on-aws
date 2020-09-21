exports.vpcResourceInput = [
    {
        "id": "14a7fa5949805ac5087476fc995fdb56",
        "perspectiveBirthDate": "2019-12-11T12:11:44.844Z",
        "label": "AWS::EC2::RouteTable",
        "properties": {
            "associations": "[{\"main\":true,\"routeTableAssociationId\":\"rtbassoc-8dc350f6\",\"routeTableId\":\"rtb-55a6aa2c\",\"subnetId\":null}]",
            "configurationItemStatus": "ResourceDiscovered",
            "awsRegion": "eu-west-1",
            "resourceId": "rtb-55a6aa2c",
            "supplementaryConfiguration": "{}",
            "configuration": "{\"associations\":[{\"main\":true,\"routeTableAssociationId\":\"rtbassoc-8dc350f6\",\"routeTableId\":\"rtb-55a6aa2c\",\"subnetId\":null}],\"propagatingVgws\":[],\"routeTableId\":\"rtb-55a6aa2c\",\"routes\":[{\"destinationCidrBlock\":\"172.31.0.0/16\",\"destinationIpv6CidrBlock\":null,\"destinationPrefixListId\":null,\"egressOnlyInternetGatewayId\":null,\"gatewayId\":\"local\",\"instanceId\":null,\"instanceOwnerId\":null,\"natGatewayId\":null,\"transitGatewayId\":null,\"networkInterfaceId\":null,\"origin\":\"CreateRouteTable\",\"state\":\"active\",\"vpcPeeringConnectionId\":null},{\"destinationCidrBlock\":\"0.0.0.0/0\",\"destinationIpv6CidrBlock\":null,\"destinationPrefixListId\":null,\"egressOnlyInternetGatewayId\":null,\"gatewayId\":\"igw-772c3a10\",\"instanceId\":null,\"instanceOwnerId\":null,\"natGatewayId\":null,\"transitGatewayId\":null,\"networkInterfaceId\":null,\"origin\":\"CreateRoute\",\"state\":\"active\",\"vpcPeeringConnectionId\":null}],\"tags\":[],\"vpcId\":\"vpc-88f114f1\",\"ownerId\":\"XXXXXXXXXXXX\"}",
            "configurationItemMD5Hash": "",
            "title": "rtb-55a6aa2c",
            "availabilityZone": "Not Applicable",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-11-28T16:09:53.380Z",
            "tags": "{}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#RouteTables:sort=routeTableId",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1574957393380",
            "perspectiveBirthDate": "2019-12-11T12:11:44.844Z",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#RouteTables:sort=routeTableId",
            "relatedEvents": "[]",
            "vpcId": "vpc-88f114f1",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:route-table/rtb-55a6aa2c",
            "resourceType": "AWS::EC2::RouteTable"
        },
        "parent": false,
        "costData": {
            "totalCost": 0,
            "currency": "USD",
            "startDate": "2019-12-20T20:06:30.234Z",
            "endDate": "1970-01-01T00:00:00.000Z"
        }
    },
    {
        "id": "1f3bc4c2530bffe91f4006f69f4a480d",
        "perspectiveBirthDate": "2019-12-11T12:11:37.345Z",
        "label": "AWS::EC2::NetworkAcl",
        "properties": {
            "associations": "[{\"networkAclAssociationId\":\"aclassoc-3553314b\",\"networkAclId\":\"acl-6a24bb13\",\"subnetId\":\"subnet-ea59c9b0\"},{\"networkAclAssociationId\":\"aclassoc-3453314a\",\"networkAclId\":\"acl-6a24bb13\",\"subnetId\":\"subnet-40fbdd08\"},{\"networkAclAssociationId\":\"aclassoc-37533149\",\"networkAclId\":\"acl-6a24bb13\",\"subnetId\":\"subnet-a20452c4\"}]",
            "configurationItemStatus": "ResourceDiscovered",
            "awsRegion": "eu-west-1",
            "resourceId": "acl-6a24bb13",
            "supplementaryConfiguration": "{}",
            "configuration": "{\"associations\":[{\"networkAclAssociationId\":\"aclassoc-3553314b\",\"networkAclId\":\"acl-6a24bb13\",\"subnetId\":\"subnet-ea59c9b0\"},{\"networkAclAssociationId\":\"aclassoc-3453314a\",\"networkAclId\":\"acl-6a24bb13\",\"subnetId\":\"subnet-40fbdd08\"},{\"networkAclAssociationId\":\"aclassoc-37533149\",\"networkAclId\":\"acl-6a24bb13\",\"subnetId\":\"subnet-a20452c4\"}],\"entries\":[{\"cidrBlock\":\"0.0.0.0/0\",\"egress\":true,\"icmpTypeCode\":null,\"ipv6CidrBlock\":null,\"portRange\":null,\"protocol\":\"-1\",\"ruleAction\":\"allow\",\"ruleNumber\":100},{\"cidrBlock\":\"0.0.0.0/0\",\"egress\":true,\"icmpTypeCode\":null,\"ipv6CidrBlock\":null,\"portRange\":null,\"protocol\":\"-1\",\"ruleAction\":\"deny\",\"ruleNumber\":32767},{\"cidrBlock\":\"0.0.0.0/0\",\"egress\":false,\"icmpTypeCode\":null,\"ipv6CidrBlock\":null,\"portRange\":null,\"protocol\":\"-1\",\"ruleAction\":\"allow\",\"ruleNumber\":100},{\"cidrBlock\":\"0.0.0.0/0\",\"egress\":false,\"icmpTypeCode\":null,\"ipv6CidrBlock\":null,\"portRange\":null,\"protocol\":\"-1\",\"ruleAction\":\"deny\",\"ruleNumber\":32767}],\"isDefault\":true,\"networkAclId\":\"acl-6a24bb13\",\"tags\":[],\"vpcId\":\"vpc-88f114f1\",\"ownerId\":\"XXXXXXXXXXXX\"}",
            "configurationItemMD5Hash": "",
            "title": "acl-6a24bb13",
            "availabilityZone": "Multiple Availability Zones",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-11-28T16:09:54.072Z",
            "tags": "{}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#acls:sort=networkAclId",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "XXXXXXXXXXXX",
            "isDefault": "true",
            "perspectiveBirthDate": "2019-12-11T12:11:37.345Z",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#acls:sort=networkAclId",
            "relatedEvents": "[]",
            "vpcId": "vpc-88f114f1",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-acl/acl-6a24bb13",
            "resourceType": "AWS::EC2::NetworkAcl"
        },
        "parent": false,
        "costData": {
            "totalCost": 0,
            "currency": "USD",
            "startDate": "2019-12-20T20:06:30.233Z",
            "endDate": "1970-01-01T00:00:00.000Z"
        }
    },
    {
        "id": "13f5123897a5e89c750890a97a2ea3bd",
        "perspectiveBirthDate": "2019-12-11T12:11:44.559Z",
        "label": "AWS::EC2::InternetGateway",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "awsRegion": "eu-west-1",
            "resourceId": "igw-772c3a10",
            "supplementaryConfiguration": "{}",
            "configuration": "{\"attachments\":[{\"state\":\"available\",\"vpcId\":\"vpc-88f114f1\"}],\"internetGatewayId\":\"igw-772c3a10\",\"ownerId\":\"XXXXXXXXXXXX\",\"tags\":[]}",
            "configurationItemMD5Hash": "",
            "title": "igw-772c3a10",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-11-28T16:09:53.830Z",
            "availabilityZone": "Multiple Availability Zones",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#igws:sort=internetGatewayId",
            "tags": "{}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1574957393830",
            "perspectiveBirthDate": "2019-12-11T12:11:44.559Z",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#igws:sort=internetGatewayId",
            "vpcId": "vpc-88f114f1",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:internet-gateway/igw-772c3a10",
            "resourceType": "AWS::EC2::InternetGateway"
        },
        "parent": false,
        "costData": {
            "totalCost": 0,
            "currency": "USD",
            "startDate": "2019-12-20T20:06:30.232Z",
            "endDate": "1970-01-01T00:00:00.000Z"
        }
    },
    {
        "id": "b9d7a6f27482f7dbb97df1b7e792d346",
        "perspectiveBirthDate": "2019-12-12T21:11:21.992Z",
        "label": "AWS::EC2::VPC",
        "properties": {
            "configurationItemStatus": "OK",
            "resourceId": "vpc-88f114f1",
            "configuration": "{\"cidrBlock\":\"172.31.0.0/16\",\"dhcpOptionsId\":\"dopt-fdacf89b\",\"state\":\"available\",\"vpcId\":\"vpc-88f114f1\",\"ownerId\":\"XXXXXXXXXXXX\",\"instanceTenancy\":\"default\",\"ipv6CidrBlockAssociationSet\":[],\"cidrBlockAssociationSet\":[{\"associationId\":\"vpc-cidr-assoc-b57b76de\",\"cidrBlock\":\"172.31.0.0/16\",\"cidrBlockState\":{\"state\":\"associated\",\"statusMessage\":null}}],\"isDefault\":true,\"tags\":[]}",
            "title": "vpc-88f114f1",
            "availabilityZone": "Multiple Availability Zones",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#vpcs:sort=VpcId",
            "perspectiveBirthDate": "2019-12-12T21:11:21.992Z",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#vpcs:sort=VpcId",
            "vpcId": "vpc-88f114f1",
            "relatedEvents": "[]",
            "state": "\"available\"",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:vpc/vpc-88f114f1",
            "instanceTenancy": "default",
            "awsRegion": "eu-west-1",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "cidrBlock": "172.31.0.0/16",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-12-12T21:09:52.777Z",
            "tags": "{}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "XXXXXXXXXXXX",
            "isDefault": "true",
            "dhcpOptionsId": "dopt-fdacf89b",
            "resourceType": "AWS::EC2::VPC"
        },
        "parent": true,
        "costData": {
            "totalCost": 0,
            "currency": "USD",
            "startDate": "2019-12-20T20:06:30.236Z",
            "endDate": "1970-01-01T00:00:00.000Z"
        }
    }
];

exports.vpcResourceHierarchyResult = {
    account:
    {
        'XXXXXXXXXXXX':
        {
            region:
            {
                'eu-west-1':
                {
                    vpc:
                    {
                        'vpc-88f114f1':
                        {
                            availabilityZone:
                            {
                                undefined:
                                {
                                    subnet:
                                    {
                                        undefined:
                                        {
                                            type:
                                            {
                                                RouteTable:
                                                {
                                                    nodes:
                                                        [{
                                                            id: '14a7fa5949805ac5087476fc995fdb56',
                                                            perspectiveBirthDate: '2019-12-11T12:11:44.844Z',
                                                            label: 'AWS::EC2::RouteTable',
                                                            properties:
                                                            {
                                                                associations:
                                                                    '[{"main":true,"routeTableAssociationId":"rtbassoc-8dc350f6","routeTableId":"rtb-55a6aa2c","subnetId":null}]',
                                                                configurationItemStatus: 'ResourceDiscovered',
                                                                awsRegion: 'eu-west-1',
                                                                resourceId: 'rtb-55a6aa2c',
                                                                supplementaryConfiguration: '{}',
                                                                configuration:
                                                                    '{"associations":[{"main":true,"routeTableAssociationId":"rtbassoc-8dc350f6","routeTableId":"rtb-55a6aa2c","subnetId":null}],"propagatingVgws":[],"routeTableId":"rtb-55a6aa2c","routes":[{"destinationCidrBlock":"172.31.0.0/16","destinationIpv6CidrBlock":null,"destinationPrefixListId":null,"egressOnlyInternetGatewayId":null,"gatewayId":"local","instanceId":null,"instanceOwnerId":null,"natGatewayId":null,"transitGatewayId":null,"networkInterfaceId":null,"origin":"CreateRouteTable","state":"active","vpcPeeringConnectionId":null},{"destinationCidrBlock":"0.0.0.0/0","destinationIpv6CidrBlock":null,"destinationPrefixListId":null,"egressOnlyInternetGatewayId":null,"gatewayId":"igw-772c3a10","instanceId":null,"instanceOwnerId":null,"natGatewayId":null,"transitGatewayId":null,"networkInterfaceId":null,"origin":"CreateRoute","state":"active","vpcPeeringConnectionId":null}],"tags":[],"vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX"}',
                                                                configurationItemMD5Hash: '',
                                                                title: 'rtb-55a6aa2c',
                                                                availabilityZone: 'Not Applicable',
                                                                version: '1.3',
                                                                configurationItemCaptureTime: '2019-11-28T16:09:53.380Z',
                                                                tags: '{}',
                                                                loggedInURL:
                                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#RouteTables:sort=routeTableId',
                                                                accountId: 'XXXXXXXXXXXX',
                                                                configurationStateId: '1574957393380',
                                                                perspectiveBirthDate: '2019-12-11T12:11:44.844Z',
                                                                loginURL:
                                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#RouteTables:sort=routeTableId',
                                                                relatedEvents: '[]',
                                                                vpcId: 'vpc-88f114f1',
                                                                arn:
                                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:route-table/rtb-55a6aa2c',
                                                                resourceType: 'AWS::EC2::RouteTable'
                                                            },
                                                            parent: false,
                                                            costData:
                                                            {
                                                                totalCost: 0,
                                                                currency: 'USD',
                                                                startDate: '2019-12-20T20:06:30.234Z',
                                                                endDate: '1970-01-01T00:00:00.000Z'
                                                            }
                                                        }]
                                                }
                                            }
                                        }
                                    }
                                },
                                'Multiple Availability Zones':
                                {
                                    subnet:
                                    {
                                        undefined:
                                        {
                                            type:
                                            {
                                                NetworkAcl:
                                                {
                                                    nodes:
                                                        [{
                                                            id: '1f3bc4c2530bffe91f4006f69f4a480d',
                                                            perspectiveBirthDate: '2019-12-11T12:11:37.345Z',
                                                            label: 'AWS::EC2::NetworkAcl',
                                                            properties:
                                                            {
                                                                associations:
                                                                    '[{"networkAclAssociationId":"aclassoc-3553314b","networkAclId":"acl-6a24bb13","subnetId":"subnet-ea59c9b0"},{"networkAclAssociationId":"aclassoc-3453314a","networkAclId":"acl-6a24bb13","subnetId":"subnet-40fbdd08"},{"networkAclAssociationId":"aclassoc-37533149","networkAclId":"acl-6a24bb13","subnetId":"subnet-a20452c4"}]',
                                                                configurationItemStatus: 'ResourceDiscovered',
                                                                awsRegion: 'eu-west-1',
                                                                resourceId: 'acl-6a24bb13',
                                                                supplementaryConfiguration: '{}',
                                                                configuration:
                                                                    '{"associations":[{"networkAclAssociationId":"aclassoc-3553314b","networkAclId":"acl-6a24bb13","subnetId":"subnet-ea59c9b0"},{"networkAclAssociationId":"aclassoc-3453314a","networkAclId":"acl-6a24bb13","subnetId":"subnet-40fbdd08"},{"networkAclAssociationId":"aclassoc-37533149","networkAclId":"acl-6a24bb13","subnetId":"subnet-a20452c4"}],"entries":[{"cidrBlock":"0.0.0.0/0","egress":true,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"allow","ruleNumber":100},{"cidrBlock":"0.0.0.0/0","egress":true,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"deny","ruleNumber":32767},{"cidrBlock":"0.0.0.0/0","egress":false,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"allow","ruleNumber":100},{"cidrBlock":"0.0.0.0/0","egress":false,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"deny","ruleNumber":32767}],"isDefault":true,"networkAclId":"acl-6a24bb13","tags":[],"vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX"}',
                                                                configurationItemMD5Hash: '',
                                                                title: 'acl-6a24bb13',
                                                                availabilityZone: 'Multiple Availability Zones',
                                                                version: '1.3',
                                                                configurationItemCaptureTime: '2019-11-28T16:09:54.072Z',
                                                                tags: '{}',
                                                                loggedInURL:
                                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#acls:sort=networkAclId',
                                                                accountId: 'XXXXXXXXXXXX',
                                                                configurationStateId: 'XXXXXXXXXXXX',
                                                                isDefault: 'true',
                                                                perspectiveBirthDate: '2019-12-11T12:11:37.345Z',
                                                                loginURL:
                                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#acls:sort=networkAclId',
                                                                relatedEvents: '[]',
                                                                vpcId: 'vpc-88f114f1',
                                                                arn:
                                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-acl/acl-6a24bb13',
                                                                resourceType: 'AWS::EC2::NetworkAcl'
                                                            },
                                                            parent: false,
                                                            costData:
                                                            {
                                                                totalCost: 0,
                                                                currency: 'USD',
                                                                startDate: '2019-12-20T20:06:30.233Z',
                                                                endDate: '1970-01-01T00:00:00.000Z'
                                                            }
                                                        }]
                                                },
                                                InternetGateway:
                                                {
                                                    nodes:
                                                        [{
                                                            id: '13f5123897a5e89c750890a97a2ea3bd',
                                                            perspectiveBirthDate: '2019-12-11T12:11:44.559Z',
                                                            label: 'AWS::EC2::InternetGateway',
                                                            properties:
                                                            {
                                                                configurationItemStatus: 'ResourceDiscovered',
                                                                awsRegion: 'eu-west-1',
                                                                resourceId: 'igw-772c3a10',
                                                                supplementaryConfiguration: '{}',
                                                                configuration:
                                                                    '{"attachments":[{"state":"available","vpcId":"vpc-88f114f1"}],"internetGatewayId":"igw-772c3a10","ownerId":"XXXXXXXXXXXX","tags":[]}',
                                                                configurationItemMD5Hash: '',
                                                                title: 'igw-772c3a10',
                                                                version: '1.3',
                                                                configurationItemCaptureTime: '2019-11-28T16:09:53.830Z',
                                                                availabilityZone: 'Multiple Availability Zones',
                                                                loggedInURL:
                                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#igws:sort=internetGatewayId',
                                                                tags: '{}',
                                                                accountId: 'XXXXXXXXXXXX',
                                                                configurationStateId: '1574957393830',
                                                                perspectiveBirthDate: '2019-12-11T12:11:44.559Z',
                                                                loginURL:
                                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#igws:sort=internetGatewayId',
                                                                vpcId: 'vpc-88f114f1',
                                                                relatedEvents: '[]',
                                                                arn:
                                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:internet-gateway/igw-772c3a10',
                                                                resourceType: 'AWS::EC2::InternetGateway'
                                                            },
                                                            parent: false,
                                                            costData:
                                                            {
                                                                totalCost: 0,
                                                                currency: 'USD',
                                                                startDate: '2019-12-20T20:06:30.232Z',
                                                                endDate: '1970-01-01T00:00:00.000Z'
                                                            }
                                                        }]
                                                },
                                                VPC:
                                                {
                                                    nodes:
                                                        [{
                                                            id: 'b9d7a6f27482f7dbb97df1b7e792d346',
                                                            perspectiveBirthDate: '2019-12-12T21:11:21.992Z',
                                                            label: 'AWS::EC2::VPC',
                                                            properties:
                                                            {
                                                                configurationItemStatus: 'OK',
                                                                resourceId: 'vpc-88f114f1',
                                                                configuration:
                                                                    '{"cidrBlock":"172.31.0.0/16","dhcpOptionsId":"dopt-fdacf89b","state":"available","vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX","instanceTenancy":"default","ipv6CidrBlockAssociationSet":[],"cidrBlockAssociationSet":[{"associationId":"vpc-cidr-assoc-b57b76de","cidrBlock":"172.31.0.0/16","cidrBlockState":{"state":"associated","statusMessage":null}}],"isDefault":true,"tags":[]}',
                                                                title: 'vpc-88f114f1',
                                                                availabilityZone: 'Multiple Availability Zones',
                                                                loggedInURL:
                                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#vpcs:sort=VpcId',
                                                                perspectiveBirthDate: '2019-12-12T21:11:21.992Z',
                                                                loginURL:
                                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#vpcs:sort=VpcId',
                                                                vpcId: 'vpc-88f114f1',
                                                                relatedEvents: '[]',
                                                                state: '"available"',
                                                                arn: 'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:vpc/vpc-88f114f1',
                                                                instanceTenancy: 'default',
                                                                awsRegion: 'eu-west-1',
                                                                supplementaryConfiguration: '{}',
                                                                configurationItemMD5Hash: '',
                                                                cidrBlock: '172.31.0.0/16',
                                                                version: '1.3',
                                                                configurationItemCaptureTime: '2019-12-12T21:09:52.777Z',
                                                                tags: '{}',
                                                                accountId: 'XXXXXXXXXXXX',
                                                                configurationStateId: 'XXXXXXXXXXXX',
                                                                isDefault: 'true',
                                                                dhcpOptionsId: 'dopt-fdacf89b',
                                                                resourceType: 'AWS::EC2::VPC'
                                                            },
                                                            parent: true,
                                                            costData:
                                                            {
                                                                totalCost: 0,
                                                                currency: 'USD',
                                                                startDate: '2019-12-20T20:06:30.236Z',
                                                                endDate: '1970-01-01T00:00:00.000Z'
                                                            }
                                                        }]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

exports.vpcTransformBeforeFiltering = [{
    label: 'XXXXXXXXXXXX',
    type: 'account',
    children:
        [{
            label: 'eu-west-1',
            type: 'region',
            children:
                [{
                    label: 'vpc-88f114f1',
                    type: 'vpc',
                    children:
                        [{
                            label: 'RouteTable',
                            type: 'type',
                            children:
                                [{
                                    id: '14a7fa5949805ac5087476fc995fdb56',
                                    perspectiveBirthDate: '2019-12-11T12:11:44.844Z',
                                    label: 'AWS::EC2::RouteTable',
                                    properties:
                                    {
                                        associations:
                                            '[{"main":true,"routeTableAssociationId":"rtbassoc-8dc350f6","routeTableId":"rtb-55a6aa2c","subnetId":null}]',
                                        configurationItemStatus: 'ResourceDiscovered',
                                        awsRegion: 'eu-west-1',
                                        resourceId: 'rtb-55a6aa2c',
                                        supplementaryConfiguration: '{}',
                                        configuration:
                                            '{"associations":[{"main":true,"routeTableAssociationId":"rtbassoc-8dc350f6","routeTableId":"rtb-55a6aa2c","subnetId":null}],"propagatingVgws":[],"routeTableId":"rtb-55a6aa2c","routes":[{"destinationCidrBlock":"172.31.0.0/16","destinationIpv6CidrBlock":null,"destinationPrefixListId":null,"egressOnlyInternetGatewayId":null,"gatewayId":"local","instanceId":null,"instanceOwnerId":null,"natGatewayId":null,"transitGatewayId":null,"networkInterfaceId":null,"origin":"CreateRouteTable","state":"active","vpcPeeringConnectionId":null},{"destinationCidrBlock":"0.0.0.0/0","destinationIpv6CidrBlock":null,"destinationPrefixListId":null,"egressOnlyInternetGatewayId":null,"gatewayId":"igw-772c3a10","instanceId":null,"instanceOwnerId":null,"natGatewayId":null,"transitGatewayId":null,"networkInterfaceId":null,"origin":"CreateRoute","state":"active","vpcPeeringConnectionId":null}],"tags":[],"vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX"}',
                                        configurationItemMD5Hash: '',
                                        title: 'rtb-55a6aa2c',
                                        availabilityZone: 'Not Applicable',
                                        version: '1.3',
                                        configurationItemCaptureTime: '2019-11-28T16:09:53.380Z',
                                        tags: '{}',
                                        loggedInURL:
                                            'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#RouteTables:sort=routeTableId',
                                        accountId: 'XXXXXXXXXXXX',
                                        configurationStateId: '1574957393380',
                                        perspectiveBirthDate: '2019-12-11T12:11:44.844Z',
                                        loginURL:
                                            'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#RouteTables:sort=routeTableId',
                                        relatedEvents: '[]',
                                        vpcId: 'vpc-88f114f1',
                                        arn:
                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:route-table/rtb-55a6aa2c',
                                        resourceType: 'AWS::EC2::RouteTable'
                                    },
                                    parent: false,
                                    costData:
                                    {
                                        totalCost: 0,
                                        currency: 'USD',
                                        startDate: '2019-12-20T20:06:30.234Z',
                                        endDate: '1970-01-01T00:00:00.000Z'
                                    },
                                    type: 'node'
                                }]
                        },
                        {
                            label: 'Multiple Availability Zones',
                            type: 'availabilityZone',
                            children:
                                [{
                                    label: 'NetworkAcl',
                                    type: 'type',
                                    children:
                                        [{
                                            id: '1f3bc4c2530bffe91f4006f69f4a480d',
                                            perspectiveBirthDate: '2019-12-11T12:11:37.345Z',
                                            label: 'AWS::EC2::NetworkAcl',
                                            properties:
                                            {
                                                associations:
                                                    '[{"networkAclAssociationId":"aclassoc-3553314b","networkAclId":"acl-6a24bb13","subnetId":"subnet-ea59c9b0"},{"networkAclAssociationId":"aclassoc-3453314a","networkAclId":"acl-6a24bb13","subnetId":"subnet-40fbdd08"},{"networkAclAssociationId":"aclassoc-37533149","networkAclId":"acl-6a24bb13","subnetId":"subnet-a20452c4"}]',
                                                configurationItemStatus: 'ResourceDiscovered',
                                                awsRegion: 'eu-west-1',
                                                resourceId: 'acl-6a24bb13',
                                                supplementaryConfiguration: '{}',
                                                configuration:
                                                    '{"associations":[{"networkAclAssociationId":"aclassoc-3553314b","networkAclId":"acl-6a24bb13","subnetId":"subnet-ea59c9b0"},{"networkAclAssociationId":"aclassoc-3453314a","networkAclId":"acl-6a24bb13","subnetId":"subnet-40fbdd08"},{"networkAclAssociationId":"aclassoc-37533149","networkAclId":"acl-6a24bb13","subnetId":"subnet-a20452c4"}],"entries":[{"cidrBlock":"0.0.0.0/0","egress":true,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"allow","ruleNumber":100},{"cidrBlock":"0.0.0.0/0","egress":true,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"deny","ruleNumber":32767},{"cidrBlock":"0.0.0.0/0","egress":false,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"allow","ruleNumber":100},{"cidrBlock":"0.0.0.0/0","egress":false,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"deny","ruleNumber":32767}],"isDefault":true,"networkAclId":"acl-6a24bb13","tags":[],"vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX"}',
                                                configurationItemMD5Hash: '',
                                                title: 'acl-6a24bb13',
                                                availabilityZone: 'Multiple Availability Zones',
                                                version: '1.3',
                                                configurationItemCaptureTime: '2019-11-28T16:09:54.072Z',
                                                tags: '{}',
                                                loggedInURL:
                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#acls:sort=networkAclId',
                                                accountId: 'XXXXXXXXXXXX',
                                                configurationStateId: 'XXXXXXXXXXXX',
                                                isDefault: 'true',
                                                perspectiveBirthDate: '2019-12-11T12:11:37.345Z',
                                                loginURL:
                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#acls:sort=networkAclId',
                                                relatedEvents: '[]',
                                                vpcId: 'vpc-88f114f1',
                                                arn:
                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-acl/acl-6a24bb13',
                                                resourceType: 'AWS::EC2::NetworkAcl'
                                            },
                                            parent: false,
                                            costData:
                                            {
                                                totalCost: 0,
                                                currency: 'USD',
                                                startDate: '2019-12-20T20:06:30.233Z',
                                                endDate: '1970-01-01T00:00:00.000Z'
                                            },
                                            type: 'node'
                                        }]
                                },
                                {
                                    label: 'InternetGateway',
                                    type: 'type',
                                    children:
                                        [{
                                            id: '13f5123897a5e89c750890a97a2ea3bd',
                                            perspectiveBirthDate: '2019-12-11T12:11:44.559Z',
                                            label: 'AWS::EC2::InternetGateway',
                                            properties:
                                            {
                                                configurationItemStatus: 'ResourceDiscovered',
                                                awsRegion: 'eu-west-1',
                                                resourceId: 'igw-772c3a10',
                                                supplementaryConfiguration: '{}',
                                                configuration:
                                                    '{"attachments":[{"state":"available","vpcId":"vpc-88f114f1"}],"internetGatewayId":"igw-772c3a10","ownerId":"XXXXXXXXXXXX","tags":[]}',
                                                configurationItemMD5Hash: '',
                                                title: 'igw-772c3a10',
                                                version: '1.3',
                                                configurationItemCaptureTime: '2019-11-28T16:09:53.830Z',
                                                availabilityZone: 'Multiple Availability Zones',
                                                loggedInURL:
                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#igws:sort=internetGatewayId',
                                                tags: '{}',
                                                accountId: 'XXXXXXXXXXXX',
                                                configurationStateId: '1574957393830',
                                                perspectiveBirthDate: '2019-12-11T12:11:44.559Z',
                                                loginURL:
                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#igws:sort=internetGatewayId',
                                                vpcId: 'vpc-88f114f1',
                                                relatedEvents: '[]',
                                                arn:
                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:internet-gateway/igw-772c3a10',
                                                resourceType: 'AWS::EC2::InternetGateway'
                                            },
                                            parent: false,
                                            costData:
                                            {
                                                totalCost: 0,
                                                currency: 'USD',
                                                startDate: '2019-12-20T20:06:30.232Z',
                                                endDate: '1970-01-01T00:00:00.000Z'
                                            },
                                            type: 'node'
                                        }]
                                },
                                {
                                    label: 'VPC',
                                    type: 'type',
                                    children:
                                        [{
                                            id: 'b9d7a6f27482f7dbb97df1b7e792d346',
                                            perspectiveBirthDate: '2019-12-12T21:11:21.992Z',
                                            label: 'AWS::EC2::VPC',
                                            properties:
                                            {
                                                configurationItemStatus: 'OK',
                                                resourceId: 'vpc-88f114f1',
                                                configuration:
                                                    '{"cidrBlock":"172.31.0.0/16","dhcpOptionsId":"dopt-fdacf89b","state":"available","vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX","instanceTenancy":"default","ipv6CidrBlockAssociationSet":[],"cidrBlockAssociationSet":[{"associationId":"vpc-cidr-assoc-b57b76de","cidrBlock":"172.31.0.0/16","cidrBlockState":{"state":"associated","statusMessage":null}}],"isDefault":true,"tags":[]}',
                                                title: 'vpc-88f114f1',
                                                availabilityZone: 'Multiple Availability Zones',
                                                loggedInURL:
                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#vpcs:sort=VpcId',
                                                perspectiveBirthDate: '2019-12-12T21:11:21.992Z',
                                                loginURL:
                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#vpcs:sort=VpcId',
                                                vpcId: 'vpc-88f114f1',
                                                relatedEvents: '[]',
                                                state: '"available"',
                                                arn: 'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:vpc/vpc-88f114f1',
                                                instanceTenancy: 'default',
                                                awsRegion: 'eu-west-1',
                                                supplementaryConfiguration: '{}',
                                                configurationItemMD5Hash: '',
                                                cidrBlock: '172.31.0.0/16',
                                                version: '1.3',
                                                configurationItemCaptureTime: '2019-12-12T21:09:52.777Z',
                                                tags: '{}',
                                                accountId: 'XXXXXXXXXXXX',
                                                configurationStateId: 'XXXXXXXXXXXX',
                                                isDefault: 'true',
                                                dhcpOptionsId: 'dopt-fdacf89b',
                                                resourceType: 'AWS::EC2::VPC'
                                            },
                                            parent: true,
                                            costData:
                                            {
                                                totalCost: 0,
                                                currency: 'USD',
                                                startDate: '2019-12-20T20:06:30.236Z',
                                                endDate: '1970-01-01T00:00:00.000Z'
                                            },
                                            type: 'node'
                                        }]
                                }]
                        }],
                    data:
                    {
                        properties:
                        {
                            configurationItemStatus: 'OK',
                            resourceId: 'vpc-88f114f1',
                            configuration:
                                '{"cidrBlock":"172.31.0.0/16","dhcpOptionsId":"dopt-fdacf89b","state":"available","vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX","instanceTenancy":"default","ipv6CidrBlockAssociationSet":[],"cidrBlockAssociationSet":[{"associationId":"vpc-cidr-assoc-b57b76de","cidrBlock":"172.31.0.0/16","cidrBlockState":{"state":"associated","statusMessage":null}}],"isDefault":true,"tags":[]}',
                            title: 'vpc-88f114f1',
                            availabilityZone: 'Multiple Availability Zones',
                            loggedInURL:
                                'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#vpcs:sort=VpcId',
                            loginURL:
                                'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#vpcs:sort=VpcId',
                            vpcId: 'vpc-88f114f1',
                            relatedEvents: '[]',
                            state: '"available"',
                            arn: 'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:vpc/vpc-88f114f1',
                            instanceTenancy: 'default',
                            awsRegion: 'eu-west-1',
                            supplementaryConfiguration: '{}',
                            configurationItemMD5Hash: '',
                            cidrBlock: '172.31.0.0/16',
                            version: '1.3',
                            configurationItemCaptureTime: '2019-12-12T21:09:52.777Z',
                            tags: '{}',
                            accountId: 'XXXXXXXXXXXX',
                            configurationStateId: 'XXXXXXXXXXXX',
                            isDefault: 'true',
                            dhcpOptionsId: 'dopt-fdacf89b',
                            resourceType: 'AWS::EC2::VPC'
                        },
                        perspectiveBirthDate: '2019-12-12T21:11:21.992Z',
                        id: 'b9d7a6f27482f7dbb97df1b7e792d346',
                        label: 'AWS::EC2::VPC'
                    },
                    id: 'b9d7a6f27482f7dbb97df1b7e792d346'
                }]
        }]
}];

exports.vpcAfterFiltering = [{
    label: 'XXXXXXXXXXXX',
    type: 'account',
    children:
        [{
            label: 'eu-west-1',
            type: 'region',
            children:
                [{
                    label: 'vpc-88f114f1',
                    type: 'vpc',
                    id: 'b9d7a6f27482f7dbb97df1b7e792d346',
                    data:
                    {
                        properties:
                        {
                            configurationItemStatus: 'OK',
                            resourceId: 'vpc-88f114f1',
                            configuration:
                                '{"cidrBlock":"172.31.0.0/16","dhcpOptionsId":"dopt-fdacf89b","state":"available","vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX","instanceTenancy":"default","ipv6CidrBlockAssociationSet":[],"cidrBlockAssociationSet":[{"associationId":"vpc-cidr-assoc-b57b76de","cidrBlock":"172.31.0.0/16","cidrBlockState":{"state":"associated","statusMessage":null}}],"isDefault":true,"tags":[]}',
                            title: 'vpc-88f114f1',
                            availabilityZone: 'Multiple Availability Zones',
                            loggedInURL:
                                'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#vpcs:sort=VpcId',
                            loginURL:
                                'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#vpcs:sort=VpcId',
                            vpcId: 'vpc-88f114f1',
                            relatedEvents: '[]',
                            state: '"available"',
                            arn: 'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:vpc/vpc-88f114f1',
                            instanceTenancy: 'default',
                            awsRegion: 'eu-west-1',
                            supplementaryConfiguration: '{}',
                            configurationItemMD5Hash: '',
                            cidrBlock: '172.31.0.0/16',
                            version: '1.3',
                            configurationItemCaptureTime: '2019-12-12T21:09:52.777Z',
                            tags: '{}',
                            accountId: 'XXXXXXXXXXXX',
                            configurationStateId: 'XXXXXXXXXXXX',
                            isDefault: 'true',
                            dhcpOptionsId: 'dopt-fdacf89b',
                            resourceType: 'AWS::EC2::VPC'
                        },
                        perspectiveBirthDate: '2019-12-12T21:11:21.992Z',
                        id: 'b9d7a6f27482f7dbb97df1b7e792d346',
                        label: 'AWS::EC2::VPC'
                    },
                    children:
                        [{
                            label: 'RouteTable',
                            type: 'type',
                            children:
                                [{
                                    id: '14a7fa5949805ac5087476fc995fdb56',
                                    perspectiveBirthDate: '2019-12-11T12:11:44.844Z',
                                    label: 'AWS::EC2::RouteTable',
                                    properties:
                                    {
                                        associations:
                                            '[{"main":true,"routeTableAssociationId":"rtbassoc-8dc350f6","routeTableId":"rtb-55a6aa2c","subnetId":null}]',
                                        configurationItemStatus: 'ResourceDiscovered',
                                        awsRegion: 'eu-west-1',
                                        resourceId: 'rtb-55a6aa2c',
                                        supplementaryConfiguration: '{}',
                                        configuration:
                                            '{"associations":[{"main":true,"routeTableAssociationId":"rtbassoc-8dc350f6","routeTableId":"rtb-55a6aa2c","subnetId":null}],"propagatingVgws":[],"routeTableId":"rtb-55a6aa2c","routes":[{"destinationCidrBlock":"172.31.0.0/16","destinationIpv6CidrBlock":null,"destinationPrefixListId":null,"egressOnlyInternetGatewayId":null,"gatewayId":"local","instanceId":null,"instanceOwnerId":null,"natGatewayId":null,"transitGatewayId":null,"networkInterfaceId":null,"origin":"CreateRouteTable","state":"active","vpcPeeringConnectionId":null},{"destinationCidrBlock":"0.0.0.0/0","destinationIpv6CidrBlock":null,"destinationPrefixListId":null,"egressOnlyInternetGatewayId":null,"gatewayId":"igw-772c3a10","instanceId":null,"instanceOwnerId":null,"natGatewayId":null,"transitGatewayId":null,"networkInterfaceId":null,"origin":"CreateRoute","state":"active","vpcPeeringConnectionId":null}],"tags":[],"vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX"}',
                                        configurationItemMD5Hash: '',
                                        title: 'rtb-55a6aa2c',
                                        availabilityZone: 'Not Applicable',
                                        version: '1.3',
                                        configurationItemCaptureTime: '2019-11-28T16:09:53.380Z',
                                        tags: '{}',
                                        loggedInURL:
                                            'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#RouteTables:sort=routeTableId',
                                        accountId: 'XXXXXXXXXXXX',
                                        configurationStateId: '1574957393380',
                                        perspectiveBirthDate: '2019-12-11T12:11:44.844Z',
                                        loginURL:
                                            'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#RouteTables:sort=routeTableId',
                                        relatedEvents: '[]',
                                        vpcId: 'vpc-88f114f1',
                                        arn:
                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:route-table/rtb-55a6aa2c',
                                        resourceType: 'AWS::EC2::RouteTable'
                                    },
                                    parent: false,
                                    costData:
                                    {
                                        totalCost: 0,
                                        currency: 'USD',
                                        startDate: '2019-12-20T20:06:30.234Z',
                                        endDate: '1970-01-01T00:00:00.000Z'
                                    },
                                    type: 'node'
                                }]
                        },
                        {
                            label: 'Multiple Availability Zones',
                            type: 'availabilityZone',
                            children:
                                [{
                                    label: 'NetworkAcl',
                                    type: 'type',
                                    children:
                                        [{
                                            id: '1f3bc4c2530bffe91f4006f69f4a480d',
                                            perspectiveBirthDate: '2019-12-11T12:11:37.345Z',
                                            label: 'AWS::EC2::NetworkAcl',
                                            properties:
                                            {
                                                associations:
                                                    '[{"networkAclAssociationId":"aclassoc-3553314b","networkAclId":"acl-6a24bb13","subnetId":"subnet-ea59c9b0"},{"networkAclAssociationId":"aclassoc-3453314a","networkAclId":"acl-6a24bb13","subnetId":"subnet-40fbdd08"},{"networkAclAssociationId":"aclassoc-37533149","networkAclId":"acl-6a24bb13","subnetId":"subnet-a20452c4"}]',
                                                configurationItemStatus: 'ResourceDiscovered',
                                                awsRegion: 'eu-west-1',
                                                resourceId: 'acl-6a24bb13',
                                                supplementaryConfiguration: '{}',
                                                configuration:
                                                    '{"associations":[{"networkAclAssociationId":"aclassoc-3553314b","networkAclId":"acl-6a24bb13","subnetId":"subnet-ea59c9b0"},{"networkAclAssociationId":"aclassoc-3453314a","networkAclId":"acl-6a24bb13","subnetId":"subnet-40fbdd08"},{"networkAclAssociationId":"aclassoc-37533149","networkAclId":"acl-6a24bb13","subnetId":"subnet-a20452c4"}],"entries":[{"cidrBlock":"0.0.0.0/0","egress":true,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"allow","ruleNumber":100},{"cidrBlock":"0.0.0.0/0","egress":true,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"deny","ruleNumber":32767},{"cidrBlock":"0.0.0.0/0","egress":false,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"allow","ruleNumber":100},{"cidrBlock":"0.0.0.0/0","egress":false,"icmpTypeCode":null,"ipv6CidrBlock":null,"portRange":null,"protocol":"-1","ruleAction":"deny","ruleNumber":32767}],"isDefault":true,"networkAclId":"acl-6a24bb13","tags":[],"vpcId":"vpc-88f114f1","ownerId":"XXXXXXXXXXXX"}',
                                                configurationItemMD5Hash: '',
                                                title: 'acl-6a24bb13',
                                                availabilityZone: 'Multiple Availability Zones',
                                                version: '1.3',
                                                configurationItemCaptureTime: '2019-11-28T16:09:54.072Z',
                                                tags: '{}',
                                                loggedInURL:
                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#acls:sort=networkAclId',
                                                accountId: 'XXXXXXXXXXXX',
                                                configurationStateId: 'XXXXXXXXXXXX',
                                                isDefault: 'true',
                                                perspectiveBirthDate: '2019-12-11T12:11:37.345Z',
                                                loginURL:
                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#acls:sort=networkAclId',
                                                relatedEvents: '[]',
                                                vpcId: 'vpc-88f114f1',
                                                arn:
                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-acl/acl-6a24bb13',
                                                resourceType: 'AWS::EC2::NetworkAcl'
                                            },
                                            parent: false,
                                            costData:
                                            {
                                                totalCost: 0,
                                                currency: 'USD',
                                                startDate: '2019-12-20T20:06:30.233Z',
                                                endDate: '1970-01-01T00:00:00.000Z'
                                            },
                                            type: 'node'
                                        }]
                                },
                                {
                                    label: 'InternetGateway',
                                    type: 'type',
                                    children:
                                        [{
                                            id: '13f5123897a5e89c750890a97a2ea3bd',
                                            perspectiveBirthDate: '2019-12-11T12:11:44.559Z',
                                            label: 'AWS::EC2::InternetGateway',
                                            properties:
                                            {
                                                configurationItemStatus: 'ResourceDiscovered',
                                                awsRegion: 'eu-west-1',
                                                resourceId: 'igw-772c3a10',
                                                supplementaryConfiguration: '{}',
                                                configuration:
                                                    '{"attachments":[{"state":"available","vpcId":"vpc-88f114f1"}],"internetGatewayId":"igw-772c3a10","ownerId":"XXXXXXXXXXXX","tags":[]}',
                                                configurationItemMD5Hash: '',
                                                title: 'igw-772c3a10',
                                                version: '1.3',
                                                configurationItemCaptureTime: '2019-11-28T16:09:53.830Z',
                                                availabilityZone: 'Multiple Availability Zones',
                                                loggedInURL:
                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#igws:sort=internetGatewayId',
                                                tags: '{}',
                                                accountId: 'XXXXXXXXXXXX',
                                                configurationStateId: '1574957393830',
                                                perspectiveBirthDate: '2019-12-11T12:11:44.559Z',
                                                loginURL:
                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#igws:sort=internetGatewayId',
                                                vpcId: 'vpc-88f114f1',
                                                relatedEvents: '[]',
                                                arn:
                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:internet-gateway/igw-772c3a10',
                                                resourceType: 'AWS::EC2::InternetGateway'
                                            },
                                            parent: false,
                                            costData:
                                            {
                                                totalCost: 0,
                                                currency: 'USD',
                                                startDate: '2019-12-20T20:06:30.232Z',
                                                endDate: '1970-01-01T00:00:00.000Z'
                                            },
                                            type: 'node'
                                        }]
                                }]
                        }]
                }]
        }]
}];

