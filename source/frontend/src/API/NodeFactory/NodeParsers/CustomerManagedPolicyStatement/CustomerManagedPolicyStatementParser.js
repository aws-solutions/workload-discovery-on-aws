import React from 'react';
import StatementItem from './Statement/StatementItem';
import StatementHover from './Statement/StatementHover';
import { fetchImage } from '../../../../Utils/ImageSelector';

export const parseCustomerManagedPolicyStatement = node => {
;  const statement = JSON.parse(node.properties.statement);


  return {
    styling: {
      borderStyle: 'dotted',
      borderColour: getColour(statement),
      borderOpacity: 0.25,
      borderSize: 1,
      message: getTitle(statement),
      colour: getColour(statement)
    },
    icon: fetchImage(node.properties.resourceType, getStatus(statement)),
    detailsComponent: <StatementItem title='Statement' statement={statement} />,
    hoverComponent: (
      <StatementHover
        statement={statement}
        resourceStatus={getResourceStatus(statement)}
        actionStatus={getActionStatus(statement)}
      />
    )
  };
};

const warningResources = statement => {
  const resources =
    statement.Resource instanceof Array
      ? statement.Resource
      : [statement.Resource];
  return resources.filter(resource => resource.includes('*')).length > 0;
};
const badResources = statement => {
  const resources =
    statement.Resource instanceof Array
      ? statement.Resource
      : [statement.Resource];
  return resources.filter(resource => resource === '*').length > 0;
};

const warningActions = statement => {
  const actions =
    statement.Action instanceof Array ? statement.Action : [statement.Action];
  return actions.filter(action => action.includes('*')).length > 0;
};

const badActions = statement => {
  const actions =
    statement.Action instanceof Array ? statement.Action : [statement.Action];
  return actions.filter(action => action === '*').length > 0;
};

const getColour = statement => {
  if (badResources(statement) || badActions(statement)) return '#D13212';
  else if (warningResources(statement) || warningActions(statement))
    return '#FF9900';
  else return '#1D8102';
};

const getStatus = statement => {
  if (badResources(statement) || badActions(statement))
    return { status: 'status-negative' };
  else if (warningResources(statement) || warningActions(statement))
    return { status: 'status-warning' };
  else return { status: 'status-available' };
};

const getResourceStatus = statement => {
  if (badResources(statement)) return { status: 'status-negative', text: 'At Risk' };
  else if (warningResources(statement)) return { status: 'status-warning', text: 'Needs Attention' };
  else return { status: 'status-available', text: "OK" };
};

const getActionStatus = statement => {
  if (badActions(statement)) return { status: 'status-negative', text: 'At Risk' };
  else if (warningActions(statement)) return { status: 'status-warning', text: 'Needs Attention' };
  else return { status: 'status-available', text: 'OK' };
};

const getTitle = statement => {
  if (badResources(statement) || badActions(statement))
    return 'This is not secure. You should lockdown your policy statements by providing ARNs and full action names';
  else if (warningResources(statement) || warningActions(statement))
    return `You could further lockdown your policy by providing full resource ARNs and actions and removing any wildcards`;
  else return 'The actions and resources covered by this statement';
};
