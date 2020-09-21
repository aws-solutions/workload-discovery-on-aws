const chai = require('chai');
const url = require('../src/discovery/consoleURL');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should create consoleURLs for s3 - AWS::S3::Bucket', async () => {
    const s3Data = {
        "id": "72496494bcc125232897c71ec742e286",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "zoom-api-bucket",
            "awsRegion": "eu-west-1",
            "configuration": "{\"name\":\"zoom-api-bucket\",\"owner\":{\"displayName\":null,\"id\":\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\"},\"creationDate\":\"2019-06-24T12:22:37.000Z\"}",
            "supplementaryConfiguration": "{\"AccessControlList\":\"\\\"{\\\\\\\"grantSet\\\\\\\":null,\\\\\\\"grantList\\\\\\\":[{\\\\\\\"grantee\\\\\\\":{\\\\\\\"id\\\\\\\":\\\\\\\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\\\\\\\",\\\\\\\"displayName\\\\\\\":null},\\\\\\\"permission\\\\\\\":\\\\\\\"FullControl\\\\\\\"}],\\\\\\\"owner\\\\\\\":{\\\\\\\"displayName\\\\\\\":null,\\\\\\\"id\\\\\\\":\\\\\\\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\\\\\\\"},\\\\\\\"isRequesterCharged\\\\\\\":false}\\\"\",\"BucketAccelerateConfiguration\":\"{\\\"status\\\":null}\",\"BucketLoggingConfiguration\":\"{\\\"destinationBucketName\\\":null,\\\"logFilePrefix\\\":null}\",\"BucketNotificationConfiguration\":\"{\\\"configurations\\\":{}}\",\"BucketPolicy\":\"{\\\"policyText\\\":null}\",\"BucketVersioningConfiguration\":\"{\\\"status\\\":\\\"Off\\\",\\\"isMfaDeleteEnabled\\\":null}\",\"IsRequesterPaysEnabled\":\"false\",\"PublicAccessBlockConfiguration\":\"{\\\"blockPublicAcls\\\":true,\\\"ignorePublicAcls\\\":true,\\\"blockPublicPolicy\\\":true,\\\"restrictPublicBuckets\\\":true}\"}",
            "configurationItemMD5Hash": "",
            "resourceName": "zoom-api-bucket",
            "title": "zoom-api-bucket",
            "availabilityZone": "Regional",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-06-24T12:24:45.288Z",
            "tags": "{}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568010164412",
            "relatedEvents": "[]",
            "name": "zoom-api-bucket",
            "arn": "arn:aws:s3:::zoom-api-bucket",
            "resourceCreationTime": "2019-06-24T12:22:37.000Z",
            "resourceType": "AWS::S3::Bucket"
        },
        "label": "AWS::S3::Bucket"
    };

    let ans = url.getConsoleURLs(s3Data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/s3?bucket=zoom-api-bucket',
        loggedInURL: 'https://s3.console.aws.amazon.com/s3/buckets/zoom-api-bucket/?region=eu-west-1'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for ec2 instance - AWS::EC2::Instance', async () => {
    const data = {
        "id": "029bf95530ffcbc1d65446f322b334b1",
        "properties": {
            "subnetId": "subnet-34bcc77c",
            "kernelId": "null",
            "resourceId": "i-0cbc30fd67b48d8dd",
            "enaSupport": "true",
            "availabilityZone": "eu-west-1c",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Instances:sort=instanceId",
            "state": "{\"code\":16,\"name\":\"running\"}",
            "ebsOptimized": "false",
            "imageId": "ami-03c242f4af81b2365",
            "configurationItemMD5Hash": "",
            "publicDnsName": "ec2-63-35-172-142.eu-west-1.compute.amazonaws.com",
            "version": "1.3",
            "privateIpAddress": "172.31.18.179",
            "capacityReservationId": "null",
            "tags": "{\"Name\":\"zoom-discovery-server\",\"zoom-discovery-deploy\":\"\"}",
            "accountId": "XXXXXXXXXXXX",
            "launchTime": "2019-06-24T08:26:41.000Z",
            "sriovNetSupport": "null",
            "configurationItemStatus": "OK",
            "ramdiskId": "null",
            "virtualizationType": "hvm",
            "configuration": "{\"amiLaunchIndex\":0,\"imageId\":\"ami-03c242f4af81b2365\",\"instanceId\":\"i-0cbc30fd67b48d8dd\",\"instanceType\":\"t2.medium\",\"kernelId\":null,\"keyName\":\"zoom-discovery\",\"launchTime\":\"2019-06-24T08:26:41.000Z\",\"monitoring\":{\"state\":\"disabled\"},\"placement\":{\"availabilityZone\":\"eu-west-1c\",\"affinity\":null,\"groupName\":\"\",\"partitionNumber\":null,\"hostId\":null,\"tenancy\":\"default\",\"spreadDomain\":null},\"platform\":null,\"privateDnsName\":\"ip-172-31-18-179.eu-west-1.compute.internal\",\"privateIpAddress\":\"172.31.18.179\",\"productCodes\":[],\"publicDnsName\":\"ec2-63-35-172-142.eu-west-1.compute.amazonaws.com\",\"publicIpAddress\":\"63.35.172.142\",\"ramdiskId\":null,\"state\":{\"code\":16,\"name\":\"running\"},\"stateTransitionReason\":\"\",\"subnetId\":\"subnet-34bcc77c\",\"vpcId\":\"vpc-08300e6e\",\"architecture\":\"x86_64\",\"blockDeviceMappings\":[{\"deviceName\":\"/dev/xvda\",\"ebs\":{\"attachTime\":\"2019-05-15T21:14:06.000Z\",\"deleteOnTermination\":true,\"status\":\"attached\",\"volumeId\":\"vol-0c52ec4d62c191cd9\"}}],\"clientToken\":\"\",\"ebsOptimized\":false,\"enaSupport\":true,\"hypervisor\":\"xen\",\"iamInstanceProfile\":{\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:instance-profile/zoom-platform-dev-DiscoveryServerRole-580XGBN7PJ69-ZoomDiscoveryServernstanceProfile-1XP71RHFEUZFQ\",\"id\":\"AIPA5XIWUT3P374IPFCMA\"},\"instanceLifecycle\":null,\"elasticGpuAssociations\":[],\"elasticInferenceAcceleratorAssociations\":[],\"networkInterfaces\":[{\"association\":{\"ipOwnerId\":\"amazon\",\"publicDnsName\":\"ec2-63-35-172-142.eu-west-1.compute.amazonaws.com\",\"publicIp\":\"63.35.172.142\"},\"attachment\":{\"attachTime\":\"2019-05-15T21:14:06.000Z\",\"attachmentId\":\"eni-attach-0f626ece31902b16e\",\"deleteOnTermination\":true,\"deviceIndex\":0,\"status\":\"attached\"},\"description\":\"\",\"groups\":[{\"groupName\":\"default\",\"groupId\":\"sg-479ff134\"},{\"groupName\":\"ssh access\",\"groupId\":\"sg-0818e372ea99a715f\"}],\"ipv6Addresses\":[],\"macAddress\":\"06:bf:09:1d:77:92\",\"networkInterfaceId\":\"eni-03133c7738bd95050\",\"ownerId\":\"XXXXXXXXXXXX\",\"privateDnsName\":\"ip-172-31-18-179.eu-west-1.compute.internal\",\"privateIpAddress\":\"172.31.18.179\",\"privateIpAddresses\":[{\"association\":{\"ipOwnerId\":\"amazon\",\"publicDnsName\":\"ec2-63-35-172-142.eu-west-1.compute.amazonaws.com\",\"publicIp\":\"63.35.172.142\"},\"primary\":true,\"privateDnsName\":\"ip-172-31-18-179.eu-west-1.compute.internal\",\"privateIpAddress\":\"172.31.18.179\"}],\"sourceDestCheck\":true,\"status\":\"in-use\",\"subnetId\":\"subnet-34bcc77c\",\"vpcId\":\"vpc-08300e6e\",\"interfaceType\":\"interface\"}],\"rootDeviceName\":\"/dev/xvda\",\"rootDeviceType\":\"ebs\",\"securityGroups\":[{\"groupName\":\"default\",\"groupId\":\"sg-479ff134\"},{\"groupName\":\"ssh access\",\"groupId\":\"sg-0818e372ea99a715f\"}],\"sourceDestCheck\":true,\"spotInstanceRequestId\":null,\"sriovNetSupport\":null,\"stateReason\":null,\"tags\":[{\"key\":\"Name\",\"value\":\"zoom-discovery-server\"},{\"key\":\"zoom-discovery-deploy\",\"value\":\"\"}],\"virtualizationType\":\"hvm\",\"cpuOptions\":{\"coreCount\":2,\"threadsPerCore\":1},\"capacityReservationId\":null,\"capacityReservationSpecification\":{\"capacityReservationPreference\":\"open\",\"capacityReservationTarget\":null},\"hibernationOptions\":{\"configured\":false},\"licenses\":[]}",
            "amiLaunchIndex": "0",
            "sourceDestCheck": "true",
            "stateReason": "null",
            "title": "i-0cbc30fd67b48d8dd",
            "platform": "null",
            "instanceId": "i-0cbc30fd67b48d8dd",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Instances:sort=instanceId",
            "vpcId": "vpc-08300e6e",
            "hypervisor": "xen",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:instance/i-0cbc30fd67b48d8dd",
            "resourceCreationTime": "2019-06-24T08:26:41.000Z",
            "architecture": "x86_64",
            "awsRegion": "eu-west-1",
            "publicIpAddress": "63.35.172.142",
            "supplementaryConfiguration": "{}",
            "stateTransitionReason": "",
            "clientToken": "",
            "instanceType": "t2.medium",
            "keyName": "zoom-discovery",
            "configurationItemCaptureTime": "2019-09-05T08:56:14.691Z",
            "iamInstanceProfile": "{\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:instance-profile/zoom-platform-dev-DiscoveryServerRole-580XGBN7PJ69-ZoomDiscoveryServernstanceProfile-1XP71RHFEUZFQ\",\"id\":\"AIPA5XIWUT3P374IPFCMA\"}",
            "instanceLifecycle": "null",
            "configurationStateId": "1568013758991",
            "spotInstanceRequestId": "null",
            "privateDnsName": "ip-172-31-18-179.eu-west-1.compute.internal",
            "resourceType": "AWS::EC2::Instance"
        },

        "label": "AWS::EC2::Instance"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Instances:sort=instanceId',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Instances:sort=instanceId'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for vpc subnet - AWS::EC2::Subnet', async () => {
    const data = {
        "id": "33db6d51fecea3a27bd3c974ae931766",
        "label": "AWS::EC2::Subnet",
        "properties": {
            "subnetId": "subnet-34bcc77c",
            "configurationItemStatus": "OK",
            "resourceId": "subnet-34bcc77c",
            "configuration": "{\"availabilityZone\":\"eu-west-1c\",\"availabilityZoneId\":\"euw1-az2\",\"availableIpAddressCount\":4086,\"cidrBlock\":\"172.31.16.0/20\",\"defaultForAz\":true,\"mapPublicIpOnLaunch\":true,\"state\":\"available\",\"subnetId\":\"subnet-34bcc77c\",\"vpcId\":\"vpc-08300e6e\",\"ownerId\":\"XXXXXXXXXXXX\",\"assignIpv6AddressOnCreation\":false,\"ipv6CidrBlockAssociationSet\":[],\"tags\":[],\"subnetArn\":\"arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-34bcc77c\"}",
            "title": "subnet-34bcc77c",
            "availabilityZone": "eu-west-1c",
            "assignIpv6AddressOnCreation": "false",
            "vpcId": "vpc-08300e6e",
            "relatedEvents": "[]",
            "state": "\"available\"",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:subnet/subnet-34bcc77c",
            "awsRegion": "eu-west-1",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "cidrBlock": "172.31.16.0/20",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-07-26T10:53:09.405Z",
            "tags": "{}",
            "configurationStateId": "1568013758741",
            "accountId": "XXXXXXXXXXXX",
            "availableIpAddressCount": "4086",
            "mapPublicIpOnLaunch": "true",
            "defaultForAz": "true",
            "resourceType": "AWS::EC2::Subnet"
        }
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#subnets:sort=SubnetId',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#subnets:sort=SubnetId'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for vpc', async () => {
    const data = {
        "id": "3d65e5c97824cf314e81dbceed80ab6a",
        "properties": {
            "configurationItemStatus": "OK",
            "instanceTenancy": "default",
            "resourceId": "vpc-08300e6e",
            "awsRegion": "eu-west-1",
            "configuration": "{\"cidrBlock\":\"172.31.0.0/16\",\"dhcpOptionsId\":\"dopt-afbad3c9\",\"state\":\"available\",\"vpcId\":\"vpc-08300e6e\",\"ownerId\":\"XXXXXXXXXXXX\",\"instanceTenancy\":\"default\",\"ipv6CidrBlockAssociationSet\":[],\"cidrBlockAssociationSet\":[{\"associationId\":\"vpc-cidr-assoc-8a93b4e1\",\"cidrBlock\":\"172.31.0.0/16\",\"cidrBlockState\":{\"state\":\"associated\",\"statusMessage\":null}}],\"isDefault\":true,\"tags\":[]}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "cidrBlock": "172.31.0.0/16",
            "title": "vpc-08300e6e",
            "availabilityZone": "Multiple Availability Zones",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-08-27T08:05:54.948Z",
            "tags": "{}",
            "configurationStateId": "1568013758863",
            "accountId": "XXXXXXXXXXXX",
            "isDefault": "true",
            "dhcpOptionsId": "dopt-afbad3c9",
            "vpcId": "vpc-08300e6e",
            "relatedEvents": "[]",
            "state": "\"available\"",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:vpc/vpc-08300e6e",
            "resourceType": "AWS::EC2::VPC"
        },
        "label": "AWS::EC2::VPC"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#vpcs:sort=VpcId',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#vpcs:sort=VpcId'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for ENI', async () => {
    const data = {
        "id": "0de33d2e65a0b4ed59aba3ed5a3a8b95",
        "properties": {
            "subnetId": "subnet-34bcc77c",
            "configurationItemStatus": "OK",
            "resourceId": "eni-03133c7738bd95050",
            "configuration": "{\"association\":{\"allocationId\":null,\"associationId\":null,\"ipOwnerId\":\"amazon\",\"publicDnsName\":\"ec2-63-35-172-142.eu-west-1.compute.amazonaws.com\",\"publicIp\":\"63.35.172.142\"},\"attachment\":{\"attachTime\":\"2019-05-15T21:14:06.000Z\",\"attachmentId\":\"eni-attach-0f626ece31902b16e\",\"deleteOnTermination\":true,\"deviceIndex\":0,\"instanceId\":\"i-0cbc30fd67b48d8dd\",\"instanceOwnerId\":\"XXXXXXXXXXXX\",\"status\":\"attached\"},\"availabilityZone\":\"eu-west-1c\",\"description\":\"\",\"groups\":[{\"groupName\":\"default\",\"groupId\":\"sg-479ff134\"},{\"groupName\":\"ssh access\",\"groupId\":\"sg-0818e372ea99a715f\"}],\"interfaceType\":\"interface\",\"ipv6Addresses\":[],\"macAddress\":\"06:bf:09:1d:77:92\",\"networkInterfaceId\":\"eni-03133c7738bd95050\",\"ownerId\":\"XXXXXXXXXXXX\",\"privateDnsName\":\"ip-172-31-18-179.eu-west-1.compute.internal\",\"privateIpAddress\":\"172.31.18.179\",\"privateIpAddresses\":[{\"association\":{\"allocationId\":null,\"associationId\":null,\"ipOwnerId\":\"amazon\",\"publicDnsName\":\"ec2-63-35-172-142.eu-west-1.compute.amazonaws.com\",\"publicIp\":\"63.35.172.142\"},\"primary\":true,\"privateDnsName\":\"ip-172-31-18-179.eu-west-1.compute.internal\",\"privateIpAddress\":\"172.31.18.179\"}],\"requesterId\":null,\"requesterManaged\":false,\"sourceDestCheck\":true,\"status\":\"in-use\",\"subnetId\":\"subnet-34bcc77c\",\"tagSet\":[],\"vpcId\":\"vpc-08300e6e\"}",
            "description": "",
            "sourceDestCheck": "true",
            "title": "eni-03133c7738bd95050",
            "availabilityZone": "eu-west-1c",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#NIC:sort=description",
            "interfaceType": "interface",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#NIC:sort=description",
            "vpcId": "vpc-08300e6e",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-interface/eni-03133c7738bd95050",
            "networkInterfaceId": "eni-03133c7738bd95050",
            "awsRegion": "eu-west-1",
            "requesterId": "null",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "version": "1.3",
            "requesterManaged": "false",
            "configurationItemCaptureTime": "2019-09-05T08:56:14.467Z",
            "privateIpAddress": "172.31.18.179",
            "tags": "{}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568013759400",
            "macAddress": "06:bf:09:1d:77:92",
            "privateDnsName": "ip-172-31-18-179.eu-west-1.compute.internal",
            "resourceType": "AWS::EC2::NetworkInterface",
            "status": "in-use"
        },
        "parent": true,
        "label": "AWS::EC2::NetworkInterface"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#NIC:sort=description',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#NIC:sort=description'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for volume', async () => {
    const data = {
        "id": "d2a6074860c1f4dbae1078db1ddae116",
        "label": "AWS::EC2::Volume",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "vol-0c52ec4d62c191cd9",
            "awsRegion": "eu-west-1",
            "configuration": "{\"attachments\":[{\"attachTime\":\"2019-05-15T21:14:06.000Z\",\"device\":\"/dev/xvda\",\"instanceId\":\"i-0cbc30fd67b48d8dd\",\"state\":\"attached\",\"volumeId\":\"vol-0c52ec4d62c191cd9\",\"deleteOnTermination\":true}],\"availabilityZone\":\"eu-west-1c\",\"createTime\":\"2019-05-15T21:14:06.556Z\",\"encrypted\":false,\"kmsKeyId\":null,\"size\":8,\"snapshotId\":\"snap-07534ddc8898f7855\",\"state\":\"in-use\",\"volumeId\":\"vol-0c52ec4d62c191cd9\",\"iops\":100,\"tags\":[{\"key\":\"Name\",\"value\":\"zoom-discovery-server\"}],\"volumeType\":\"gp2\"}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "title": "vol-0c52ec4d62c191cd9",
            "availabilityZone": "eu-west-1c",
            "configurationItemCaptureTime": "2019-05-15T21:43:51.484Z",
            "version": "1.3",
            "tags": "{\"Name\":\"zoom-discovery-server\"}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Volumes:sort=desc:createTime",
            "configurationStateId": "1568013759284",
            "accountId": "XXXXXXXXXXXX",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Volumes:sort=desc:createTime",
            "relatedEvents": "[]",
            "iops": "100",
            "kmsKeyId": "null",
            "state": "\"in-use\"",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:volume/vol-0c52ec4d62c191cd9",
            "resourceCreationTime": "2019-05-15T21:14:06.556Z",
            "resourceType": "AWS::EC2::Volume"
        }
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Volumes:sort=desc:name',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Volumes:sort=desc:name'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for SecurityGroup', async () => {
    const data = {
        "id": "ed2b43744f5ec7351fc3665444a5c655",
        "label": "AWS::EC2::SecurityGroup",
        "properties": {
            "configurationItemStatus": "OK",
            "resourceId": "sg-0818e372ea99a715f",
            "awsRegion": "eu-west-1",
            "configuration": "{\"description\":\"ssh access\",\"groupName\":\"ssh access\",\"ipPermissions\":[{\"fromPort\":80,\"ipProtocol\":\"tcp\",\"ipv6Ranges\":[],\"prefixListIds\":[{\"prefixListId\":\"pl-07a5406e\"}],\"toPort\":80,\"userIdGroupPairs\":[],\"ipv4Ranges\":[],\"ipRanges\":[]},{\"fromPort\":22,\"ipProtocol\":\"tcp\",\"ipv6Ranges\":[],\"prefixListIds\":[{\"prefixListId\":\"pl-07a5406e\"}],\"toPort\":22,\"userIdGroupPairs\":[],\"ipv4Ranges\":[{\"cidrIp\":\"54.240.197.232/32\"}],\"ipRanges\":[\"54.240.197.232/32\"]}],\"ownerId\":\"XXXXXXXXXXXX\",\"groupId\":\"sg-0818e372ea99a715f\",\"ipPermissionsEgress\":[{\"ipProtocol\":\"-1\",\"ipv6Ranges\":[],\"prefixListIds\":[],\"userIdGroupPairs\":[],\"ipv4Ranges\":[{\"cidrIp\":\"0.0.0.0/0\"}],\"ipRanges\":[\"0.0.0.0/0\"]}],\"tags\":[],\"vpcId\":\"vpc-08300e6e\"}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "description": "ssh access",
            "resourceName": "ssh access",
            "title": "sg-0818e372ea99a715f",
            "availabilityZone": "Not Applicable",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-07-24T09:43:50.272Z",
            "tags": "{}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#subnets:sort=SubnetId",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568013759740",
            "groupName": "ssh access",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#subnets:sort=SubnetId",
            "vpcId": "vpc-08300e6e",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:security-group/sg-0818e372ea99a715f",
            "resourceType": "AWS::EC2::SecurityGroup"
        }
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#SecurityGroups:sort=groupId',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#SecurityGroups:sort=groupId'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for RouteTables', async () => {
    const data = {
        "id": "27dedb199cbfe18b1a61dbe97971cbab",
        "properties": {
            "associations": "[{\"main\":false,\"routeTableAssociationId\":\"rtbassoc-0f005326220ab8f1e\",\"routeTableId\":\"rtb-0c849aeeb00bc7385\",\"subnetId\":\"subnet-0306ddd2f189b4662\"}]",
            "configurationItemStatus": "OK",
            "resourceId": "rtb-0c849aeeb00bc7385",
            "awsRegion": "eu-west-1",
            "configuration": "{\"associations\":[{\"main\":false,\"routeTableAssociationId\":\"rtbassoc-0f005326220ab8f1e\",\"routeTableId\":\"rtb-0c849aeeb00bc7385\",\"subnetId\":\"subnet-0306ddd2f189b4662\"}],\"propagatingVgws\":[],\"routeTableId\":\"rtb-0c849aeeb00bc7385\",\"routes\":[{\"destinationCidrBlock\":\"10.0.0.0/16\",\"destinationIpv6CidrBlock\":null,\"destinationPrefixListId\":null,\"egressOnlyInternetGatewayId\":null,\"gatewayId\":\"local\",\"instanceId\":null,\"instanceOwnerId\":null,\"natGatewayId\":null,\"transitGatewayId\":null,\"networkInterfaceId\":null,\"origin\":\"CreateRouteTable\",\"state\":\"active\",\"vpcPeeringConnectionId\":null},{\"destinationCidrBlock\":\"0.0.0.0/0\",\"destinationIpv6CidrBlock\":null,\"destinationPrefixListId\":null,\"egressOnlyInternetGatewayId\":null,\"gatewayId\":null,\"instanceId\":null,\"instanceOwnerId\":null,\"natGatewayId\":\"nat-0bbd8ef44d5997e77\",\"transitGatewayId\":null,\"networkInterfaceId\":null,\"origin\":\"CreateRoute\",\"state\":\"active\",\"vpcPeeringConnectionId\":null}],\"tags\":[{\"key\":\"Name\",\"value\":\"zoom-dev-private-route-table-0\"},{\"key\":\"aws:cloudformation:logical-id\",\"value\":\"PrivateRouteTable0\"},{\"key\":\"ServiceNameTag\",\"value\":\"zoom\"},{\"key\":\"Environment\",\"value\":\"dev\"},{\"key\":\"aws:cloudformation:stack-id\",\"value\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-VpcStack-1J8UZZR2JWNHK/d32c8560-bda3-11e9-8712-0a1f01fad44c\"},{\"key\":\"aws:cloudformation:stack-name\",\"value\":\"zoom-platform-dev-VpcStack-1J8UZZR2JWNHK\"}],\"vpcId\":\"vpc-0e10109041c39ad16\",\"ownerId\":\"XXXXXXXXXXXX\"}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "title": "rtb-0c849aeeb00bc7385",
            "availabilityZone": "Not Applicable",
            "configurationItemCaptureTime": "2019-08-13T08:30:09.882Z",
            "version": "1.3",
            "tags": "{\"Environment\":\"dev\",\"Name\":\"zoom-dev-private-route-table-0\",\"ServiceNameTag\":\"zoom\",\"aws:cloudformation:logical-id\":\"PrivateRouteTable0\",\"aws:cloudformation:stack-id\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-VpcStack-1J8UZZR2JWNHK/d32c8560-bda3-11e9-8712-0a1f01fad44c\",\"aws:cloudformation:stack-name\":\"zoom-platform-dev-VpcStack-1J8UZZR2JWNHK\"}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#RouteTables:sort=routeTableId",
            "configurationStateId": "1568013758641",
            "accountId": "XXXXXXXXXXXX",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#RouteTables:sort=routeTableId",
            "vpcId": "vpc-0e10109041c39ad16",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:route-table/rtb-0c849aeeb00bc7385",
            "resourceType": "AWS::EC2::RouteTable"
        },
        "parent": true,
        "label": "AWS::EC2::RouteTable"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#RouteTables:sort=routeTableId',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#RouteTables:sort=routeTableId'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for NACL', async () => {
    const data = {
        "id": "1256bc15184c721fd36517c637e8c73a",
        "label": "AWS::EC2::NetworkAcl",
        "properties": {
            "associations": "[{\"networkAclAssociationId\":\"aclassoc-bbb81bc5\",\"networkAclId\":\"acl-d23888ab\",\"subnetId\":\"subnet-1ddeb67b\"},{\"networkAclAssociationId\":\"aclassoc-b8b81bc6\",\"networkAclId\":\"acl-d23888ab\",\"subnetId\":\"subnet-34bcc77c\"},{\"networkAclAssociationId\":\"aclassoc-b9b81bc7\",\"networkAclId\":\"acl-d23888ab\",\"subnetId\":\"subnet-e8ad18b2\"}]",
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "acl-d23888ab",
            "awsRegion": "eu-west-1",
            "configuration": "{\"associations\":[{\"networkAclAssociationId\":\"aclassoc-bbb81bc5\",\"networkAclId\":\"acl-d23888ab\",\"subnetId\":\"subnet-1ddeb67b\"},{\"networkAclAssociationId\":\"aclassoc-b8b81bc6\",\"networkAclId\":\"acl-d23888ab\",\"subnetId\":\"subnet-34bcc77c\"},{\"networkAclAssociationId\":\"aclassoc-b9b81bc7\",\"networkAclId\":\"acl-d23888ab\",\"subnetId\":\"subnet-e8ad18b2\"}],\"entries\":[{\"cidrBlock\":\"0.0.0.0/0\",\"egress\":true,\"icmpTypeCode\":null,\"ipv6CidrBlock\":null,\"portRange\":null,\"protocol\":\"-1\",\"ruleAction\":\"allow\",\"ruleNumber\":100},{\"cidrBlock\":\"0.0.0.0/0\",\"egress\":true,\"icmpTypeCode\":null,\"ipv6CidrBlock\":null,\"portRange\":null,\"protocol\":\"-1\",\"ruleAction\":\"deny\",\"ruleNumber\":32767},{\"cidrBlock\":\"0.0.0.0/0\",\"egress\":false,\"icmpTypeCode\":null,\"ipv6CidrBlock\":null,\"portRange\":null,\"protocol\":\"-1\",\"ruleAction\":\"allow\",\"ruleNumber\":100},{\"cidrBlock\":\"0.0.0.0/0\",\"egress\":false,\"icmpTypeCode\":null,\"ipv6CidrBlock\":null,\"portRange\":null,\"protocol\":\"-1\",\"ruleAction\":\"deny\",\"ruleNumber\":32767}],\"isDefault\":true,\"networkAclId\":\"acl-d23888ab\",\"tags\":[],\"vpcId\":\"vpc-08300e6e\",\"ownerId\":\"XXXXXXXXXXXX\"}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "title": "acl-d23888ab",
            "availabilityZone": "Multiple Availability Zones",
            "configurationItemCaptureTime": "2019-04-29T16:36:14.151Z",
            "version": "1.3",
            "tags": "{}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#acls:sort=networkAclId",
            "configurationStateId": "1568013759536",
            "accountId": "XXXXXXXXXXXX",
            "isDefault": "true",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#acls:sort=networkAclId",
            "vpcId": "vpc-08300e6e",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:network-acl/acl-d23888ab",
            "resourceType": "AWS::EC2::NetworkAcl"
        }
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#acls:sort=networkAclId',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#acls:sort=networkAclId'
    }
    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for InternetGateways', async () => {
    const data = {
        "id": "6e6d60248d2ae79372722b5da7768766",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "igw-0c99ea2e4c2756e21",
            "awsRegion": "eu-west-1",
            "configuration": "{\"attachments\":[{\"state\":\"available\",\"vpcId\":\"vpc-0e10109041c39ad16\"}],\"internetGatewayId\":\"igw-0c99ea2e4c2756e21\",\"ownerId\":\"XXXXXXXXXXXX\",\"tags\":[{\"key\":\"ServiceNameTag\",\"value\":\"zoom\"},{\"key\":\"Application\",\"value\":\"zoom-platform-dev-VpcStack-1J8UZZR2JWNHK\"},{\"key\":\"aws:cloudformation:logical-id\",\"value\":\"InternetGateway\"},{\"key\":\"aws:cloudformation:stack-id\",\"value\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-VpcStack-1J8UZZR2JWNHK/d32c8560-bda3-11e9-8712-0a1f01fad44c\"},{\"key\":\"aws:cloudformation:stack-name\",\"value\":\"zoom-platform-dev-VpcStack-1J8UZZR2JWNHK\"},{\"key\":\"Environment\",\"value\":\"dev\"},{\"key\":\"Network\",\"value\":\"Public\"},{\"key\":\"Name\",\"value\":\"zoom-dev-IGW\"}]}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "title": "igw-0c99ea2e4c2756e21",
            "availabilityZone": "Multiple Availability Zones",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-08-13T08:27:21.283Z",
            "tags": "{\"Application\":\"zoom-platform-dev-VpcStack-1J8UZZR2JWNHK\",\"Environment\":\"dev\",\"Name\":\"zoom-dev-IGW\",\"Network\":\"Public\",\"ServiceNameTag\":\"zoom\",\"aws:cloudformation:logical-id\":\"InternetGateway\",\"aws:cloudformation:stack-id\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-VpcStack-1J8UZZR2JWNHK/d32c8560-bda3-11e9-8712-0a1f01fad44c\",\"aws:cloudformation:stack-name\":\"zoom-platform-dev-VpcStack-1J8UZZR2JWNHK\"}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#igws:sort=internetGatewayId",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568013759175",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#igws:sort=internetGatewayId",
            "vpcId": "vpc-0e10109041c39ad16",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:internet-gateway/igw-0c99ea2e4c2756e21",
            "resourceType": "AWS::EC2::InternetGateway"
        },
        "parent": true,
        "label": "AWS::EC2::InternetGateway"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/vpc?region=eu-west-1#igws:sort=internetGatewayId',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/vpc/v2/home?region=eu-west-1#igws:sort=internetGatewayId'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for IAM user', async () => {
    const data = {
        "id": "569af2c9a48628d9d4ee82d1da4411be",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "AIDA5XIWUT3PVB5FUUKYT",
            "awsRegion": "global",
            "configuration": "{\"path\":\"/\",\"userName\":\"danmacklin\",\"userId\":\"AIDA5XIWUT3PVB5FUUKYT\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:user/danmacklin\",\"createDate\":\"2019-05-07T12:05:12.000Z\",\"userPolicyList\":[],\"groupList\":[\"admins\"],\"attachedManagedPolicies\":[{\"policyName\":\"IAMUserChangePassword\",\"policyArn\":\"arn:aws:iam::aws:policy/IAMUserChangePassword\"}],\"permissionsBoundary\":null,\"tags\":[]}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "resourceName": "danmacklin",
            "title": "danmacklin",
            "availabilityZone": "Not Applicable",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-05-13T12:43:55.163Z",
            "tags": "{}",
            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/users",
            "path": "/",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568006571018",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/users",
            "relatedEvents": "[]",
            "arn": "arn:aws:iam::XXXXXXXXXXXX:user/danmacklin",
            "resourceCreationTime": "2019-05-07T12:05:12.000Z",
            "resourceType": "AWS::IAM::User"
        },
        "parent": true,
        "label": "AWS::IAM::User"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?home?#/users',
        loggedInURL: 'https://console.aws.amazon.com/iam/home?#/users'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for IAM role', async () => {
    const data = {
        "id": "930d549d5ed69f255cf21555ffb6b8c1",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "AROA5XIWUT3P6QO6KNL2D",
            "awsRegion": "global",
            "configuration": "{\"path\":\"/service-role/\",\"roleName\":\"AWSCodePipelineServiceRole-eu-west-1-zoom-discovery\",\"roleId\":\"AROA5XIWUT3P6QO6KNL2D\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:role/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery\",\"createDate\":\"2019-05-17T15:20:49.000Z\",\"assumeRolePolicyDocument\":\"%7B%22Version%22%3A%222012-10-17%22%2C%22Statement%22%3A%5B%7B%22Effect%22%3A%22Allow%22%2C%22Principal%22%3A%7B%22Service%22%3A%22codepipeline.amazonaws.com%22%7D%2C%22Action%22%3A%22sts%3AAssumeRole%22%7D%5D%7D\",\"instanceProfileList\":[],\"rolePolicyList\":[],\"attachedManagedPolicies\":[{\"policyName\":\"AWSCodePipelineServiceRole-eu-west-1-zoom-discovery\",\"policyArn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery\"}],\"permissionsBoundary\":null,\"tags\":[]}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "resourceName": "AWSCodePipelineServiceRole-eu-west-1-zoom-discovery",
            "title": "AWSCodePipelineServiceRole-eu-west-1-zoom-discovery",
            "availabilityZone": "Not Applicable",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-05-17T15:31:56.736Z",
            "tags": "{}",
            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/roles",
            "path": "/service-role/",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568006564547",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/roles",
            "relatedEvents": "[]",
            "arn": "arn:aws:iam::XXXXXXXXXXXX:role/service-role/AWSCodePipelineServiceRole-eu-west-1-zoom-discovery",
            "resourceCreationTime": "2019-05-17T15:20:49.000Z",
            "resourceType": "AWS::IAM::Role"
        },
        "parent": true,
        "label": "AWS::IAM::Role"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?home?#/roles',
        loggedInURL: 'https://console.aws.amazon.com/iam/home?#/roles'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for IAM policy', async () => {
    const data = {
        "id": "49d243d82b99b1e6ac8ea986816e7068",
        "properties": {
            "configurationItemStatus": "OK",
            "resourceId": "ANPA5XIWUT3P4VOIWQQEW",
            "awsRegion": "global",
            "configuration": "{\"policyName\":\"CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1\",\"policyId\":\"ANPA5XIWUT3P4VOIWQQEW\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1\",\"path\":\"/service-role/\",\"defaultVersionId\":\"v1\",\"attachmentCount\":0,\"permissionsBoundaryUsageCount\":0,\"isAttachable\":true,\"description\":null,\"createDate\":\"2019-08-21T09:38:11.000Z\",\"updateDate\":\"2019-08-21T09:38:11.000Z\",\"policyVersionList\":[{\"document\":\"%7B%0A%20%20%20%20%22Version%22%3A%20%222012-10-17%22%2C%0A%20%20%20%20%22Statement%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui-codepipeline%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Alogs%3Aeu-west-1%3AXXXXXXXXXXXX%3Alog-group%3A%2Faws%2Fcodebuild%2Fzoom-ui-codepipeline%3A%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogGroup%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3ACreateLogStream%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22logs%3APutLogEvents%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Acodepipeline-eu-west-1-%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetObjectVersion%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3Acodecommit%3Aeu-west-1%3AXXXXXXXXXXXX%3Azoom-ui%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22codecommit%3AGitPull%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Effect%22%3A%20%22Allow%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Resource%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui-build-artifacts%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22arn%3Aaws%3As3%3A%3A%3Azoom-ui-build-artifacts%2F%2A%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%22Action%22%3A%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3APutObject%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketAcl%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%22s3%3AGetBucketLocation%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%5D%0A%7D\",\"versionId\":\"v1\",\"isDefaultVersion\":true,\"createDate\":\"2019-08-21T09:38:11.000Z\"}]}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "description": "null",
            "resourceName": "CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1",
            "title": "CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1",
            "availabilityZone": "Not Applicable",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-08-22T05:22:41.164Z",
            "tags": "{}",
            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/policy",
            "path": "/service-role/",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568006558680",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/policy",
            "relatedEvents": "[]",
            "arn": "arn:aws:iam::XXXXXXXXXXXX:policy/service-role/CodeBuildBasePolicy-zoom-ui-codepipeline-eu-west-1",
            "resourceCreationTime": "2019-08-21T09:38:11.000Z",
            "resourceType": "AWS::IAM::Policy"
        },
        "parent": true,
        "label": "AWS::IAM::Policy"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?home?#/policies',
        loggedInURL: 'https://console.aws.amazon.com/iam/home?#/policies'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for IAM group', async () => {
    const data = {
        "id": "76b8f53786deb3cb58366bf250d4d9c6",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "AGPA5XIWUT3P7PSXQFU4P",
            "awsRegion": "global",
            "configuration": "{\"path\":\"/\",\"groupName\":\"CoCoMi\",\"groupId\":\"AGPA5XIWUT3P7PSXQFU4P\",\"arn\":\"arn:aws:iam::XXXXXXXXXXXX:group/CoCoMi\",\"createDate\":\"2019-05-23T12:53:14.000Z\",\"groupPolicyList\":[],\"attachedManagedPolicies\":[{\"policyName\":\"AWSCodeCommitPowerUser\",\"policyArn\":\"arn:aws:iam::aws:policy/AWSCodeCommitPowerUser\"}]}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "resourceName": "CoCoMi",
            "title": "CoCoMi",
            "availabilityZone": "Not Applicable",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-05-23T13:06:58.939Z",
            "tags": "{}",
            "loggedInURL": "https://.console.aws.amazon.com/iam/v2/home?region=#/groups",
            "path": "/",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568006558017",
            "groupName": "CoCoMi",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?region=#/groups",
            "relatedEvents": "[]",
            "arn": "arn:aws:iam::XXXXXXXXXXXX:group/CoCoMi",
            "resourceCreationTime": "2019-05-23T12:53:14.000Z",
            "resourceType": "AWS::IAM::Group"
        },
        "parent": true,
        "label": "AWS::IAM::Group"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/iam?home?#/groups',
        loggedInURL: 'https://console.aws.amazon.com/iam/home?#/groups'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for Loadbalancer', async () => {
    const data = {
        "id": "e6a3c557e6c59f3632da2c0302cb94f0",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:loadbalancer/net/ecs-spot-test-lb/e2b774a66858773d",
            "awsRegion": "eu-west-1",
            "configuration": "{\"loadBalancerArn\":\"arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:loadbalancer/net/ecs-spot-test-lb/e2b774a66858773d\",\"dNSName\":\"ecs-spot-test-lb-e2b774a66858773d.elb.eu-west-1.amazonaws.com\",\"canonicalHostedZoneId\":\"Z2IFOLAFXWLO4F\",\"createdTime\":\"2019-08-29T13:10:27.595Z\",\"loadBalancerName\":\"ecs-spot-test-lb\",\"scheme\":\"internet-facing\",\"vpcId\":\"vpc-0548321a50e70e720\",\"state\":{\"code\":\"active\",\"reason\":null},\"type\":\"network\",\"availabilityZones\":[{\"zoneName\":\"eu-west-1b\",\"subnetId\":\"subnet-0bfa3aa9767d523df\",\"loadBalancerAddresses\":[]},{\"zoneName\":\"eu-west-1a\",\"subnetId\":\"subnet-030b38057302520b3\",\"loadBalancerAddresses\":[]}],\"securityGroups\":[],\"ipAddressType\":\"ipv4\"}",
            "supplementaryConfiguration": "{\"LoadBalancerAttributes\":\"[{\\\"key\\\":\\\"access_logs.s3.enabled\\\",\\\"value\\\":\\\"false\\\"},{\\\"key\\\":\\\"load_balancing.cross_zone.enabled\\\",\\\"value\\\":\\\"false\\\"},{\\\"key\\\":\\\"access_logs.s3.prefix\\\",\\\"value\\\":\\\"\\\"},{\\\"key\\\":\\\"deletion_protection.enabled\\\",\\\"value\\\":\\\"false\\\"},{\\\"key\\\":\\\"access_logs.s3.bucket\\\",\\\"value\\\":\\\"\\\"}]\",\"Tags\":\"[]\"}",
            "configurationItemMD5Hash": "",
            "resourceName": "ecs-spot-test-lb",
            "type": "network",
            "title": "ecs-spot-test-lb",
            "availabilityZone": "Multiple Availability Zones",
            "configurationItemCaptureTime": "2019-08-29T13:12:40.296Z",
            "version": "1.3",
            "tags": "{}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#LoadBalancers:",
            "configurationStateId": "1567992158060",
            "accountId": "XXXXXXXXXXXX",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#LoadBalancers:",
            "vpcId": "vpc-0548321a50e70e720",
            "relatedEvents": "[]",
            "state": "{\"code\":\"active\",\"reason\":null}",
            "arn": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:loadbalancer/net/ecs-spot-test-lb/e2b774a66858773d",
            "resourceCreationTime": "2019-08-29T13:10:27.595Z",
            "resourceType": "AWS::ElasticLoadBalancingV2::LoadBalancer"
        },
        "parent": true,
        "label": "AWS::ElasticLoadBalancingV2::LoadBalancer"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#LoadBalancers:',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#LoadBalancers:'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for Loadbalancer Target Group', async () => {
    const data = {
        "id": "23b38faa46f0982aa3619a1c17a75e3d",
        "properties": {
            "accountId": "XXXXXXXXXXXX",
            "resourceId": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:targetgroup/ECS-TG/41f906d79f33a9f1",
            "awsRegion": "eu-west-1",
            "defaultActionType": "forward",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#TargetGroups:",
            "title": "targetgroup/ECS-TG/41f906d79f33a9f1",
            "arn": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:targetgroup/ECS-TG/41f906d79f33a9f1",
            "resourceType": "AWS::ElasticLoadBalancingV2::TargetGroup",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#TargetGroups:"
        },
        "parent": true,
        "label": "AWS::ElasticLoadBalancingV2::TargetGroup"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#TargetGroups:',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#TargetGroups:'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for Loadbalancer Target', async () => {
    const data = {
        "id": "23b38faa46f0982aa3619a1c17a75e3d",
        "properties": {
            "accountId": "XXXXXXXXXXXX",
            "resourceId": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:targetgroup/ECS-TG/41f906d79f33a9f1",
            "awsRegion": "eu-west-1",
            "defaultActionType": "forward",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#TargetGroups:",
            "title": "targetgroup/ECS-TG/41f906d79f33a9f1",
            "arn": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:targetgroup/ECS-TG/41f906d79f33a9f1",
            "resourceType": "AWS::ElasticLoadBalancingV2::TargetGroup",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#TargetGroups:"
        },
        "parent": true,
        "label": "AWS::ElasticLoadBalancingV2::TargetGroup"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#TargetGroups:',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#TargetGroups:'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for LoadBalancer listener', async () => {
    const data = {
        "id": "21a55b08f72a4c87435388cc1cc22b14",
        "properties": {
            "temporary": "{\"defaultActions\":[{\"Type\":\"forward\",\"TargetGroupArn\":\"arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:targetgroup/ECS-TG/41f906d79f33a9f1\"}]}",
            "accountId": "XXXXXXXXXXXX",
            "protocol": "TCP",
            "resourceId": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:listener/net/ecs-spot-test-lb/e2b774a66858773d/566265e1e4de45e5",
            "awsRegion": "eu-west-1",
            "port": "80",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#LoadBalancers:",
            "title": "listener/net/ecs-spot-test-lb/e2b774a66858773d/566265e1e4de45e5",
            "arn": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:listener/net/ecs-spot-test-lb/e2b774a66858773d/566265e1e4de45e5",
            "resourceType": "AWS::ElasticLoadBalancingV2::Listener",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#LoadBalancers:"
        },
        "parent": true,
        "label": "AWS::ElasticLoadBalancingV2::Listener"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#LoadBalancers:',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#LoadBalancers:'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for Loadbalancer Target', async () => {
    const data = {
        "id": "23b38faa46f0982aa3619a1c17a75e3d",
        "properties": {
            "accountId": "XXXXXXXXXXXX",
            "resourceId": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:targetgroup/ECS-TG/41f906d79f33a9f1",
            "awsRegion": "eu-west-1",
            "defaultActionType": "forward",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#TargetGroups:",
            "title": "targetgroup/ECS-TG/41f906d79f33a9f1",
            "arn": "arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:targetgroup/ECS-TG/41f906d79f33a9f1",
            "resourceType": "AWS::ElasticLoadBalancingV2::TargetGroup",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#TargetGroups:"
        },
        "parent": true,
        "label": "AWS::ElasticLoadBalancingV2::TargetGroup"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#TargetGroups:',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#TargetGroups:'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for an EIP', async () => {
    const data = {
        "id": "4f27268e0f2cc8df801daf92bcefbb0a",
        "properties": {
            "networkInterfaceId": "eni-080a8989f0c991578",
            "configurationItemStatus": "OK",
            "awsRegion": "eu-west-1",
            "resourceId": "eipalloc-0961e5bd0f95b9709",
            "configuration": "{\"instanceId\":null,\"publicIp\":\"52.215.173.84\",\"allocationId\":\"eipalloc-0961e5bd0f95b9709\",\"associationId\":\"eipassoc-079a4d6613984a783\",\"domain\":\"vpc\",\"networkInterfaceId\":\"eni-080a8989f0c991578\",\"networkInterfaceOwnerId\":\"XXXXXXXXXXXX\",\"privateIpAddress\":\"10.0.2.5\",\"tags\":[],\"publicIpv4Pool\":\"amazon\"}",
            "supplementaryConfiguration": "{}",
            "configurationItemMD5Hash": "",
            "resourceName": "52.215.173.84",
            "title": "eipalloc-0961e5bd0f95b9709",
            "availabilityZone": "Not Applicable",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-08-13T08:37:41.812Z",
            "privateIpAddress": "10.0.2.5",
            "tags": "{}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Addresses:sort=PublicIp",
            "configurationStateId": "1568013759669",
            "accountId": "XXXXXXXXXXXX",
            "instanceId": "null",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Addresses:sort=PublicIp",
            "vpcId": "vpc-0e10109041c39ad16",
            "relatedEvents": "[]",
            "arn": "arn:aws:ec2:eu-west-1:XXXXXXXXXXXX:eip-allocation/eipalloc-0961e5bd0f95b9709",
            "resourceType": "AWS::EC2::EIP"
        },
        "parent": true,
        "label": "AWS::EC2::EIP"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2?region=eu-west-1#Addresses:sort=PublicIp',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Addresses:sort=PublicIp'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for a lambda', async () => {
    const data = {
        "id": "eba016a1cd23664a83af6d79a552012b",
        "properties": {
            "configurationItemStatus": "OK",
            "resourceId": "gremlin",
            "awsRegion": "eu-west-1",
            "configuration": "{\"functionName\":\"gremlin\",\"functionArn\":\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin\",\"runtime\":\"nodejs8.10\",\"role\":\"arn:aws:iam::XXXXXXXXXXXX:role/ZoomAPILambdaRole\",\"handler\":\"index.handler\",\"codeSize\":3253420,\"description\":\"\",\"timeout\":10,\"memorySize\":256,\"lastModified\":\"2019-09-06T14:03:05.510+0000\",\"codeSha256\":\"aNQmbVDOjjVScI7kDdhdIw5re0RCFCHanYHPj+quSRo\\u003d\",\"version\":\"$LATEST\",\"vpcConfig\":{\"subnetIds\":[\"subnet-0306ddd2f189b4662\",\"subnet-0249d376da149810e\"],\"securityGroupIds\":[\"sg-0ae8a66e0af8fb1ce\"]},\"tracingConfig\":{\"mode\":\"PassThrough\"},\"revisionId\":\"d67de033-a78c-4aac-8fb0-c876bc1effe3\",\"layers\":[]}",
            "supplementaryConfiguration": "{\"Policy\":\"\\\"{\\\\\\\"Version\\\\\\\":\\\\\\\"2012-10-17\\\\\\\",\\\\\\\"Id\\\\\\\":\\\\\\\"default\\\\\\\",\\\\\\\"Statement\\\\\\\":[{\\\\\\\"Sid\\\\\\\":\\\\\\\"zoom-platform-dev-ClientAPIStack-1QOFDBA9U71MT-GatewayGremlinPermission-ACPIM7LVK8MM\\\\\\\",\\\\\\\"Effect\\\\\\\":\\\\\\\"Allow\\\\\\\",\\\\\\\"Principal\\\\\\\":{\\\\\\\"Service\\\\\\\":\\\\\\\"apigateway.amazonaws.com\\\\\\\"},\\\\\\\"Action\\\\\\\":\\\\\\\"lambda:invokeFunction\\\\\\\",\\\\\\\"Resource\\\\\\\":\\\\\\\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin\\\\\\\",\\\\\\\"Condition\\\\\\\":{\\\\\\\"ArnLike\\\\\\\":{\\\\\\\"AWS:SourceArn\\\\\\\":\\\\\\\"arn:aws:execute-api:eu-west-1:XXXXXXXXXXXX:dw2420u6l4/*\\\\\\\"}}},{\\\\\\\"Sid\\\\\\\":\\\\\\\"zoom-platform-dev-ServerAPIStack-12KVRCISB8ZU7-ServerGatewayGremlinPermission-D9IS7PH69B1J\\\\\\\",\\\\\\\"Effect\\\\\\\":\\\\\\\"Allow\\\\\\\",\\\\\\\"Principal\\\\\\\":{\\\\\\\"Service\\\\\\\":\\\\\\\"apigateway.amazonaws.com\\\\\\\"},\\\\\\\"Action\\\\\\\":\\\\\\\"lambda:invokeFunction\\\\\\\",\\\\\\\"Resource\\\\\\\":\\\\\\\"arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin\\\\\\\",\\\\\\\"Condition\\\\\\\":{\\\\\\\"ArnLike\\\\\\\":{\\\\\\\"AWS:SourceArn\\\\\\\":\\\\\\\"arn:aws:execute-api:eu-west-1:XXXXXXXXXXXX:bkf4l5t4vl/*\\\\\\\"}}}]}\\\"\",\"Tags\":\"{\\\"aws:cloudformation:stack-name\\\":\\\"zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ\\\",\\\"ServiceNameTag\\\":\\\"zoom\\\",\\\"aws:cloudformation:stack-id\\\":\\\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c\\\",\\\"Environment\\\":\\\"dev\\\",\\\"aws:cloudformation:logical-id\\\":\\\"Gremlin\\\"}\"}",
            "configurationItemMD5Hash": "",
            "description": "",
            "resourceName": "gremlin",
            "title": "gremlin",
            "availabilityZone": "Not Applicable",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-09-06T14:05:30.254Z",
            "tags": "{\"Environment\":\"dev\",\"ServiceNameTag\":\"zoom\",\"aws:cloudformation:logical-id\":\"Gremlin\",\"aws:cloudformation:stack-id\":\"arn:aws:cloudformation:eu-west-1:XXXXXXXXXXXX:stack/zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ/d23edf20-bda5-11e9-bbf6-0a3aaca2533c\",\"aws:cloudformation:stack-name\":\"zoom-platform-dev-LambdaStack-1B6Z3AFJETLAJ\"}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/gremlin?tab=graph",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1567952559150",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/gremlin?tab=graph",
            "relatedEvents": "[]",
            "arn": "arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:gremlin",
            "subnetIds": "[\"subnet-0306ddd2f189b4662\",\"subnet-0249d376da149810e\"]",
            "resourceType": "AWS::Lambda::Function"
        },
        "parent": true,
        "label": "AWS::Lambda::Function"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/lambda?region=eu-west-1#/functions/gremlin?tab=graph',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/lambda/home?region=eu-west-1#/functions/gremlin?tab=graph'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for an apiGateway RestAPI', async () => {
    const data = {
        "id": "3c4786e8f630945fb54e2dccf1320321",
        "properties": {
            "accountId": "XXXXXXXXXXXX",
            "resourceId": "an79vvn7bi",
            "awsRegion": "eu-west-1",
            "createdDate": "2019-05-10T13:14:47.000Z",
            "restApiId": "an79vvn7bi",
            "apiKeySource": "HEADER",
            "endpointConfiguration": "{\"types\":[\"EDGE\"]}",
            "name": "App API",
            "title": "an79vvn7bi",
            "resourceType": "AWS::ApiGateway::RestApi"
        },
        "parent": true,
        "label": "AWS::ApiGateway::RestApi"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/an79vvn7bi/resources',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/an79vvn7bi/resources'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for an apiGateway Resource', async () => {
    const data = {
        "id": "9752a3c5571fbf68e511de7b5822e3b1",
        "label": "AWS::ApiGateway::Resource",
        "properties": {
            "accountId": "XXXXXXXXXXXX",
            "path": "/getteam",
            "resourceId": "ta7x01",
            "awsRegion": "eu-west-1",
            "restApiId": "an79vvn7bi",
            "resourceMethods": "{\"GET\":{},\"OPTIONS\":{}}",
            "pathPart": "getteam",
            "title": "ta7x01",
            "parentId": "miu4mh1v7h",
            "resourceType": "AWS::ApiGateway::Resource"
        }
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/an79vvn7bi/resources/ta7x01',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/an79vvn7bi/resources/ta7x01'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for an apiGateway Method', async () => {
    const data = {
        "id": "69db127f8d3e3378c0eeb13ffe299a62",
        "properties": {
            "accountId": "XXXXXXXXXXXX",
            "passthroughBehavior": "WHEN_NO_MATCH",
            "resourceId": "an79vvn7bi_q0i5o9_POST",
            "awsRegion": "eu-west-1",
            "integrationResponses": "{\"200\":{\"statusCode\":\"200\",\"responseParameters\":{\"method.response.header.Access-Control-Allow-Headers\":\"'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'\",\"method.response.header.Access-Control-Allow-Methods\":\"'GET,POST,PUT,DELETE,OPTIONS'\",\"method.response.header.Access-Control-Allow-Origin\":\"'*'\"},\"responseTemplates\":{}}}",
            "httpMethod": "POST",
            "cacheNamespace": "q0i5o9",
            "type": "AWS",
            "title": "an79vvn7bi_q0i5o9_POST",
            "uri": "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:twobytwo-lambda-SentimentAnalysis-1M1MZWLJAZVYB/invocations",
            "timeoutInMillis": "29000",
            "resourceType": "AWS::ApiGateway::Method"
        },
        "parent": true,
        "label": "AWS::ApiGateway::Method"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        loginURL: 'https://XXXXXXXXXXXX.signin.aws.amazon.com/console/apigateway?region=eu-west-1#/apis/an79vvn7bi/resources/q0i5o9/methods/POST',
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/apigateway/home?region=eu-west-1#/apis/an79vvn7bi/resources/q0i5o9/methods/POST'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should create consoleURLs for an autoscalingGroup', async () => {
    const data = {
        "id": "471b0b29b0f63271bf4cefc889fe5ebd",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "arn:aws:autoscaling:eu-west-1:XXXXXXXXXXXX:autoScalingGroup:ef194843-edb2-4178-9e0f-72cb6372f6f8:autoScalingGroupName/zoom-ec2-autoscaling-group",
            "awsRegion": "eu-west-1",
            "configuration": "{\"autoScalingGroupName\":\"zoom-ec2-autoscaling-group\",\"autoScalingGroupARN\":\"arn:aws:autoscaling:eu-west-1:XXXXXXXXXXXX:autoScalingGroup:ef194843-edb2-4178-9e0f-72cb6372f6f8:autoScalingGroupName/zoom-ec2-autoscaling-group\",\"launchTemplate\":{\"launchTemplateId\":\"lt-0830dea6c9ddc9df7\",\"launchTemplateName\":\"zoom_ec2\",\"version\":\"1\"},\"minSize\":3,\"maxSize\":3,\"desiredCapacity\":3,\"defaultCooldown\":300,\"availabilityZones\":[\"eu-west-1b\",\"eu-west-1c\",\"eu-west-1a\"],\"loadBalancerNames\":[],\"targetGroupARNs\":[\"arn:aws:elasticloadbalancing:eu-west-1:XXXXXXXXXXXX:targetgroup/zoom-autoscaling-group/d9ecda8f22aa0148\"],\"healthCheckType\":\"EC2\",\"healthCheckGracePeriod\":300,\"instances\":[{\"instanceId\":\"i-002116909acb586f3\",\"availabilityZone\":\"eu-west-1c\",\"lifecycleState\":\"InService\",\"healthStatus\":\"Healthy\",\"launchTemplate\":{\"launchTemplateId\":\"lt-0830dea6c9ddc9df7\",\"launchTemplateName\":\"zoom_ec2\",\"version\":\"1\"},\"protectedFromScaleIn\":false},{\"instanceId\":\"i-04734a50a8c494e15\",\"availabilityZone\":\"eu-west-1a\",\"lifecycleState\":\"InService\",\"healthStatus\":\"Healthy\",\"launchTemplate\":{\"launchTemplateId\":\"lt-0830dea6c9ddc9df7\",\"launchTemplateName\":\"zoom_ec2\",\"version\":\"1\"},\"protectedFromScaleIn\":false},{\"instanceId\":\"i-0c3027efe7469cebf\",\"availabilityZone\":\"eu-west-1b\",\"lifecycleState\":\"InService\",\"healthStatus\":\"Healthy\",\"launchTemplate\":{\"launchTemplateId\":\"lt-0830dea6c9ddc9df7\",\"launchTemplateName\":\"zoom_ec2\",\"version\":\"1\"},\"protectedFromScaleIn\":false}],\"createdTime\":1558686277512,\"suspendedProcesses\":[],\"enabledMetrics\":[],\"tags\":[{\"resourceId\":\"zoom-ec2-autoscaling-group\",\"resourceType\":\"auto-scaling-group\",\"key\":\"Name\",\"value\":\"Zoom-autoscaling-group\",\"propagateAtLaunch\":true}],\"terminationPolicies\":[\"Default\"],\"newInstancesProtectedFromScaleIn\":false,\"serviceLinkedRoleARN\":\"arn:aws:iam::XXXXXXXXXXXX:role/aws-service-role/autoscaling.amazonaws.com/AWSServiceRoleForAutoScaling\",\"vpczoneIdentifier\":\"subnet-34bcc77c,subnet-e8ad18b2,subnet-1ddeb67b\"}",
            "supplementaryConfiguration": "{\"LifeCycleHooks\":\"[]\"}",
            "configurationItemMD5Hash": "",
            "resourceName": "zoom-ec2-autoscaling-group",
            "title": "zoom-ec2-autoscaling-group",
            "availabilityZone": "Multiple Availability Zones",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-05-24T08:26:28.848Z",
            "tags": "{\"Name\":\"Zoom-autoscaling-group\"}",
            "loggedInURL": "https://eu-west-1.console.aws.amazon.com/ec2/autoscaling/home?region=eu-west-1#AutoScalingGroups:id=u;view=details",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568006558169",
            "loginURL": "https://XXXXXXXXXXXX.signin.aws.amazon.com/console/ec2/autoscaling/home?region=eu-west-1#AutoScalingGroups:id=u;view=details",
            "relatedEvents": "[]",
            "arn": "arn:aws:autoscaling:eu-west-1:XXXXXXXXXXXX:autoScalingGroup:ef194843-edb2-4178-9e0f-72cb6372f6f8:autoScalingGroupName/zoom-ec2-autoscaling-group",
            "resourceCreationTime": "2019-05-24T08:24:37.512Z",
            "resourceType": "AWS::AutoScaling::AutoScalingGroup"
        },
        "parent": true,
        "label": "AWS::AutoScaling::AutoScalingGroup"
    };

    let ans = url.getConsoleURLs(data);

    let expected = {
        undefined: undefined,
        loggedInURL: 'https://eu-west-1.console.aws.amazon.com/ec2/autoscaling/home?region=eu-west-1#AutoScalingGroups:id=zoom-ec2-autoscaling-group;view=details'
    };

    expect(ans).to.deep.equal(expected);
});

it('Should call for an unknown resourceType', async () => {
    const s3Data = {
        "id": "72496494bcc125232897c71ec742e286",
        "properties": {
            "configurationItemStatus": "ResourceDiscovered",
            "resourceId": "zoom-api-bucket",
            "awsRegion": "eu-west-1",
            "configuration": "{\"name\":\"zoom-api-bucket\",\"owner\":{\"displayName\":null,\"id\":\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\"},\"creationDate\":\"2019-06-24T12:22:37.000Z\"}",
            "supplementaryConfiguration": "{\"AccessControlList\":\"\\\"{\\\\\\\"grantSet\\\\\\\":null,\\\\\\\"grantList\\\\\\\":[{\\\\\\\"grantee\\\\\\\":{\\\\\\\"id\\\\\\\":\\\\\\\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\\\\\\\",\\\\\\\"displayName\\\\\\\":null},\\\\\\\"permission\\\\\\\":\\\\\\\"FullControl\\\\\\\"}],\\\\\\\"owner\\\\\\\":{\\\\\\\"displayName\\\\\\\":null,\\\\\\\"id\\\\\\\":\\\\\\\"cdc98e52b531907c0dc603986cfa5197f7708056c08e9f701d164d48b54f5d18\\\\\\\"},\\\\\\\"isRequesterCharged\\\\\\\":false}\\\"\",\"BucketAccelerateConfiguration\":\"{\\\"status\\\":null}\",\"BucketLoggingConfiguration\":\"{\\\"destinationBucketName\\\":null,\\\"logFilePrefix\\\":null}\",\"BucketNotificationConfiguration\":\"{\\\"configurations\\\":{}}\",\"BucketPolicy\":\"{\\\"policyText\\\":null}\",\"BucketVersioningConfiguration\":\"{\\\"status\\\":\\\"Off\\\",\\\"isMfaDeleteEnabled\\\":null}\",\"IsRequesterPaysEnabled\":\"false\",\"PublicAccessBlockConfiguration\":\"{\\\"blockPublicAcls\\\":true,\\\"ignorePublicAcls\\\":true,\\\"blockPublicPolicy\\\":true,\\\"restrictPublicBuckets\\\":true}\"}",
            "configurationItemMD5Hash": "",
            "resourceName": "zoom-api-bucket",
            "title": "zoom-api-bucket",
            "availabilityZone": "Regional",
            "version": "1.3",
            "configurationItemCaptureTime": "2019-06-24T12:24:45.288Z",
            "tags": "{}",
            "accountId": "XXXXXXXXXXXX",
            "configurationStateId": "1568010164412",
            "relatedEvents": "[]",
            "name": "zoom-api-bucket",
            "arn": "arn:aws:s3:::zoom-api-bucket",
            "resourceCreationTime": "2019-06-24T12:22:37.000Z",
            "resourceType": "AWS::S3::Buckets"
        },
        "label": "AWS::S3::Buckets"
    };

    let ans = url.getConsoleURLs(s3Data);
    let expected = { undefined, undefined };

    expect(ans).to.deep.equal(expected);
});

