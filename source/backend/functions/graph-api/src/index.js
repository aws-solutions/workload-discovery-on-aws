const gremlin = require('gremlin');
const R = require('ramda');
const __ = gremlin.process.statics;
const {createHierarchy} = require('./hierarchy');
const {run} = require('./query')(process.env);

const resourceTypes = new Set(['AWS::EC2::Instance', 'AWS::RDS::DBInstance',
    'AWS::IAM::IAMCustomerManagedPolicyStatement', 'AWS::ApiGateway::Method']);

const isPrivateSubnet =  id => async g => {
    let linked = await g.V(id).both().has('resourceType', 'AWS::EC2::RouteTable').both().has('resourceType', 'AWS::EC2::NatGateway').toList();
    return linked.length > 0;
}

function createProperties({resourceName, resourceValue, resourceType, tags, arn, awsRegion, subnetId,
                              state, loggedInURL, loginURL, accountId, title, softDelete, private,
                              resourceId, configuration, availabilityZone, vpcId, ...rest}) {
    return {
        resourceName,
        resourceValue,
        resourceType,
        resourceId,
        tags,
        arn,
        awsRegion,
        availabilityZone,
        vpcId,
        subnetId,
        state,
        loggedInURL,
        loginURL,
        accountId,
        title,
        softDelete,
        private,
        __typename: resourceTypes.has(resourceType) ?
            resourceType.replace('AWS::', '').replace('::', '') : 'ResourceProperties',
        configuration: configuration ?? JSON.stringify(rest)
    }
}

function getNodes({id: vId, arn}) {
    return async g => {
        const start = vId == null ? g.V().has('arn', arn) : g.V(vId);

        const nodes = await start
            .or(__.hasNot("softDelete"), __.hasNot('softDeleteType'))
            .optional(__.both().or(__.hasNot("softDelete"), __.hasNot('softDeleteType')))
            .path()
            .by(__.elementMap())
            .unfold()
            .dedup()
            .toList();

        return Promise.resolve(nodes)
            .then(R.reduce((acc, {label, vpcId, subnetId, resourceType}) => {
                const networkTypes = ['AWS::EC2::VPC', 'AWS::EC2::Subnet'];
                const [vpcType, subnetType] = networkTypes;

                const present = networkTypes.includes(resourceType);

                switch (resourceType) {
                    case vpcType:
                        acc[vpcId] = {propName: 'vpcId', label, present};
                        break;
                    case subnetType:
                        acc[subnetId] = {propName: 'subnetId', label, present}
                        break;
                    default:
                        if (vpcId != null && acc[vpcId] == null) {
                            acc[vpcId] = {propName: 'vpcId', label: vpcType.replace(/::/g, '_'), present};
                        }
                        if (subnetId != null && acc[subnetId] == null) {
                            acc[subnetId] = {propName: 'subnetId', label: subnetType.replace(/::/g, '_'), present};
                        }
                }

                return acc;
            }, {}))
            .then(Object.entries)
            .then(R.reject(([_, {present}]) => present))
            .then(R.map(([id, {propName, label}]) => {
                return g.V().has(propName, id).hasLabel(label).or(__.hasNot("softDelete"), __.hasNot('softDeleteType')).elementMap().next().then(x => x.value)
            }))
            .then(ps => Promise.all(ps))
            .then(xs => [xs, nodes])
            .then(R.chain(R.map(async ({id, label, perspectiveBirthDate, ...props}) => {
                if(props.resourceType === 'AWS::EC2::Subnet') {
                    props.private = await run(isPrivateSubnet(id));
                }
                return {
                    id, label: label.replace(/_/g, '::'), parent: vId === id, perspectiveBirthDate, properties: createProperties(props)
                };
            })))
            .then(ps => Promise.all(ps));
    };
}

const isHash = R.test(/^[a-f0-9]{32}$/);

const isArn = R.test(/arn:(aws|aws-cn|aws-us-gov|aws-iso|aws-iso-b):.*/);

exports.handler = async event => {
    const args = event.arguments;
    console.log(JSON.stringify(args));
    switch (event.info.fieldName) {
        case 'getLinkedNodesHierarchy':
            if(args.id == null && args.arn == null) throw new Error('You must specify either an id or arn parameter.');
            if(args.id != null && !isHash(args.id)) throw new Error('The id parameter must be a valid md5 hash.');
            if(args.arn != null && !isArn(args.arn)) throw new Error('The arn parameter must be a valid ARN.');
            return run(getNodes(args)).then(createHierarchy).then(R.head);
        default:
            return Promise.reject(new Error(`Unknown field, unable to resolve ${event.info.fieldName}.`));
    }
}