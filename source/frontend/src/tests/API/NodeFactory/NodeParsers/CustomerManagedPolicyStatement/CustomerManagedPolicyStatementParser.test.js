import React from 'react';
import StatementItem from '../../../../../API/NodeFactory/NodeParsers/CustomerManagedPolicyStatement/Statement/StatementItem';
import StatementHover from '../../../../../API/NodeFactory/NodeParsers/CustomerManagedPolicyStatement/Statement/StatementHover';
import { parseCustomerManagedPolicyStatement } from '../../../../../API/NodeFactory/NodeParsers/CustomerManagedPolicyStatement/CustomerManagedPolicyStatementParser';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import {
  atRiskActionsResources,
  atRiskActionsNeedsAttentionResources,
  needsAttentionActionsNeedsAttentionResources,
  okActionsAtRiskResources,
  atRiskActionsOKResources,
  needsAttentionActionsOKResources,
  okActionsNeedsAttentionResources,
  okActionsOKResources,
  okActionsNotArrayOKResources,
  okActionsOKResourcesArray
} from './data/statement.js';

const PUBLIC_URL = process.env;

beforeEach(() => {
  jest.resetModules(); // this is important - it clears the cache
  process.env = { ...PUBLIC_URL };
});

afterEach(() => {
  delete process.env.PUBLIC_URL;
});

test('when node that is customer managed policy statement with at risk actions and at risk resources is parsed', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'aPolicyStatement',
    properties: {
      configuration: atRiskActionsResources,
      resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
      statement: atRiskActionsResources
    }
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#D13212',
      borderOpacity: 0.25,
      borderSize: 1,
      message:
        'This is not secure. You should lockdown your policy statements by providing ARNs and full action names',
      colour: '#D13212'
    },
    icon: fetchImage(node.properties.resourceType, {
      status: 'status-negative'
    }),
    detailsComponent: (
      <StatementItem
        title='Statement'
        statement={JSON.parse(atRiskActionsResources)}
      />
    ),
    hoverComponent: (
      <StatementHover
        statement={JSON.parse(atRiskActionsResources)}
        resourceStatus={{ status: 'status-negative', text: 'At Risk' }}
        actionStatus={{ status: 'status-negative', text: 'At Risk' }}
      />
    )
  };

  const result = parseCustomerManagedPolicyStatement(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node that is customer managed policy statement with at risk actions and needs attention resources is parsed', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'aPolicyStatement',
    properties: {
      configuration: atRiskActionsNeedsAttentionResources,
      resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
      statement: atRiskActionsNeedsAttentionResources
    }
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#D13212',
      borderOpacity: 0.25,
      borderSize: 1,
      message:
        'This is not secure. You should lockdown your policy statements by providing ARNs and full action names',
      colour: '#D13212'
    },
    icon: fetchImage(node.properties.resourceType, {
      status: 'status-negative'
    }),
    detailsComponent: (
      <StatementItem
        title='Statement'
        statement={JSON.parse(atRiskActionsNeedsAttentionResources)}
      />
    ),
    hoverComponent: (
      <StatementHover
        statement={JSON.parse(atRiskActionsNeedsAttentionResources)}
        resourceStatus={{ status: 'status-warning', text: 'Needs Attention' }}
        actionStatus={{ status: 'status-negative', text: 'At Risk' }}
      />
    )
  };

  const result = parseCustomerManagedPolicyStatement(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node that is customer managed policy statement with needs attention actions and needs attention resources is parsed', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'aPolicyStatement',
    properties: {
      configuration: needsAttentionActionsNeedsAttentionResources,
      resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
      statement: needsAttentionActionsNeedsAttentionResources
    }
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#FF9900',
      borderOpacity: 0.25,
      borderSize: 1,
      message:
        'You could further lockdown your policy by providing full resource ARNs and actions and removing any wildcards',
      colour: '#FF9900'
    },
    icon: fetchImage(node.properties.resourceType, {
      status: 'status-warning'
    }),
    detailsComponent: (
      <StatementItem
        title='Statement'
        statement={JSON.parse(needsAttentionActionsNeedsAttentionResources)}
      />
    ),
    hoverComponent: (
      <StatementHover
        statement={JSON.parse(needsAttentionActionsNeedsAttentionResources)}
        resourceStatus={{ status: 'status-warning', text: 'Needs Attention' }}
        actionStatus={{ status: 'status-warning', text: 'Needs Attention' }}
      />
    )
  };

  const result = parseCustomerManagedPolicyStatement(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node that is customer managed policy statement with ok actions and at risk resources is parsed', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'aPolicyStatement',
    properties: {
      configuration: okActionsAtRiskResources,
      resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
      statement: okActionsAtRiskResources
    }
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#D13212',
      borderOpacity: 0.25,
      borderSize: 1,
      message:
        'This is not secure. You should lockdown your policy statements by providing ARNs and full action names',
      colour: '#D13212'
    },
    icon: fetchImage(node.properties.resourceType, {
      status: 'status-negative'
    }),
    detailsComponent: (
      <StatementItem
        title='Statement'
        statement={JSON.parse(okActionsAtRiskResources)}
      />
    ),
    hoverComponent: (
      <StatementHover
        statement={JSON.parse(okActionsAtRiskResources)}
        resourceStatus={{ status: 'status-negative', text: 'At Risk' }}
        actionStatus={{ status: 'status-available', text: 'OK' }}
      />
    )
  };

  const result = parseCustomerManagedPolicyStatement(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node that is customer managed policy statement with at risk actions and ok resources is parsed', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aPolicyStatement',
      properties: {
        configuration: atRiskActionsOKResources,
        resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
        statement: atRiskActionsOKResources
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message:
          'This is not secure. You should lockdown your policy statements by providing ARNs and full action names',
        colour: '#D13212'
      },
      icon: fetchImage(node.properties.resourceType, {
        status: 'status-negative'
      }),
      detailsComponent: (
        <StatementItem
          title='Statement'
          statement={JSON.parse(atRiskActionsOKResources)}
        />
      ),
      hoverComponent: (
        <StatementHover
          statement={JSON.parse(atRiskActionsOKResources)}
          resourceStatus={{ status: 'status-available', text: 'OK' }}
          actionStatus={{ status: 'status-negative', text: 'At Risk' }}
        />
      )
    };
  
    const result = parseCustomerManagedPolicyStatement(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node that is customer managed policy statement with needs attention actions and ok resources is parsed', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aPolicyStatement',
      properties: {
        configuration: needsAttentionActionsOKResources,
        resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
        statement: needsAttentionActionsOKResources
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#FF9900',
        borderOpacity: 0.25,
        borderSize: 1,
        message:
          'You could further lockdown your policy by providing full resource ARNs and actions and removing any wildcards',
        colour: '#FF9900'
      },
      icon: fetchImage(node.properties.resourceType, {
        status: 'status-warning'
      }),
      detailsComponent: (
        <StatementItem
          title='Statement'
          statement={JSON.parse(needsAttentionActionsOKResources)}
        />
      ),
      hoverComponent: (
        <StatementHover
          statement={JSON.parse(needsAttentionActionsOKResources)}
          resourceStatus={{ status: 'status-available', text: 'OK' }}
          actionStatus={{ status: 'status-warning', text: 'Needs Attention' }}
        />
      )
    };
  
    const result = parseCustomerManagedPolicyStatement(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node that is customer managed policy statement with ok actions and needs attention resources is parsed', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aPolicyStatement',
      properties: {
        configuration: okActionsNeedsAttentionResources,
        resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
        statement: okActionsNeedsAttentionResources
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#FF9900',
        borderOpacity: 0.25,
        borderSize: 1,
        message:
          'You could further lockdown your policy by providing full resource ARNs and actions and removing any wildcards',
        colour: '#FF9900'
      },
      icon: fetchImage(node.properties.resourceType, {
        status: 'status-warning'
      }),
      detailsComponent: (
        <StatementItem
          title='Statement'
          statement={JSON.parse(okActionsNeedsAttentionResources)}
        />
      ),
      hoverComponent: (
        <StatementHover
          statement={JSON.parse(okActionsNeedsAttentionResources)}
          resourceStatus={{ status: 'status-warning', text: 'Needs Attention' }}
          actionStatus={{ status: 'status-available', text: 'OK' }}
        />
      )
    };
  
    const result = parseCustomerManagedPolicyStatement(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node that is customer managed policy statement with ok actions and ok resources is parsed', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aPolicyStatement',
      properties: {
        configuration: okActionsOKResources,
        resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
        statement: okActionsOKResources
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#1D8102',
        borderOpacity: 0.25,
        borderSize: 1,
        message:
          'The actions and resources covered by this statement',
        colour: '#1D8102'
      },
      icon: fetchImage(node.properties.resourceType, {
        status: 'status-available'
      }),
      detailsComponent: (
        <StatementItem
          title='Statement'
          statement={JSON.parse(okActionsOKResources)}
        />
      ),
      hoverComponent: (
        <StatementHover
          statement={JSON.parse(okActionsOKResources)}
          resourceStatus={{ status: 'status-available', text: 'OK' }}
          actionStatus={{ status: 'status-available', text: 'OK' }}
        />
      )
    };
  
    const result = parseCustomerManagedPolicyStatement(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node that is customer managed policy statement with ok actions not array and ok resources is parsed', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aPolicyStatement',
      properties: {
        configuration: okActionsNotArrayOKResources,
        resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
        statement: okActionsNotArrayOKResources
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#1D8102',
        borderOpacity: 0.25,
        borderSize: 1,
        message:
          'The actions and resources covered by this statement',
        colour: '#1D8102'
      },
      icon: fetchImage(node.properties.resourceType, {
        status: 'status-available'
      }),
      detailsComponent: (
        <StatementItem
          title='Statement'
          statement={JSON.parse(okActionsNotArrayOKResources)}
        />
      ),
      hoverComponent: (
        <StatementHover
          statement={JSON.parse(okActionsNotArrayOKResources)}
          resourceStatus={{ status: 'status-available', text: 'OK' }}
          actionStatus={{ status: 'status-available', text: 'OK' }}
        />
      )
    };
  
    const result = parseCustomerManagedPolicyStatement(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node that is customer managed policy statement with ok actions and ok resources in array is parsed', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aPolicyStatement',
      properties: {
        configuration: okActionsOKResourcesArray,
        resourceType: 'AWS::IAM::CustomerManagedPolicyStatement',
        statement: okActionsOKResourcesArray
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#1D8102',
        borderOpacity: 0.25,
        borderSize: 1,
        message:
          'The actions and resources covered by this statement',
        colour: '#1D8102'
      },
      icon: fetchImage(node.properties.resourceType, {
        status: 'status-available'
      }),
      detailsComponent: (
        <StatementItem
          title='Statement'
          statement={JSON.parse(okActionsOKResourcesArray)}
        />
      ),
      hoverComponent: (
        <StatementHover
          statement={JSON.parse(okActionsOKResourcesArray)}
          resourceStatus={{ status: 'status-available', text: 'OK' }}
          actionStatus={{ status: 'status-available', text: 'OK' }}
        />
      )
    };
  
    const result = parseCustomerManagedPolicyStatement(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.hoverComponent).toEqual(expectedResult.hoverComponent);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
