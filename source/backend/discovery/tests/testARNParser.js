const chai = require('chai');
const ARNParser = require('../src/discovery/arnParser');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should parse arn:partition:service:region:account-id:resourcetype:resource:qualifier', async () => {
    let parsed = ARNParser.storeParse("arn:partition:service:region:account-id:resourcetype:resource:qualifier");

    let expected = {
        partition: 'partition',
        service: 'service',
        region: 'region',
        accountId: 'account-id',
        resourceType: 'resourcetype',
        resource: 'resource',
        qualifier: 'qualifier'
    };

    expect(parsed).to.deep.equal(expected);
});

it('Should parse arn:partition:service:region:account-id:resourcetype:resource', async () => {
    let parsed = ARNParser.storeParse("arn:partition:service:region:account-id:resourcetype:resource");

    let expected = {
        partition: 'partition',
        service: 'service',
        region: 'region',
        accountId: 'account-id',
        resourceType: 'resourcetype',
        resource: 'resource',
        qualifier: ''
    };

    expect(parsed).to.deep.equal(expected);
});

it('Should parse arn:partition:service:region:account-id:resourcetype/resource:qualifier', async () => {
    let parsed = ARNParser.storeParse("arn:partition:service:region:account-id:resourcetype/resource:qualifier");

    let expected = {
        partition: 'partition',
        service: 'service',
        region: 'region',
        accountId: 'account-id',
        resourceType: 'resourcetype',
        resource: 'resource',
        qualifier: 'qualifier'
    };

    expect(parsed).to.deep.equal(expected);
});


it('Should parse arn:partition:service:region:account-id:resourcetype/resource/qualifier', async () => {
    let parsed = ARNParser.storeParse("arn:partition:service:region:account-id:resourcetype/resource/qualifier");

    let expected = {
        partition: 'partition',
        service: 'service',
        region: 'region',
        accountId: 'account-id',
        resourceType: 'resourcetype',
        resource: 'resource',
        qualifier: 'qualifier'
    };

    expect(parsed).to.deep.equal(expected);
});

it('Should parse arn:partition:service:region:account-id:resourcetype/resource', async () => {
    let parsed = ARNParser.storeParse("arn:partition:service:region:account-id:resourcetype/resource");

    let expected = {
        partition: 'partition',
        service: 'service',
        region: 'region',
        accountId: 'account-id',
        resourceType: 'resourcetype',
        resource: 'resource',
        qualifier: ''
    };

    expect(parsed).to.deep.equal(expected);
});

it('Should parse arn:aws:s3:::zoom-discovery-bucket-aws-2/*"', async () => {
    let parsed = ARNParser.storeParse("arn:aws:s3:::zoom-discovery-bucket-aws-2/*");

    let expected = {
        partition: 'aws',
        service: 's3',
        region: '',
        accountId: '',
        resource: 'zoom-discovery-bucket-aws-2',
        qualifier: '*'
    }

    expect(parsed).to.deep.equal(expected);
});

it('Should parse arn:partition:service:region:account-id:resource', async () => {
    let parsed = ARNParser.storeParse("arn:partition:service:region:account-id:resource");

    let expected = {
        partition: 'partition',
        service: 'service',
        region: 'region',
        accountId: 'account-id',
        resourceType: '',
        resource: 'resource',
        qualifier: ''
    };

    expect(parsed).to.deep.equal(expected);
});

it('Should parse arn:aws:iam::*:role/ZoomDiscoveryRole', async () => {
    let parsed = ARNParser.storeParse("arn:aws:iam::*:role/ZoomDiscoveryRole");
    
    let expected = {
        partition: 'aws',
        service: 'iam',
        region: '',
        accountId: '*',
        resourceType: 'role',
        resource: 'ZoomDiscoveryRole',
        qualifier: ''
    }

    expect(parsed).to.deep.equal(expected);
});

it('Should parse arn:aws:logs:*', async () => {
    let parsed = ARNParser.storeParse("arn:aws:logs:*");

    let expected = {
        partition: 'aws',
        service: 'logs',
        region: '*',
        accountId: '',
        resourceType: '',
        resource: '',
        qualifier: ''
    };

    expect(parsed).to.deep.equal(expected);
});

it('Should build a query for arn arn:aws:s3:::zoom-discovery-bucket-aws-2/*', async () => {
    let query = ARNParser.createQuery("arn:aws:s3:::zoom-discovery-bucket-aws-2/*", "XXXXXXXXXXXX");

    let expected = {
        query:
        {
            bool:
            {
                must:
                    [{ term: { 'properties.parsedArn.partition.keyword': 'aws' } },
                    { term: { 'properties.parsedArn.service.keyword': 's3' } },
                    {
                        term:
                            { 'properties.parsedArn.resource.keyword': 'zoom-discovery-bucket-aws-2' }
                    },
                    { term: { 'properties.accountId.keyword': 'XXXXXXXXXXXX' } }]
            }
        }
    };

    expect(query).to.deep.equal(expected);
});

it('Should build a query for arn arn:aws:cognito-idp:eu-west-1:XXXXXXXXXXXX:userpool/eu-west-1_LAws8manr', async () => {
    let query = ARNParser.createQuery("arn:aws:cognito-idp:eu-west-1:XXXXXXXXXXXX:userpool/eu-west-1_LAws8manr", "XXXXXXXXXXXX");

    let expected = {
        query:
        {
            bool:
            {
                must:
                    [{ term: { 'properties.parsedArn.partition.keyword': 'aws' } },
                    { term: { 'properties.parsedArn.service.keyword': 'cognito-idp' } },
                    { term: { 'properties.parsedArn.region.keyword': 'eu-west-1' } },
                    { term: { 'properties.parsedArn.accountId.keyword': 'XXXXXXXXXXXX' } },
                    { term: { 'properties.parsedArn.resourceType.keyword': 'userpool' } },
                    {
                        term:
                            { 'properties.parsedArn.resource.keyword': 'eu-west-1_LAws8manr' }
                    },
                    { term: { 'properties.accountId.keyword': 'XXXXXXXXXXXX' } }]
            }
        }
    }

    expect(query).to.deep.equal(expected);
});

it('Should build a query for arn arn:aws:s3:::zoom-*', async () => {
    let query = ARNParser.createQuery("arn:aws:s3:::zoom-*", "XXXXXXXXXXXX");

    let expected =
    {
        query:
        {
            bool:
            {
                must:
                    [{ term: { 'properties.parsedArn.partition.keyword': 'aws' } },
                    { term: { 'properties.parsedArn.service.keyword': 's3' } },
                    { match_phrase_prefix: { 'properties.parsedArn.resource': 'zoom-*' } },
                    { term: { 'properties.accountId.keyword': 'XXXXXXXXXXXX' } }]
            }
        }
    }

    expect(query).to.deep.equal(expected);
});



