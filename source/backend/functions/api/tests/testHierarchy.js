const chai = require('chai');


const rewire = require("rewire");
const hierarchy = rewire("../src/hierarchy");
const buildHierarchy = hierarchy.__get__("buildHierarchy");
const buildObject = hierarchy.__get__("buildObject");
const createHierarchy = hierarchy.__get__("createHierarchy");
const filterDuplicates = hierarchy.__get__("filterDuplicates");
const buildNodeMap = hierarchy.__get__("buildNodeMap");
const translateHierarchy = hierarchy.__get__("translateHierarchy");

const { subnetInput, subnetHierarchyResult, subnetTransformBeforeFiltering, subnetTransformAfterFiltering } = require('./testHierarchySubnetData');
const { vpcInput } = require('./testHierarchyVPCData');
const { aclInput, aclHierarchyResult, aclTransformBeforeFiltering, aclTransformAfterFiltering } = require('./testHierarchyACLData');
const { vpcResourceInput, vpcResourceHierarchyResult, vpcTransformBeforeFiltering, vpcAfterFiltering } = require('./testHierarchyVPCResource');
const { routeInput, routeTableHierarchy, routeTableTransformBeforeFiltering, routeTableTransformAfterFiltering } = require('./testRouteTableData');
const { eniInput, eniHierarchy, eniTransformBeforeFiltering, eniTransformAfterFiltering } = require('./testHierarchyENI');

const util = require('util');

const expect = chai.expect;
const assert = chai.assert;
const should = require('chai').should();

it('Should build a hierarchy with the subnet data generated from a call to filterNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = buildHierarchy(subnetInput, nodeMap);
    expect(result).to.deep.equal(subnetHierarchyResult);
});

it('Should transform the subnet data generated from a call to filterNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = translateHierarchy(subnetHierarchyResult, ["account", "region", "vpc", "availabilityZone", "subnet", "type"], nodeMap, new Map());
    expect(result).to.deep.equal(subnetTransformBeforeFiltering);
});

it('Should filter the transformed subnet data generated from a call to filterNodesHierarchy', async () => {
    let result = filterDuplicates(subnetTransformBeforeFiltering, new Map());
    expect(result).to.deep.equal(subnetTransformAfterFiltering);
});

it('Should build a hierarchy with the acl data generated from a call to linkedNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = buildHierarchy(aclInput, nodeMap);
    expect(result).to.deep.equal(aclHierarchyResult);
});

it('Should transform the data from the acl', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = translateHierarchy(aclHierarchyResult, ["account", "region", "vpc", "availabilityZone", "subnet", "type"], nodeMap, new Map());
    expect(result).to.deep.equal(aclTransformBeforeFiltering);
});

it('Should filter the transformed data from the acl to get rid of duplicates', async () => {
    let result = filterDuplicates(aclTransformBeforeFiltering, new Map());
    expect(result).to.deep.equal(aclTransformAfterFiltering);
});

it('Should build a hierarchy for vpc88f1141 generated from a call to linkedNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = buildHierarchy(vpcResourceInput, nodeMap);
    expect(result).to.deep.equal(vpcResourceHierarchyResult);
});

it('Should transform a hierarchy for vpc88f1141 generated from a call to linkedNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = translateHierarchy(vpcResourceHierarchyResult, ["account", "region", "vpc", "availabilityZone", "subnet", "type"], nodeMap, new Map());
    expect(result).to.deep.equal(vpcTransformBeforeFiltering);
});

it('Should filter the transformed hierarchy for vpc88f1141 generated from a call to linkedNodesHierarchy', async () => {
    let result = filterDuplicates(vpcTransformBeforeFiltering, new Map());
    expect(result).to.deep.equal(vpcAfterFiltering);
});

it('Should build a hierarchy for routetable rtb-0a85a7cf23c6ec75a from a call to linkedNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = buildHierarchy(routeInput, nodeMap);
    expect(result).to.deep.equal(routeTableHierarchy);
});

it('Should transform a hierarchy for routetable rtb-0a85a7cf23c6ec75a from a call to linkedNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = translateHierarchy(routeTableHierarchy, ["account", "region", "vpc", "availabilityZone", "subnet", "type"], nodeMap, new Map());
    expect(result).to.deep.equal(routeTableTransformBeforeFiltering);
});

it('Should filter the transformed hierarchy for routetable rtb-0a85a7cf23c6ec75a from a call to linkedNodesHierarchy', async () => {
    let result = filterDuplicates(routeTableTransformBeforeFiltering, new Map());
    expect(result).to.deep.equal(routeTableTransformAfterFiltering);
});


it('Should build a hierarchy with the eni data generated from a call to filterNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = buildHierarchy(eniInput, nodeMap);
    //console.log(util.inspect(result, {depth:20}));
    expect(result).to.deep.equal(eniHierarchy);
});

it('Should transform a hierarchy from an eni from a call to linkedNodesHierarchy', async () => {
    let nodeMap = buildNodeMap([...subnetInput, ...vpcInput]);
    let result = translateHierarchy(eniHierarchy, ["account", "region", "vpc", "availabilityZone", "subnet", "type"], nodeMap, new Map());
    expect(result).to.deep.equal(eniTransformBeforeFiltering);
});

it('Should filter the transformed hierarchy from an eni from a call to linkedNodesHierarchy', async () => {
    let result = filterDuplicates(eniTransformBeforeFiltering, new Map());
    expect(result).to.deep.equal(eniTransformAfterFiltering);
});