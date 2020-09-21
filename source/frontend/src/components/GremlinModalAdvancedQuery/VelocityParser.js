var Velocity = require('velocityjs');
var render = Velocity.render;


export const fetchRequest = (resourceType, resourceCount) => {
    var vm = '[{"as": {"parameter": "a"} }, #if($where){"where": [{"both": {"parameter": "$where.constraint", "subFunction": [{"count": {} }, {"is": {"parameter": $where.constraintValue } }] } }]},#end {"select": {"parameter": "a"} }, {#foreach( $property in $properties )"has": [{"$property.name": "$property.value"}]#end}]';
    var data = { properties: [{name:'resourceType', value: resourceType}]}
    if(resourceCount) data.where = {constraint: 'linked', constraintValue: resourceCount }
    return JSON.parse(render(vm, data))
}