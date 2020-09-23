import React from 'react';
import DatabaseInstanceItem from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceDetails/DatabaseInstanceItem';
import { parseDatabaseInstance } from '../../../../../API/NodeFactory/NodeParsers/DatabaseInstance/DatabaseInstanceParser';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import { neptune } from './data/dbTypes';

const PUBLIC_URL = process.env;

beforeEach(() => {
  jest.resetModules(); // this is important - it clears the cache
  process.env = { ...PUBLIC_URL };
});

afterEach(() => {
  delete process.env.PUBLIC_URL;
});

test('when node is an neptune rds instance with status as warning', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'aDatabaseInstance',
    properties: {
      resourceType: 'AWS::RDS::DBInstance',
      configuration: neptune,
      dBInstanceStatus: 'provisioning'
    }
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#FF9900',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'provisioning',
      colour: '#FF9900'
    },
    icon: fetchImage('AWS::RDS::DBInstance-neptune', {
      status: 'status-warning'
    }),
    detailsComponent: (
      <DatabaseInstanceItem
        title='Instance Details'
        configuration={neptune}
      />
    )
  };

  const result = parseDatabaseInstance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an neptune rds instance with status as warning', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: neptune,
        dBInstanceStatus: 'pending'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#FF9900',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'pending',
        colour: '#FF9900'
      },
      icon: fetchImage('AWS::RDS::DBInstance-neptune', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={neptune}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node is an neptune rds instance with status as warning', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: neptune,
        dBInstanceStatus: 'available'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#1D8102',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'available',
        colour: '#1D8102'
      },
      icon: fetchImage('AWS::RDS::DBInstance-neptune', {
        status: 'status-available'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={neptune}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node is an neptune rds instance with status as warning', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: neptune,
        dBInstanceStatus: 'active'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#1D8102',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'active',
        colour: '#1D8102'
      },
      icon: fetchImage('AWS::RDS::DBInstance-neptune', {
        status: 'status-available'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={neptune}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node is an neptune rds instance with status as warning', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: neptune,
        dBInstanceStatus: 'stopped'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'stopped',
        colour: '#D13212'
      },
      icon: fetchImage('AWS::RDS::DBInstance-neptune', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={neptune}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

  test('when node is an neptune rds instance with status as warning', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'aDatabaseInstance',
      properties: {
        resourceType: 'AWS::RDS::DBInstance',
        configuration: neptune,
        dBInstanceStatus: 'failed'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'failed',
        colour: '#D13212'
      },
      icon: fetchImage('AWS::RDS::DBInstance-neptune', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <DatabaseInstanceItem
          title='Instance Details'
          configuration={neptune}
        />
      )
    };
  
    const result = parseDatabaseInstance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });