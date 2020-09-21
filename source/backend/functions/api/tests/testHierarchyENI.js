exports.eniInput = [
    {
        "id": "8e89e7574d4e2b66938945e24a589acd",
        "perspectiveBirthDate": "2020-01-08T13:48:53.216Z",
        "label": "AWS::EC2::NatGateway",
        "properties": {
            "subnetId": "subnet-0f690256efabe0adb",
            "configurationItemStatus": "ResourceDiscovered",
            "awsRegion": "eu-west-1",
            "resourceId": "nat-0e2d1d2e0105bc3d7",
            "supplementaryConfiguration": "{}",
            "configuration": "{\"createTime\":1574957356000,\"natGatewayAddresses\":[{\"allocationId\":\"eipalloc-00bc44f79cddefb85\",\"networkInterfaceId\":\"eni-0e34557f68aaf3800\",\"privateIp\":\"10.0.1.55\",\"publicIp\":\"34.251.252.207\"}],\"natGatewayId\":\"nat-0e2d1d2e0105bc3d7\",\"state\":\"available\",\"subnetId\":\"subnet-0f690256efabe0adb\",\"vpcId\":\"vpc-0d1489acdc666462d\",\"tags\":[{\"key\":\"aws:cloudformation:stack-name\",\"value\":\"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X\"},{\"key\":\"aws:cloudformation:logical-id\",\"value\":\"NATGateway0\"},{\"key\":\"aws:cloudformation:stack-id\",\"value\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8\"},{\"key\":\"AppName\",\"value\":\"aws-perspective\"}]}",
            "configurationItemMD5Hash": "",
            "title": "nat-0e2d1d2e0105bc3d7",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-11-28T16:26:33.432Z",
            "availabilityZone": "Not Applicable",
            "tags": "{\"AppName\":\"aws-perspective\",\"aws:cloudformation:logical-id\":\"NATGateway0\",\"aws:cloudformation:stack-id\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8\",\"aws:cloudformation:stack-name\":\"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X\"}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1574958393432",
            "perspectiveBirthDate": "2020-01-08T13:48:53.216Z",
            "vpcId": "vpc-0d1489acdc666462d",
            "relatedEvents": "[]",
            "state": "\"available\"",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:natgateway/nat-0e2d1d2e0105bc3d7",
            "resourceCreationTime": "2019-11-28T16:09:16.000Z",
            "resourceType": "AWS::EC2::NatGateway"
        },
        "parent": false,
        "costData": {
            "totalCost": 2.9853008132000007,
            "currency": "USD",
            "startDate": "2020-01-02T00:00:00.000Z",
            "endDate": "2020-01-08T05:00:00.000Z"
        }
    },
    {
        "id": "976f39d5445f84df7c64b58ca1f1caf7",
        "perspectiveBirthDate": "2020-01-08T13:41:30.627Z",
        "label": "AWS::EC2::Subnet",
        "properties": {
            "subnetId": "subnet-0f690256efabe0adb",
            "configurationItemStatus": "OK",
            "resourceId": "subnet-0f690256efabe0adb",
            "configuration": "{\"availabilityZone\":\"eu-west-1a\",\"availabilityZoneId\":\"euw1-az3\",\"availableIpAddressCount\":248,\"cidrBlock\":\"10.0.1.0/24\",\"defaultForAz\":false,\"mapPublicIpOnLaunch\":true,\"state\":\"available\",\"subnetId\":\"subnet-0f690256efabe0adb\",\"vpcId\":\"vpc-0d1489acdc666462d\",\"ownerId\":\"XXXXXXXXXXXX\",\"assignIpv6AddressOnCreation\":false,\"ipv6CidrBlockAssociationSet\":[],\"tags\":[{\"key\":\"AppName\",\"value\":\"aws-perspective\"},{\"key\":\"Name\",\"value\":\"vpc-0d1489acdc666462d-public-a\"},{\"key\":\"aws:cloudformation:stack-id\",\"value\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8\"},{\"key\":\"aws:cloudformation:stack-name\",\"value\":\"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X\"},{\"key\":\"Network\",\"value\":\"Public\"},{\"key\":\"Application\",\"value\":\"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X\"},{\"key\":\"aws:cloudformation:logical-id\",\"value\":\"PublicSubnet0\"}],\"subnetArn\":\"arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb\",\"outpostArn\":null}",
            "title": "subnet-0f690256efabe0adb",
            "assignIpv6AddressOnCreation": "false",
            "availabilityZone": "eu-west-1a",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#subnets:sort=SubnetId",
            "perspectiveBirthDate": "2020-01-08T13:41:30.627Z",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#subnets:sort=SubnetId",
            "vpcId": "vpc-0d1489acdc666462d",
            "relatedEvents": "[]",
            "state": "\"available\"",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb",
            "awsRegion": "eu-west-1",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "cidrBlock": "10.0.1.0/24",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-12-02T21:09:52.586Z",
            "tags": "{\"AppName\":\"aws-perspective\",\"Application\":\"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X\",\"Name\":\"vpc-0d1489acdc666462d-public-a\",\"Network\":\"Public\",\"aws:cloudformation:logical-id\":\"PublicSubnet0\",\"aws:cloudformation:stack-id\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8\",\"aws:cloudformation:stack-name\":\"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X\"}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1575320992586",
            "availableIpAddressCount": "248",
            "mapPublicIpOnLaunch": "true",
            "defaultForAz": "false",
            "resourceType": "AWS::EC2::Subnet"
        },
        "parent": false,
        "costData": {
            "totalCost": 0,
            "currency": "USD",
            "startDate": "2020-01-09T09:52:16.881Z",
            "endDate": "1970-01-01T00:00:00.000Z"
        }
    },
    {
        "id": "6e1d1d816abbe53b44695dd46b479d81",
        "perspectiveBirthDate": "2020-01-08T13:50:18.632Z",
        "label": "AWS::EC2::EIP",
        "properties": {
            "configurationItemStatus": "OK",
            "resourceId": "eipalloc-00bc44f79cddefb85",
            "configuration": "{\"instanceId\":null,\"publicIp\":\"34.251.252.207\",\"allocationId\":\"eipalloc-00bc44f79cddefb85\",\"associationId\":\"eipassoc-03fb2f16ebde1ff58\",\"domain\":\"vpc\",\"networkInterfaceId\":\"eni-0e34557f68aaf3800\",\"networkInterfaceOwnerId\":\"XXXXXXXXXXXX\",\"privateIpAddress\":\"10.0.1.55\",\"tags\":[{\"key\":\"aws:cloudformation:stack-id\",\"value\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8\"},{\"key\":\"aws:cloudformation:logical-id\",\"value\":\"ElasticIP0\"},{\"key\":\"AppName\",\"value\":\"aws-perspective\"},{\"key\":\"aws:cloudformation:stack-name\",\"value\":\"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X\"}],\"publicIpv4Pool\":\"amazon\",\"networkBorderGroup\":null,\"customerOwnedIp\":null,\"customerOwnedIpv4Pool\":null}",
            "title": "eipalloc-00bc44f79cddefb85",
            "availabilityZone": "Not Applicable",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Addresses:sort=PublicIp",
            "instanceId": "null",
            "perspectiveBirthDate": "2020-01-08T13:50:18.632Z",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Addresses:sort=PublicIp",
            "relatedEvents": "[]",
            "vpcId": "vpc-0d1489acdc666462d",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:eip-allocation/eipalloc-00bc44f79cddefb85",
            "networkInterfaceId": "eni-0e34557f68aaf3800",
            "awsRegion": "eu-west-1",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "resourceName": "34.251.252.207",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-11-28T16:26:36.451Z",
            "privateIpAddress": "10.0.1.55",
            "tags": "{\"AppName\":\"aws-perspective\",\"aws:cloudformation:logical-id\":\"ElasticIP0\",\"aws:cloudformation:stack-id\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8\",\"aws:cloudformation:stack-name\":\"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X\"}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1574958396451",
            "resourceType": "AWS::EC2::EIP"
        },
        "parent": false,
        "costData": {
            "totalCost": 0,
            "currency": "USD",
            "startDate": "2020-01-09T09:52:16.899Z",
            "endDate": "1970-01-01T00:00:00.000Z"
        }
    },
    {
        "id": "cd728a5a4ba3a12008a97e437387310c",
        "perspectiveBirthDate": "2020-01-08T13:44:46.712Z",
        "label": "AWS::EC2::NetworkInterface",
        "properties": {
            "subnetId": "subnet-0f690256efabe0adb",
            "configurationItemStatus": "OK",
            "resourceId": "eni-0e34557f68aaf3800",
            "configuration": "{\"association\":{\"allocationId\":\"eipalloc-00bc44f79cddefb85\",\"associationId\":\"eipassoc-03fb2f16ebde1ff58\",\"ipOwnerId\":\"XXXXXXXXXXXX\",\"publicDnsName\":\"ec2-34-251-252-207.eu-west-1.compute.amazonaws.com\",\"publicIp\":\"34.251.252.207\"},\"attachment\":{\"attachTime\":null,\"attachmentId\":\"ela-attach-b295a48f\",\"deleteOnTermination\":false,\"deviceIndex\":1,\"instanceId\":null,\"instanceOwnerId\":\"amazon-aws\",\"status\":\"attached\"},\"availabilityZone\":\"eu-west-1a\",\"description\":\"Interface for NAT Gateway nat-0e2d1d2e0105bc3d7\",\"groups\":[],\"interfaceType\":\"nat_gateway\",\"ipv6Addresses\":[],\"macAddress\":\"0a:cb:41:33:fe:8c\",\"networkInterfaceId\":\"eni-0e34557f68aaf3800\",\"outpostArn\":null,\"ownerId\":\"XXXXXXXXXXXX\",\"privateDnsName\":\"ip-10-0-1-55.eu-west-1.compute.internal\",\"privateIpAddress\":\"10.0.1.55\",\"privateIpAddresses\":[{\"association\":{\"allocationId\":\"eipalloc-00bc44f79cddefb85\",\"associationId\":\"eipassoc-03fb2f16ebde1ff58\",\"ipOwnerId\":\"XXXXXXXXXXXX\",\"publicDnsName\":\"ec2-34-251-252-207.eu-west-1.compute.amazonaws.com\",\"publicIp\":\"34.251.252.207\"},\"primary\":true,\"privateDnsName\":\"ip-10-0-1-55.eu-west-1.compute.internal\",\"privateIpAddress\":\"10.0.1.55\"}],\"requesterId\":\"036872051663\",\"requesterManaged\":true,\"sourceDestCheck\":false,\"status\":\"in-use\",\"subnetId\":\"subnet-0f690256efabe0adb\",\"tagSet\":[],\"vpcId\":\"vpc-0d1489acdc666462d\"}",
            "description": "Interface for NAT Gateway nat-0e2d1d2e0105bc3d7",
            "sourceDestCheck": "false",
            "title": "eni-0e34557f68aaf3800",
            "availabilityZone": "eu-west-1a",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#NIC:sort=description",
            "interfaceType": "nat_gateway",
            "perspectiveBirthDate": "2020-01-08T13:44:46.712Z",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#NIC:sort=description",
            "vpcId": "vpc-0d1489acdc666462d",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-interface/eni-0e34557f68aaf3800",
            "networkInterfaceId": "eni-0e34557f68aaf3800",
            "awsRegion": "eu-west-1",
            "requesterId": "036872051663",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "requesterManaged": "true",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-11-28T16:26:36.603Z",
            "privateIpAddress": "10.0.1.55",
            "tags": "{}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1574958396603",
            "macAddress": "0a:cb:41:33:fe:8c",
            "privateDnsName": "ip-10-0-1-55.eu-west-1.compute.internal",
            "status": "in-use",
            "resourceType": "AWS::EC2::NetworkInterface"
        },
        "parent": true,
        "costData": {
            "totalCost": 0,
            "currency": "USD",
            "startDate": "2020-01-09T09:52:16.917Z",
            "endDate": "1970-01-01T00:00:00.000Z"
        }
    }
];

exports.eniHierarchy =
{
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
                        'vpc-0d1489acdc666462d':
                        {
                            availabilityZone:
                            {
                                'eu-west-1a':
                                {
                                    subnet:
                                    {
                                        'subnet-0f690256efabe0adb':
                                        {
                                            type:
                                            {
                                                NatGateway:
                                                {
                                                    nodes:
                                                        [{
                                                            id: '8e89e7574d4e2b66938945e24a589acd',
                                                            perspectiveBirthDate: '2020-01-08T13:48:53.216Z',
                                                            label: 'AWS::EC2::NatGateway',
                                                            properties:
                                                            {
                                                                subnetId: 'subnet-0f690256efabe0adb',
                                                                configurationItemStatus: 'ResourceDiscovered',
                                                                awsRegion: 'eu-west-1',
                                                                resourceId: 'nat-0e2d1d2e0105bc3d7',
                                                                supplementaryConfiguration: '{}',
                                                                configuration:
                                                                    '{"createTime":1574957356000,"natGatewayAddresses":[{"allocationId":"eipalloc-00bc44f79cddefb85","networkInterfaceId":"eni-0e34557f68aaf3800","privateIp":"10.0.1.55","publicIp":"34.251.252.207"}],"natGatewayId":"nat-0e2d1d2e0105bc3d7","state":"available","subnetId":"subnet-0f690256efabe0adb","vpcId":"vpc-0d1489acdc666462d","tags":[{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"NATGateway0"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"AppName","value":"aws-perspective"}]}',
                                                                configurationItemMD5Hash: '',
                                                                title: 'nat-0e2d1d2e0105bc3d7',
                                                                version: '1.3',
                                                                configurationItemCaptureTime: '2019-11-28T16:26:33.432Z',
                                                                availabilityZone: 'Not Applicable',
                                                                tags:
                                                                    '{"AppName":"aws-perspective","aws:cloudformation:logical-id":"NATGateway0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                                                accountId: 'XXXXXXXXXXXX',
                                                                configurationStateId: '1574958393432',
                                                                perspectiveBirthDate: '2020-01-08T13:48:53.216Z',
                                                                vpcId: 'vpc-0d1489acdc666462d',
                                                                relatedEvents: '[]',
                                                                state: '"available"',
                                                                arn:
                                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:natgateway/nat-0e2d1d2e0105bc3d7',
                                                                resourceCreationTime: '2019-11-28T16:09:16.000Z',
                                                                resourceType: 'AWS::EC2::NatGateway'
                                                            },
                                                            parent: false,
                                                            costData:
                                                            {
                                                                totalCost: 2.9853008132000007,
                                                                currency: 'USD',
                                                                startDate: '2020-01-02T00:00:00.000Z',
                                                                endDate: '2020-01-08T05:00:00.000Z'
                                                            }
                                                        }]
                                                },
                                                Subnet:
                                                {
                                                    nodes:
                                                        [{
                                                            id: '976f39d5445f84df7c64b58ca1f1caf7',
                                                            perspectiveBirthDate: '2020-01-08T13:41:30.627Z',
                                                            label: 'AWS::EC2::Subnet',
                                                            properties:
                                                            {
                                                                subnetId: 'subnet-0f690256efabe0adb',
                                                                configurationItemStatus: 'OK',
                                                                resourceId: 'subnet-0f690256efabe0adb',
                                                                configuration:
                                                                    '{"availabilityZone":"eu-west-1a","availabilityZoneId":"euw1-az3","availableIpAddressCount":248,"cidrBlock":"10.0.1.0/24","defaultForAz":false,"mapPublicIpOnLaunch":true,"state":"available","subnetId":"subnet-0f690256efabe0adb","vpcId":"vpc-0d1489acdc666462d","ownerId":"XXXXXXXXXXXX","assignIpv6AddressOnCreation":false,"ipv6CidrBlockAssociationSet":[],"tags":[{"key":"AppName","value":"aws-perspective"},{"key":"Name","value":"vpc-0d1489acdc666462d-public-a"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"Network","value":"Public"},{"key":"Application","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"PublicSubnet0"}],"subnetArn":"arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb","outpostArn":null}',
                                                                title: 'subnet-0f690256efabe0adb',
                                                                assignIpv6AddressOnCreation: 'false',
                                                                availabilityZone: 'eu-west-1a',
                                                                loggedInURL:
                                                                    'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#subnets:sort=SubnetId',
                                                                perspectiveBirthDate: '2020-01-08T13:41:30.627Z',
                                                                loginURL:
                                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#subnets:sort=SubnetId',
                                                                vpcId: 'vpc-0d1489acdc666462d',
                                                                relatedEvents: '[]',
                                                                state: '"available"',
                                                                arn:
                                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb',
                                                                awsRegion: 'eu-west-1',
                                                                supplementaryConfiguration: '{}',
                                                                configurationItemMD5Hash: '',
                                                                cidrBlock: '10.0.1.0/24',
                                                                version: '1.3',
                                                                configurationItemCaptureTime: '2019-12-02T21:09:52.586Z',
                                                                tags:
                                                                    '{"AppName":"aws-perspective","Application":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X","Name":"vpc-0d1489acdc666462d-public-a","Network":"Public","aws:cloudformation:logical-id":"PublicSubnet0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                                                accountId: 'XXXXXXXXXXXX',
                                                                configurationStateId: '1575320992586',
                                                                availableIpAddressCount: '248',
                                                                mapPublicIpOnLaunch: 'true',
                                                                defaultForAz: 'false',
                                                                resourceType: 'AWS::EC2::Subnet'
                                                            },
                                                            parent: false,
                                                            costData:
                                                            {
                                                                totalCost: 0,
                                                                currency: 'USD',
                                                                startDate: '2020-01-09T09:52:16.881Z',
                                                                endDate: '1970-01-01T00:00:00.000Z'
                                                            }
                                                        }]
                                                },
                                                NetworkInterface:
                                                {
                                                    nodes:
                                                        [{
                                                            id: 'cd728a5a4ba3a12008a97e437387310c',
                                                            perspectiveBirthDate: '2020-01-08T13:44:46.712Z',
                                                            label: 'AWS::EC2::NetworkInterface',
                                                            properties:
                                                            {
                                                                subnetId: 'subnet-0f690256efabe0adb',
                                                                configurationItemStatus: 'OK',
                                                                resourceId: 'eni-0e34557f68aaf3800',
                                                                configuration:
                                                                    '{"association":{"allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","ipOwnerId":"XXXXXXXXXXXX","publicDnsName":"ec2-34-251-252-207.eu-west-1.compute.amazonaws.com","publicIp":"34.251.252.207"},"attachment":{"attachTime":null,"attachmentId":"ela-attach-b295a48f","deleteOnTermination":false,"deviceIndex":1,"instanceId":null,"instanceOwnerId":"amazon-aws","status":"attached"},"availabilityZone":"eu-west-1a","description":"Interface for NAT Gateway nat-0e2d1d2e0105bc3d7","groups":[],"interfaceType":"nat_gateway","ipv6Addresses":[],"macAddress":"0a:cb:41:33:fe:8c","networkInterfaceId":"eni-0e34557f68aaf3800","outpostArn":null,"ownerId":"XXXXXXXXXXXX","privateDnsName":"ip-10-0-1-55.eu-west-1.compute.internal","privateIpAddress":"10.0.1.55","privateIpAddresses":[{"association":{"allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","ipOwnerId":"XXXXXXXXXXXX","publicDnsName":"ec2-34-251-252-207.eu-west-1.compute.amazonaws.com","publicIp":"34.251.252.207"},"primary":true,"privateDnsName":"ip-10-0-1-55.eu-west-1.compute.internal","privateIpAddress":"10.0.1.55"}],"requesterId":"036872051663","requesterManaged":true,"sourceDestCheck":false,"status":"in-use","subnetId":"subnet-0f690256efabe0adb","tagSet":[],"vpcId":"vpc-0d1489acdc666462d"}',
                                                                description: 'Interface for NAT Gateway nat-0e2d1d2e0105bc3d7',
                                                                sourceDestCheck: 'false',
                                                                title: 'eni-0e34557f68aaf3800',
                                                                availabilityZone: 'eu-west-1a',
                                                                loggedInURL:
                                                                    'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#NIC:sort=description',
                                                                interfaceType: 'nat_gateway',
                                                                perspectiveBirthDate: '2020-01-08T13:44:46.712Z',
                                                                loginURL:
                                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#NIC:sort=description',
                                                                vpcId: 'vpc-0d1489acdc666462d',
                                                                relatedEvents: '[]',
                                                                arn:
                                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-interface/eni-0e34557f68aaf3800',
                                                                networkInterfaceId: 'eni-0e34557f68aaf3800',
                                                                awsRegion: 'eu-west-1',
                                                                requesterId: '036872051663',
                                                                supplementaryConfiguration: '{}',
                                                                configurationItemMD5Hash: '',
                                                                requesterManaged: 'true',
                                                                version: '1.3',
                                                                configurationItemCaptureTime: '2019-11-28T16:26:36.603Z',
                                                                privateIpAddress: '10.0.1.55',
                                                                tags: '{}',
                                                                accountId: 'XXXXXXXXXXXX',
                                                                configurationStateId: '1574958396603',
                                                                macAddress: '0a:cb:41:33:fe:8c',
                                                                privateDnsName: 'ip-10-0-1-55.eu-west-1.compute.internal',
                                                                status: 'in-use',
                                                                resourceType: 'AWS::EC2::NetworkInterface'
                                                            },
                                                            parent: true,
                                                            costData:
                                                            {
                                                                totalCost: 0,
                                                                currency: 'USD',
                                                                startDate: '2020-01-09T09:52:16.917Z',
                                                                endDate: '1970-01-01T00:00:00.000Z'
                                                            }
                                                        }]
                                                }
                                            }
                                        }
                                    }
                                },
                                undefined:
                                {
                                    subnet:
                                    {
                                        undefined:
                                        {
                                            type:
                                            {
                                                EIP:
                                                {
                                                    nodes:
                                                        [{
                                                            id: '6e1d1d816abbe53b44695dd46b479d81',
                                                            perspectiveBirthDate: '2020-01-08T13:50:18.632Z',
                                                            label: 'AWS::EC2::EIP',
                                                            properties:
                                                            {
                                                                configurationItemStatus: 'OK',
                                                                resourceId: 'eipalloc-00bc44f79cddefb85',
                                                                configuration:
                                                                    '{"instanceId":null,"publicIp":"34.251.252.207","allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","domain":"vpc","networkInterfaceId":"eni-0e34557f68aaf3800","networkInterfaceOwnerId":"XXXXXXXXXXXX","privateIpAddress":"10.0.1.55","tags":[{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"aws:cloudformation:logical-id","value":"ElasticIP0"},{"key":"AppName","value":"aws-perspective"},{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}],"publicIpv4Pool":"amazon","networkBorderGroup":null,"customerOwnedIp":null,"customerOwnedIpv4Pool":null}',
                                                                title: 'eipalloc-00bc44f79cddefb85',
                                                                availabilityZone: 'Not Applicable',
                                                                loggedInURL:
                                                                    'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Addresses:sort=PublicIp',
                                                                instanceId: 'null',
                                                                perspectiveBirthDate: '2020-01-08T13:50:18.632Z',
                                                                loginURL:
                                                                    'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Addresses:sort=PublicIp',
                                                                relatedEvents: '[]',
                                                                vpcId: 'vpc-0d1489acdc666462d',
                                                                arn:
                                                                    'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:eip-allocation/eipalloc-00bc44f79cddefb85',
                                                                networkInterfaceId: 'eni-0e34557f68aaf3800',
                                                                awsRegion: 'eu-west-1',
                                                                supplementaryConfiguration: '{}',
                                                                configurationItemMD5Hash: '',
                                                                resourceName: '34.251.252.207',
                                                                version: '1.3',
                                                                configurationItemCaptureTime: '2019-11-28T16:26:36.451Z',
                                                                privateIpAddress: '10.0.1.55',
                                                                tags:
                                                                    '{"AppName":"aws-perspective","aws:cloudformation:logical-id":"ElasticIP0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                                                accountId: 'XXXXXXXXXXXX',
                                                                configurationStateId: '1574958396451',
                                                                resourceType: 'AWS::EC2::EIP'
                                                            },
                                                            parent: false,
                                                            costData:
                                                            {
                                                                totalCost: 0,
                                                                currency: 'USD',
                                                                startDate: '2020-01-09T09:52:16.899Z',
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

exports.eniTransformBeforeFiltering = [{
    label: 'XXXXXXXXXXXX',
    type: 'account',
    children:
        [{
            label: 'eu-west-1',
            type: 'region',
            children:
                [{
                    label: 'vpc-0d1489acdc666462d',
                    type: 'vpc',
                    children:
                        [{
                            label: 'eu-west-1a',
                            type: 'availabilityZone',
                            children:
                                [{
                                    label: 'subnet-0f690256efabe0adb',
                                    type: 'subnet',
                                    children:
                                        [{
                                            label: 'NatGateway',
                                            type: 'type',
                                            children:
                                                [{
                                                    id: '8e89e7574d4e2b66938945e24a589acd',
                                                    perspectiveBirthDate: '2020-01-08T13:48:53.216Z',
                                                    label: 'AWS::EC2::NatGateway',
                                                    properties:
                                                    {
                                                        subnetId: 'subnet-0f690256efabe0adb',
                                                        configurationItemStatus: 'ResourceDiscovered',
                                                        awsRegion: 'eu-west-1',
                                                        resourceId: 'nat-0e2d1d2e0105bc3d7',
                                                        supplementaryConfiguration: '{}',
                                                        configuration:
                                                            '{"createTime":1574957356000,"natGatewayAddresses":[{"allocationId":"eipalloc-00bc44f79cddefb85","networkInterfaceId":"eni-0e34557f68aaf3800","privateIp":"10.0.1.55","publicIp":"34.251.252.207"}],"natGatewayId":"nat-0e2d1d2e0105bc3d7","state":"available","subnetId":"subnet-0f690256efabe0adb","vpcId":"vpc-0d1489acdc666462d","tags":[{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"NATGateway0"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"AppName","value":"aws-perspective"}]}',
                                                        configurationItemMD5Hash: '',
                                                        title: 'nat-0e2d1d2e0105bc3d7',
                                                        version: '1.3',
                                                        configurationItemCaptureTime: '2019-11-28T16:26:33.432Z',
                                                        availabilityZone: 'Not Applicable',
                                                        tags:
                                                            '{"AppName":"aws-perspective","aws:cloudformation:logical-id":"NATGateway0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                                        accountId: 'XXXXXXXXXXXX',
                                                        configurationStateId: '1574958393432',
                                                        perspectiveBirthDate: '2020-01-08T13:48:53.216Z',
                                                        vpcId: 'vpc-0d1489acdc666462d',
                                                        relatedEvents: '[]',
                                                        state: '"available"',
                                                        arn:
                                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:natgateway/nat-0e2d1d2e0105bc3d7',
                                                        resourceCreationTime: '2019-11-28T16:09:16.000Z',
                                                        resourceType: 'AWS::EC2::NatGateway'
                                                    },
                                                    parent: false,
                                                    costData:
                                                    {
                                                        totalCost: 2.9853008132000007,
                                                        currency: 'USD',
                                                        startDate: '2020-01-02T00:00:00.000Z',
                                                        endDate: '2020-01-08T05:00:00.000Z'
                                                    },
                                                    type: 'node'
                                                }]
                                        },
                                        {
                                            label: 'Subnet',
                                            type: 'type',
                                            children:
                                                [{
                                                    id: '976f39d5445f84df7c64b58ca1f1caf7',
                                                    perspectiveBirthDate: '2020-01-08T13:41:30.627Z',
                                                    label: 'AWS::EC2::Subnet',
                                                    properties:
                                                    {
                                                        subnetId: 'subnet-0f690256efabe0adb',
                                                        configurationItemStatus: 'OK',
                                                        resourceId: 'subnet-0f690256efabe0adb',
                                                        configuration:
                                                            '{"availabilityZone":"eu-west-1a","availabilityZoneId":"euw1-az3","availableIpAddressCount":248,"cidrBlock":"10.0.1.0/24","defaultForAz":false,"mapPublicIpOnLaunch":true,"state":"available","subnetId":"subnet-0f690256efabe0adb","vpcId":"vpc-0d1489acdc666462d","ownerId":"XXXXXXXXXXXX","assignIpv6AddressOnCreation":false,"ipv6CidrBlockAssociationSet":[],"tags":[{"key":"AppName","value":"aws-perspective"},{"key":"Name","value":"vpc-0d1489acdc666462d-public-a"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"Network","value":"Public"},{"key":"Application","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"PublicSubnet0"}],"subnetArn":"arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb","outpostArn":null}',
                                                        title: 'subnet-0f690256efabe0adb',
                                                        assignIpv6AddressOnCreation: 'false',
                                                        availabilityZone: 'eu-west-1a',
                                                        loggedInURL:
                                                            'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#subnets:sort=SubnetId',
                                                        perspectiveBirthDate: '2020-01-08T13:41:30.627Z',
                                                        loginURL:
                                                            'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#subnets:sort=SubnetId',
                                                        vpcId: 'vpc-0d1489acdc666462d',
                                                        relatedEvents: '[]',
                                                        state: '"available"',
                                                        arn:
                                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb',
                                                        awsRegion: 'eu-west-1',
                                                        supplementaryConfiguration: '{}',
                                                        configurationItemMD5Hash: '',
                                                        cidrBlock: '10.0.1.0/24',
                                                        version: '1.3',
                                                        configurationItemCaptureTime: '2019-12-02T21:09:52.586Z',
                                                        tags:
                                                            '{"AppName":"aws-perspective","Application":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X","Name":"vpc-0d1489acdc666462d-public-a","Network":"Public","aws:cloudformation:logical-id":"PublicSubnet0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                                        accountId: 'XXXXXXXXXXXX',
                                                        configurationStateId: '1575320992586',
                                                        availableIpAddressCount: '248',
                                                        mapPublicIpOnLaunch: 'true',
                                                        defaultForAz: 'false',
                                                        resourceType: 'AWS::EC2::Subnet'
                                                    },
                                                    parent: false,
                                                    costData:
                                                    {
                                                        totalCost: 0,
                                                        currency: 'USD',
                                                        startDate: '2020-01-09T09:52:16.881Z',
                                                        endDate: '1970-01-01T00:00:00.000Z'
                                                    },
                                                    type: 'node'
                                                }]
                                        },
                                        {
                                            label: 'NetworkInterface',
                                            type: 'type',
                                            children:
                                                [{
                                                    id: 'cd728a5a4ba3a12008a97e437387310c',
                                                    perspectiveBirthDate: '2020-01-08T13:44:46.712Z',
                                                    label: 'AWS::EC2::NetworkInterface',
                                                    properties:
                                                    {
                                                        subnetId: 'subnet-0f690256efabe0adb',
                                                        configurationItemStatus: 'OK',
                                                        resourceId: 'eni-0e34557f68aaf3800',
                                                        configuration:
                                                            '{"association":{"allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","ipOwnerId":"XXXXXXXXXXXX","publicDnsName":"ec2-34-251-252-207.eu-west-1.compute.amazonaws.com","publicIp":"34.251.252.207"},"attachment":{"attachTime":null,"attachmentId":"ela-attach-b295a48f","deleteOnTermination":false,"deviceIndex":1,"instanceId":null,"instanceOwnerId":"amazon-aws","status":"attached"},"availabilityZone":"eu-west-1a","description":"Interface for NAT Gateway nat-0e2d1d2e0105bc3d7","groups":[],"interfaceType":"nat_gateway","ipv6Addresses":[],"macAddress":"0a:cb:41:33:fe:8c","networkInterfaceId":"eni-0e34557f68aaf3800","outpostArn":null,"ownerId":"XXXXXXXXXXXX","privateDnsName":"ip-10-0-1-55.eu-west-1.compute.internal","privateIpAddress":"10.0.1.55","privateIpAddresses":[{"association":{"allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","ipOwnerId":"XXXXXXXXXXXX","publicDnsName":"ec2-34-251-252-207.eu-west-1.compute.amazonaws.com","publicIp":"34.251.252.207"},"primary":true,"privateDnsName":"ip-10-0-1-55.eu-west-1.compute.internal","privateIpAddress":"10.0.1.55"}],"requesterId":"036872051663","requesterManaged":true,"sourceDestCheck":false,"status":"in-use","subnetId":"subnet-0f690256efabe0adb","tagSet":[],"vpcId":"vpc-0d1489acdc666462d"}',
                                                        description: 'Interface for NAT Gateway nat-0e2d1d2e0105bc3d7',
                                                        sourceDestCheck: 'false',
                                                        title: 'eni-0e34557f68aaf3800',
                                                        availabilityZone: 'eu-west-1a',
                                                        loggedInURL:
                                                            'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#NIC:sort=description',
                                                        interfaceType: 'nat_gateway',
                                                        perspectiveBirthDate: '2020-01-08T13:44:46.712Z',
                                                        loginURL:
                                                            'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#NIC:sort=description',
                                                        vpcId: 'vpc-0d1489acdc666462d',
                                                        relatedEvents: '[]',
                                                        arn:
                                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-interface/eni-0e34557f68aaf3800',
                                                        networkInterfaceId: 'eni-0e34557f68aaf3800',
                                                        awsRegion: 'eu-west-1',
                                                        requesterId: '036872051663',
                                                        supplementaryConfiguration: '{}',
                                                        configurationItemMD5Hash: '',
                                                        requesterManaged: 'true',
                                                        version: '1.3',
                                                        configurationItemCaptureTime: '2019-11-28T16:26:36.603Z',
                                                        privateIpAddress: '10.0.1.55',
                                                        tags: '{}',
                                                        accountId: 'XXXXXXXXXXXX',
                                                        configurationStateId: '1574958396603',
                                                        macAddress: '0a:cb:41:33:fe:8c',
                                                        privateDnsName: 'ip-10-0-1-55.eu-west-1.compute.internal',
                                                        status: 'in-use',
                                                        resourceType: 'AWS::EC2::NetworkInterface'
                                                    },
                                                    parent: true,
                                                    costData:
                                                    {
                                                        totalCost: 0,
                                                        currency: 'USD',
                                                        startDate: '2020-01-09T09:52:16.917Z',
                                                        endDate: '1970-01-01T00:00:00.000Z'
                                                    },
                                                    type: 'node'
                                                }]
                                        }],
                                    data:
                                    {
                                        properties:
                                        {
                                            subnetId: 'subnet-0f690256efabe0adb',
                                            configurationItemStatus: 'OK',
                                            resourceId: 'subnet-0f690256efabe0adb',
                                            configuration:
                                                '{"availabilityZone":"eu-west-1a","availabilityZoneId":"euw1-az3","availableIpAddressCount":248,"cidrBlock":"10.0.1.0/24","defaultForAz":false,"mapPublicIpOnLaunch":true,"state":"available","subnetId":"subnet-0f690256efabe0adb","vpcId":"vpc-0d1489acdc666462d","ownerId":"XXXXXXXXXXXX","assignIpv6AddressOnCreation":false,"ipv6CidrBlockAssociationSet":[],"tags":[{"key":"AppName","value":"aws-perspective"},{"key":"Name","value":"vpc-0d1489acdc666462d-public-a"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"Network","value":"Public"},{"key":"Application","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"PublicSubnet0"}],"subnetArn":"arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb"}',
                                            title: 'subnet-0f690256efabe0adb',
                                            assignIpv6AddressOnCreation: 'false',
                                            availabilityZone: 'eu-west-1a',
                                            loggedInURL:
                                                'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#subnets:sort=SubnetId',
                                            loginURL:
                                                'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#subnets:sort=SubnetId',
                                            vpcId: 'vpc-0d1489acdc666462d',
                                            relatedEvents: '[]',
                                            state: '"available"',
                                            arn:
                                                'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb',
                                            awsRegion: 'eu-west-1',
                                            supplementaryConfiguration: '{}',
                                            configurationItemMD5Hash: '',
                                            cidrBlock: '10.0.1.0/24',
                                            version: '1.3',
                                            configurationItemCaptureTime: '2019-12-02T21:09:52.586Z',
                                            tags:
                                                '{"AppName":"aws-perspective","Application":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X","Name":"vpc-0d1489acdc666462d-public-a","Network":"Public","aws:cloudformation:logical-id":"PublicSubnet0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                            accountId: 'XXXXXXXXXXXX',
                                            configurationStateId: '1575320992586',
                                            availableIpAddressCount: '248',
                                            mapPublicIpOnLaunch: 'true',
                                            defaultForAz: 'false',
                                            resourceType: 'AWS::EC2::Subnet'
                                        },
                                        perspectiveBirthDate: '2019-12-11T12:11:35.223Z',
                                        id: 'a9c9f0d1fbc02fe5622d368e10bd3778',
                                        label: 'AWS::EC2::Subnet'
                                    },
                                    id: 'a9c9f0d1fbc02fe5622d368e10bd3778'
                                }]
                        },
                        {
                            label: 'EIP',
                            type: 'type',
                            children:
                                [{
                                    id: '6e1d1d816abbe53b44695dd46b479d81',
                                    perspectiveBirthDate: '2020-01-08T13:50:18.632Z',
                                    label: 'AWS::EC2::EIP',
                                    properties:
                                    {
                                        configurationItemStatus: 'OK',
                                        resourceId: 'eipalloc-00bc44f79cddefb85',
                                        configuration:
                                            '{"instanceId":null,"publicIp":"34.251.252.207","allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","domain":"vpc","networkInterfaceId":"eni-0e34557f68aaf3800","networkInterfaceOwnerId":"XXXXXXXXXXXX","privateIpAddress":"10.0.1.55","tags":[{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"aws:cloudformation:logical-id","value":"ElasticIP0"},{"key":"AppName","value":"aws-perspective"},{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}],"publicIpv4Pool":"amazon","networkBorderGroup":null,"customerOwnedIp":null,"customerOwnedIpv4Pool":null}',
                                        title: 'eipalloc-00bc44f79cddefb85',
                                        availabilityZone: 'Not Applicable',
                                        loggedInURL:
                                            'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Addresses:sort=PublicIp',
                                        instanceId: 'null',
                                        perspectiveBirthDate: '2020-01-08T13:50:18.632Z',
                                        loginURL:
                                            'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Addresses:sort=PublicIp',
                                        relatedEvents: '[]',
                                        vpcId: 'vpc-0d1489acdc666462d',
                                        arn:
                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:eip-allocation/eipalloc-00bc44f79cddefb85',
                                        networkInterfaceId: 'eni-0e34557f68aaf3800',
                                        awsRegion: 'eu-west-1',
                                        supplementaryConfiguration: '{}',
                                        configurationItemMD5Hash: '',
                                        resourceName: '34.251.252.207',
                                        version: '1.3',
                                        configurationItemCaptureTime: '2019-11-28T16:26:36.451Z',
                                        privateIpAddress: '10.0.1.55',
                                        tags:
                                            '{"AppName":"aws-perspective","aws:cloudformation:logical-id":"ElasticIP0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                        accountId: 'XXXXXXXXXXXX',
                                        configurationStateId: '1574958396451',
                                        resourceType: 'AWS::EC2::EIP'
                                    },
                                    parent: false,
                                    costData:
                                    {
                                        totalCost: 0,
                                        currency: 'USD',
                                        startDate: '2020-01-09T09:52:16.899Z',
                                        endDate: '1970-01-01T00:00:00.000Z'
                                    },
                                    type: 'node'
                                }]
                        }],
                    data:
                    {
                        properties:
                        {
                            configurationItemStatus: 'OK',
                            resourceId: 'vpc-0d1489acdc666462d',
                            configuration:
                                '{"cidrBlock":"10.0.0.0/16","dhcpOptionsId":"dopt-fdacf89b","state":"available","vpcId":"vpc-0d1489acdc666462d","ownerId":"XXXXXXXXXXXX","instanceTenancy":"default","ipv6CidrBlockAssociationSet":[],"cidrBlockAssociationSet":[{"associationId":"vpc-cidr-assoc-025cffec99772bb85","cidrBlock":"10.0.0.0/16","cidrBlockState":{"state":"associated","statusMessage":null}}],"isDefault":false,"tags":[{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"VPC"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"Application","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"Network","value":"Public"},{"key":"AppName","value":"aws-perspective"}]}',
                            title: 'vpc-0d1489acdc666462d',
                            availabilityZone: 'Multiple Availability Zones',
                            loggedInURL:
                                'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#vpcs:sort=VpcId',
                            loginURL:
                                'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#vpcs:sort=VpcId',
                            vpcId: 'vpc-0d1489acdc666462d',
                            relatedEvents: '[]',
                            state: '"available"',
                            arn:
                                'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:vpc/vpc-0d1489acdc666462d',
                            instanceTenancy: 'default',
                            awsRegion: 'eu-west-1',
                            supplementaryConfiguration: '{}',
                            configurationItemMD5Hash: '',
                            cidrBlock: '10.0.0.0/16',
                            version: '1.3',
                            configurationItemCaptureTime: '2019-12-05T15:32:29.119Z',
                            tags:
                                '{"AppName":"aws-perspective","Application":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X","Network":"Public","aws:cloudformation:logical-id":"VPC","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                            accountId: 'XXXXXXXXXXXX',
                            configurationStateId: 'XXXXXXXXXXXX',
                            isDefault: 'false',
                            dhcpOptionsId: 'dopt-fdacf89b',
                            resourceType: 'AWS::EC2::VPC'
                        },
                        perspectiveBirthDate: '2019-12-11T12:11:25.283Z',
                        id: 'e00f68f37185c3988a77219f77285936',
                        label: 'AWS::EC2::VPC'
                    },
                    id: 'e00f68f37185c3988a77219f77285936'
                }]
        }]
}];

exports.eniTransformAfterFiltering = [{
    label: 'XXXXXXXXXXXX',
    type: 'account',
    children:
        [{
            label: 'eu-west-1',
            type: 'region',
            children:
                [{
                    label: 'vpc-0d1489acdc666462d',
                    type: 'vpc',
                    id: 'e00f68f37185c3988a77219f77285936',
                    data:
                    {
                        properties:
                        {
                            configurationItemStatus: 'OK',
                            resourceId: 'vpc-0d1489acdc666462d',
                            configuration:
                                '{"cidrBlock":"10.0.0.0/16","dhcpOptionsId":"dopt-fdacf89b","state":"available","vpcId":"vpc-0d1489acdc666462d","ownerId":"XXXXXXXXXXXX","instanceTenancy":"default","ipv6CidrBlockAssociationSet":[],"cidrBlockAssociationSet":[{"associationId":"vpc-cidr-assoc-025cffec99772bb85","cidrBlock":"10.0.0.0/16","cidrBlockState":{"state":"associated","statusMessage":null}}],"isDefault":false,"tags":[{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"VPC"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"Application","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"Network","value":"Public"},{"key":"AppName","value":"aws-perspective"}]}',
                            title: 'vpc-0d1489acdc666462d',
                            availabilityZone: 'Multiple Availability Zones',
                            loggedInURL:
                                'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#vpcs:sort=VpcId',
                            loginURL:
                                'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#vpcs:sort=VpcId',
                            vpcId: 'vpc-0d1489acdc666462d',
                            relatedEvents: '[]',
                            state: '"available"',
                            arn:
                                'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:vpc/vpc-0d1489acdc666462d',
                            instanceTenancy: 'default',
                            awsRegion: 'eu-west-1',
                            supplementaryConfiguration: '{}',
                            configurationItemMD5Hash: '',
                            cidrBlock: '10.0.0.0/16',
                            version: '1.3',
                            configurationItemCaptureTime: '2019-12-05T15:32:29.119Z',
                            tags:
                                '{"AppName":"aws-perspective","Application":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X","Network":"Public","aws:cloudformation:logical-id":"VPC","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                            accountId: 'XXXXXXXXXXXX',
                            configurationStateId: 'XXXXXXXXXXXX',
                            isDefault: 'false',
                            dhcpOptionsId: 'dopt-fdacf89b',
                            resourceType: 'AWS::EC2::VPC'
                        },
                        perspectiveBirthDate: '2019-12-11T12:11:25.283Z',
                        id: 'e00f68f37185c3988a77219f77285936',
                        label: 'AWS::EC2::VPC'
                    },
                    children:
                        [{
                            label: 'eu-west-1a',
                            type: 'availabilityZone',
                            children:
                                [{
                                    label: 'subnet-0f690256efabe0adb',
                                    type: 'subnet',
                                    id: 'a9c9f0d1fbc02fe5622d368e10bd3778',
                                    data:
                                    {
                                        properties:
                                        {
                                            subnetId: 'subnet-0f690256efabe0adb',
                                            configurationItemStatus: 'OK',
                                            resourceId: 'subnet-0f690256efabe0adb',
                                            configuration:
                                                '{"availabilityZone":"eu-west-1a","availabilityZoneId":"euw1-az3","availableIpAddressCount":248,"cidrBlock":"10.0.1.0/24","defaultForAz":false,"mapPublicIpOnLaunch":true,"state":"available","subnetId":"subnet-0f690256efabe0adb","vpcId":"vpc-0d1489acdc666462d","ownerId":"XXXXXXXXXXXX","assignIpv6AddressOnCreation":false,"ipv6CidrBlockAssociationSet":[],"tags":[{"key":"AppName","value":"aws-perspective"},{"key":"Name","value":"vpc-0d1489acdc666462d-public-a"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"Network","value":"Public"},{"key":"Application","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"PublicSubnet0"}],"subnetArn":"arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb"}',
                                            title: 'subnet-0f690256efabe0adb',
                                            assignIpv6AddressOnCreation: 'false',
                                            availabilityZone: 'eu-west-1a',
                                            loggedInURL:
                                                'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#subnets:sort=SubnetId',
                                            loginURL:
                                                'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#subnets:sort=SubnetId',
                                            vpcId: 'vpc-0d1489acdc666462d',
                                            relatedEvents: '[]',
                                            state: '"available"',
                                            arn:
                                                'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb',
                                            awsRegion: 'eu-west-1',
                                            supplementaryConfiguration: '{}',
                                            configurationItemMD5Hash: '',
                                            cidrBlock: '10.0.1.0/24',
                                            version: '1.3',
                                            configurationItemCaptureTime: '2019-12-02T21:09:52.586Z',
                                            tags:
                                                '{"AppName":"aws-perspective","Application":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X","Name":"vpc-0d1489acdc666462d-public-a","Network":"Public","aws:cloudformation:logical-id":"PublicSubnet0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                            accountId: 'XXXXXXXXXXXX',
                                            configurationStateId: '1575320992586',
                                            availableIpAddressCount: '248',
                                            mapPublicIpOnLaunch: 'true',
                                            defaultForAz: 'false',
                                            resourceType: 'AWS::EC2::Subnet'
                                        },
                                        perspectiveBirthDate: '2019-12-11T12:11:35.223Z',
                                        id: 'a9c9f0d1fbc02fe5622d368e10bd3778',
                                        label: 'AWS::EC2::Subnet'
                                    },
                                    children:
                                        [{
                                            label: 'NatGateway',
                                            type: 'type',
                                            children:
                                                [{
                                                    id: '8e89e7574d4e2b66938945e24a589acd',
                                                    perspectiveBirthDate: '2020-01-08T13:48:53.216Z',
                                                    label: 'AWS::EC2::NatGateway',
                                                    properties:
                                                    {
                                                        subnetId: 'subnet-0f690256efabe0adb',
                                                        configurationItemStatus: 'ResourceDiscovered',
                                                        awsRegion: 'eu-west-1',
                                                        resourceId: 'nat-0e2d1d2e0105bc3d7',
                                                        supplementaryConfiguration: '{}',
                                                        configuration:
                                                            '{"createTime":1574957356000,"natGatewayAddresses":[{"allocationId":"eipalloc-00bc44f79cddefb85","networkInterfaceId":"eni-0e34557f68aaf3800","privateIp":"10.0.1.55","publicIp":"34.251.252.207"}],"natGatewayId":"nat-0e2d1d2e0105bc3d7","state":"available","subnetId":"subnet-0f690256efabe0adb","vpcId":"vpc-0d1489acdc666462d","tags":[{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"NATGateway0"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"AppName","value":"aws-perspective"}]}',
                                                        configurationItemMD5Hash: '',
                                                        title: 'nat-0e2d1d2e0105bc3d7',
                                                        version: '1.3',
                                                        configurationItemCaptureTime: '2019-11-28T16:26:33.432Z',
                                                        availabilityZone: 'Not Applicable',
                                                        tags:
                                                            '{"AppName":"aws-perspective","aws:cloudformation:logical-id":"NATGateway0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                                        accountId: 'XXXXXXXXXXXX',
                                                        configurationStateId: '1574958393432',
                                                        perspectiveBirthDate: '2020-01-08T13:48:53.216Z',
                                                        vpcId: 'vpc-0d1489acdc666462d',
                                                        relatedEvents: '[]',
                                                        state: '"available"',
                                                        arn:
                                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:natgateway/nat-0e2d1d2e0105bc3d7',
                                                        resourceCreationTime: '2019-11-28T16:09:16.000Z',
                                                        resourceType: 'AWS::EC2::NatGateway'
                                                    },
                                                    parent: false,
                                                    costData:
                                                    {
                                                        totalCost: 2.9853008132000007,
                                                        currency: 'USD',
                                                        startDate: '2020-01-02T00:00:00.000Z',
                                                        endDate: '2020-01-08T05:00:00.000Z'
                                                    },
                                                    type: 'node'
                                                }]
                                        },
                                        {
                                            label: 'Subnet',
                                            type: 'type',
                                            children:
                                                [{
                                                    id: '976f39d5445f84df7c64b58ca1f1caf7',
                                                    perspectiveBirthDate: '2020-01-08T13:41:30.627Z',
                                                    label: 'AWS::EC2::Subnet',
                                                    properties:
                                                    {
                                                        subnetId: 'subnet-0f690256efabe0adb',
                                                        configurationItemStatus: 'OK',
                                                        resourceId: 'subnet-0f690256efabe0adb',
                                                        configuration:
                                                            '{"availabilityZone":"eu-west-1a","availabilityZoneId":"euw1-az3","availableIpAddressCount":248,"cidrBlock":"10.0.1.0/24","defaultForAz":false,"mapPublicIpOnLaunch":true,"state":"available","subnetId":"subnet-0f690256efabe0adb","vpcId":"vpc-0d1489acdc666462d","ownerId":"XXXXXXXXXXXX","assignIpv6AddressOnCreation":false,"ipv6CidrBlockAssociationSet":[],"tags":[{"key":"AppName","value":"aws-perspective"},{"key":"Name","value":"vpc-0d1489acdc666462d-public-a"},{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"Network","value":"Public"},{"key":"Application","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"},{"key":"aws:cloudformation:logical-id","value":"PublicSubnet0"}],"subnetArn":"arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb","outpostArn":null}',
                                                        title: 'subnet-0f690256efabe0adb',
                                                        assignIpv6AddressOnCreation: 'false',
                                                        availabilityZone: 'eu-west-1a',
                                                        loggedInURL:
                                                            'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#subnets:sort=SubnetId',
                                                        perspectiveBirthDate: '2020-01-08T13:41:30.627Z',
                                                        loginURL:
                                                            'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#subnets:sort=SubnetId',
                                                        vpcId: 'vpc-0d1489acdc666462d',
                                                        relatedEvents: '[]',
                                                        state: '"available"',
                                                        arn:
                                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-0f690256efabe0adb',
                                                        awsRegion: 'eu-west-1',
                                                        supplementaryConfiguration: '{}',
                                                        configurationItemMD5Hash: '',
                                                        cidrBlock: '10.0.1.0/24',
                                                        version: '1.3',
                                                        configurationItemCaptureTime: '2019-12-02T21:09:52.586Z',
                                                        tags:
                                                            '{"AppName":"aws-perspective","Application":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X","Name":"vpc-0d1489acdc666462d-public-a","Network":"Public","aws:cloudformation:logical-id":"PublicSubnet0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                                        accountId: 'XXXXXXXXXXXX',
                                                        configurationStateId: '1575320992586',
                                                        availableIpAddressCount: '248',
                                                        mapPublicIpOnLaunch: 'true',
                                                        defaultForAz: 'false',
                                                        resourceType: 'AWS::EC2::Subnet'
                                                    },
                                                    parent: false,
                                                    costData:
                                                    {
                                                        totalCost: 0,
                                                        currency: 'USD',
                                                        startDate: '2020-01-09T09:52:16.881Z',
                                                        endDate: '1970-01-01T00:00:00.000Z'
                                                    },
                                                    type: 'node'
                                                }]
                                        },
                                        {
                                            label: 'NetworkInterface',
                                            type: 'type',
                                            children:
                                                [{
                                                    id: 'cd728a5a4ba3a12008a97e437387310c',
                                                    perspectiveBirthDate: '2020-01-08T13:44:46.712Z',
                                                    label: 'AWS::EC2::NetworkInterface',
                                                    properties:
                                                    {
                                                        subnetId: 'subnet-0f690256efabe0adb',
                                                        configurationItemStatus: 'OK',
                                                        resourceId: 'eni-0e34557f68aaf3800',
                                                        configuration:
                                                            '{"association":{"allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","ipOwnerId":"XXXXXXXXXXXX","publicDnsName":"ec2-34-251-252-207.eu-west-1.compute.amazonaws.com","publicIp":"34.251.252.207"},"attachment":{"attachTime":null,"attachmentId":"ela-attach-b295a48f","deleteOnTermination":false,"deviceIndex":1,"instanceId":null,"instanceOwnerId":"amazon-aws","status":"attached"},"availabilityZone":"eu-west-1a","description":"Interface for NAT Gateway nat-0e2d1d2e0105bc3d7","groups":[],"interfaceType":"nat_gateway","ipv6Addresses":[],"macAddress":"0a:cb:41:33:fe:8c","networkInterfaceId":"eni-0e34557f68aaf3800","outpostArn":null,"ownerId":"XXXXXXXXXXXX","privateDnsName":"ip-10-0-1-55.eu-west-1.compute.internal","privateIpAddress":"10.0.1.55","privateIpAddresses":[{"association":{"allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","ipOwnerId":"XXXXXXXXXXXX","publicDnsName":"ec2-34-251-252-207.eu-west-1.compute.amazonaws.com","publicIp":"34.251.252.207"},"primary":true,"privateDnsName":"ip-10-0-1-55.eu-west-1.compute.internal","privateIpAddress":"10.0.1.55"}],"requesterId":"036872051663","requesterManaged":true,"sourceDestCheck":false,"status":"in-use","subnetId":"subnet-0f690256efabe0adb","tagSet":[],"vpcId":"vpc-0d1489acdc666462d"}',
                                                        description: 'Interface for NAT Gateway nat-0e2d1d2e0105bc3d7',
                                                        sourceDestCheck: 'false',
                                                        title: 'eni-0e34557f68aaf3800',
                                                        availabilityZone: 'eu-west-1a',
                                                        loggedInURL:
                                                            'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#NIC:sort=description',
                                                        interfaceType: 'nat_gateway',
                                                        perspectiveBirthDate: '2020-01-08T13:44:46.712Z',
                                                        loginURL:
                                                            'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#NIC:sort=description',
                                                        vpcId: 'vpc-0d1489acdc666462d',
                                                        relatedEvents: '[]',
                                                        arn:
                                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-interface/eni-0e34557f68aaf3800',
                                                        networkInterfaceId: 'eni-0e34557f68aaf3800',
                                                        awsRegion: 'eu-west-1',
                                                        requesterId: '036872051663',
                                                        supplementaryConfiguration: '{}',
                                                        configurationItemMD5Hash: '',
                                                        requesterManaged: 'true',
                                                        version: '1.3',
                                                        configurationItemCaptureTime: '2019-11-28T16:26:36.603Z',
                                                        privateIpAddress: '10.0.1.55',
                                                        tags: '{}',
                                                        accountId: 'XXXXXXXXXXXX',
                                                        configurationStateId: '1574958396603',
                                                        macAddress: '0a:cb:41:33:fe:8c',
                                                        privateDnsName: 'ip-10-0-1-55.eu-west-1.compute.internal',
                                                        status: 'in-use',
                                                        resourceType: 'AWS::EC2::NetworkInterface'
                                                    },
                                                    parent: true,
                                                    costData:
                                                    {
                                                        totalCost: 0,
                                                        currency: 'USD',
                                                        startDate: '2020-01-09T09:52:16.917Z',
                                                        endDate: '1970-01-01T00:00:00.000Z'
                                                    },
                                                    type: 'node'
                                                }]
                                        }]
                                }]
                        },
                        {
                            label: 'EIP',
                            type: 'type',
                            children:
                                [{
                                    id: '6e1d1d816abbe53b44695dd46b479d81',
                                    perspectiveBirthDate: '2020-01-08T13:50:18.632Z',
                                    label: 'AWS::EC2::EIP',
                                    properties:
                                    {
                                        configurationItemStatus: 'OK',
                                        resourceId: 'eipalloc-00bc44f79cddefb85',
                                        configuration:
                                            '{"instanceId":null,"publicIp":"34.251.252.207","allocationId":"eipalloc-00bc44f79cddefb85","associationId":"eipassoc-03fb2f16ebde1ff58","domain":"vpc","networkInterfaceId":"eni-0e34557f68aaf3800","networkInterfaceOwnerId":"XXXXXXXXXXXX","privateIpAddress":"10.0.1.55","tags":[{"key":"aws:cloudformation:stack-id","value":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8"},{"key":"aws:cloudformation:logical-id","value":"ElasticIP0"},{"key":"AppName","value":"aws-perspective"},{"key":"aws:cloudformation:stack-name","value":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}],"publicIpv4Pool":"amazon","networkBorderGroup":null,"customerOwnedIp":null,"customerOwnedIpv4Pool":null}',
                                        title: 'eipalloc-00bc44f79cddefb85',
                                        availabilityZone: 'Not Applicable',
                                        loggedInURL:
                                            'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Addresses:sort=PublicIp',
                                        instanceId: 'null',
                                        perspectiveBirthDate: '2020-01-08T13:50:18.632Z',
                                        loginURL:
                                            'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Addresses:sort=PublicIp',
                                        relatedEvents: '[]',
                                        vpcId: 'vpc-0d1489acdc666462d',
                                        arn:
                                            'arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:eip-allocation/eipalloc-00bc44f79cddefb85',
                                        networkInterfaceId: 'eni-0e34557f68aaf3800',
                                        awsRegion: 'eu-west-1',
                                        supplementaryConfiguration: '{}',
                                        configurationItemMD5Hash: '',
                                        resourceName: '34.251.252.207',
                                        version: '1.3',
                                        configurationItemCaptureTime: '2019-11-28T16:26:36.451Z',
                                        privateIpAddress: '10.0.1.55',
                                        tags:
                                            '{"AppName":"aws-perspective","aws:cloudformation:logical-id":"ElasticIP0","aws:cloudformation:stack-id":"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/aws-perspective-eu-west-1-VpcStack-XNWX659JE84X/54bd4340-11f9-11ea-bec0-0224adcab7c8","aws:cloudformation:stack-name":"aws-perspective-eu-west-1-VpcStack-XNWX659JE84X"}',
                                        accountId: 'XXXXXXXXXXXX',
                                        configurationStateId: '1574958396451',
                                        resourceType: 'AWS::EC2::EIP'
                                    },
                                    parent: false,
                                    costData:
                                    {
                                        totalCost: 0,
                                        currency: 'USD',
                                        startDate: '2020-01-09T09:52:16.899Z',
                                        endDate: '1970-01-01T00:00:00.000Z'
                                    },
                                    type: 'node'
                                }]
                        }]
                }]
        }]
}];

