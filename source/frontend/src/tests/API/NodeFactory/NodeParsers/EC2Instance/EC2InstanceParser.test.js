import React from 'react';
import { parseEC2Instance } from '../../../../../API/NodeFactory/NodeParsers/EC2Instance/EC2InstanceParser';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import {
  t2,
  a1,
  c4,
  c5,
  c5n,
  d2,
  f1,
  g3,
  h1,
  i3,
  m4,
  m5,
  m5a,
  p2,
  p3,
  r4,
  r5,
  t3,
  t3a,
  x1,
  x1e,
  z1d
} from './data/ec2Types';
import InstanceItem from '../../../../../API/NodeFactory/NodeParsers/EC2Instance/InstanceDetails/InstanceItem';

const PUBLIC_URL = process.env;

beforeEach(() => {
  jest.resetModules(); // this is important - it clears the cache
  process.env = { ...PUBLIC_URL };
});

afterEach(() => {
  delete process.env.PUBLIC_URL;
});

test('when node is an ec2 instance with type z1d that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'z1d.micro',
        configuration: z1d,
        state: 'available'
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
      icon: fetchImage('z1d', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type z1d that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'z1d.micro',
        configuration: z1d,
        state: 'provisioning'
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
      icon: fetchImage('z1d', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type z1d that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'z1d.micro',
        configuration: z1d,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('z1d', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type x1e that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'x1e.micro',
        configuration: x1e,
        state: 'available'
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
      icon: fetchImage('x1e', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type x1e that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'x1e.micro',
        configuration: x1e,
        state: 'provisioning'
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
      icon: fetchImage('x1e', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type x1e that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'x1e.micro',
        configuration: x1e,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('x1e', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type x1 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'x1.micro',
        configuration: x1,
        state: 'available'
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
      icon: fetchImage('x1', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type x1 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'x1.micro',
        configuration: x1,
        state: 'provisioning'
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
      icon: fetchImage('x1', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type x1 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'x1.micro',
        configuration: x1,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('x1', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type t3a that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 't3a.micro',
        configuration: t3a,
        state: 'available'
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
      icon: fetchImage('t3a', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type t3a that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 't3a.micro',
        configuration: t3a,
        state: 'provisioning'
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
      icon: fetchImage('t3a', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type t3a that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 't3a.micro',
        configuration: t3a,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('t3a', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type t3 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 't3.micro',
        configuration: t3,
        state: 'available'
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
      icon: fetchImage('t3', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type t3 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 't3.micro',
        configuration: t3,
        state: 'provisioning'
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
      icon: fetchImage('t3', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type t3 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 't3.micro',
        configuration: t3,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('t3', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type r5 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'r5.micro',
        configuration: r5,
        state: 'available'
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
      icon: fetchImage('r5', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type r5 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'r5.micro',
        configuration: r5,
        state: 'provisioning'
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
      icon: fetchImage('r5', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type r5 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'r5.micro',
        configuration: r5,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('r5', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type r4 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'r4.micro',
        configuration: r4,
        state: 'available'
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
      icon: fetchImage('r4', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type r4 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'r4.micro',
        configuration: r4,
        state: 'provisioning'
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
      icon: fetchImage('r4', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type r4 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'r4.micro',
        configuration: r4,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('r4', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type p3 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'p3.micro',
        configuration: p3,
        state: 'available'
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
      icon: fetchImage('p3', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type p3 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'p3.micro',
        configuration: p3,
        state: 'provisioning'
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
      icon: fetchImage('p3', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type p3 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'p3.micro',
        configuration: p3,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('p3', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type p2 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'p2.micro',
        configuration: p2,
        state: 'available'
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
      icon: fetchImage('p2', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type p2 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'p2.micro',
        configuration: p2,
        state: 'provisioning'
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
      icon: fetchImage('p2', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type p2 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'p2.micro',
        configuration: p2,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('p2', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type m5a that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm5a.micro',
        configuration: m5a,
        state: 'available'
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
      icon: fetchImage('m5a', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type m5a that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm5a.micro',
        configuration: m5a,
        state: 'provisioning'
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
      icon: fetchImage('m5a', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type m5a that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm5a.micro',
        configuration: m5a,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('m5a', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type m5 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm5.micro',
        configuration: m5,
        state: 'available'
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
      icon: fetchImage('m5', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type m5 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm5.micro',
        configuration: m5,
        state: 'provisioning'
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
      icon: fetchImage('m5', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type m5 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm5.micro',
        configuration: m5,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('m5', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type m4 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm4.micro',
        configuration: m4,
        state: 'available'
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
      icon: fetchImage('m4', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type m4 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm4.micro',
        configuration: m4,
        state: 'provisioning'
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
      icon: fetchImage('m4', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type m4 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'm4.micro',
        configuration: m4,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('m4', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type i3 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'i3.micro',
        configuration: i3,
        state: 'available'
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
      icon: fetchImage('i3', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type i3 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'i3.micro',
        configuration: i3,
        state: 'provisioning'
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
      icon: fetchImage('i3', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type i3 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'i3.micro',
        configuration: i3,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('i3', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type h1 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'h1.micro',
        configuration: h1,
        state: 'available'
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
      icon: fetchImage('h1', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type h1 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'h1.micro',
        configuration: h1,
        state: 'provisioning'
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
      icon: fetchImage('h1', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type h1 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'h1.micro',
        configuration: h1,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('h1', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type g3 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'g3.micro',
        configuration: g3,
        state: 'available'
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
      icon: fetchImage('g3', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type g3 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'g3.micro',
        configuration: g3,
        state: 'provisioning'
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
      icon: fetchImage('g3', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type g3 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'g3.micro',
        configuration: g3,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('g3', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type f1 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'f1.micro',
        configuration: f1,
        state: 'available'
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
      icon: fetchImage('f1', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type f1 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'f1.micro',
        configuration: f1,
        state: 'provisioning'
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
      icon: fetchImage('f1', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type f1 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'f1.micro',
        configuration: f1,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('f1', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type d2 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'd2.micro',
        configuration: d2,
        state: 'available'
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
      icon: fetchImage('d2', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type d2 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'd2.micro',
        configuration: d2,
        state: 'provisioning'
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
      icon: fetchImage('d2', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type d2 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'd2.micro',
        configuration: d2,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('d2', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type c5n that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c5n.micro',
        configuration: c5n,
        state: 'available'
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
      icon: fetchImage('c5n', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type c5n that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c5n.micro',
        configuration: c5n,
        state: 'provisioning'
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
      icon: fetchImage('c5n', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type c5n that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c5n.micro',
        configuration: c5n,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('c5n', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type c5 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c5.micro',
        configuration: c5,
        state: 'available'
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
      icon: fetchImage('c5', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type c5 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c5.micro',
        configuration: c5,
        state: 'provisioning'
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
      icon: fetchImage('c5', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type c5 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c5.micro',
        configuration: c5,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('c5', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type c4 that is in healthy state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c4.micro',
        configuration: c4,
        state: 'available'
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
      icon: fetchImage('c4', {
        status: 'status-available'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type c4 that is in warning state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c4.micro',
        configuration: c4,
        state: 'provisioning'
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
      icon: fetchImage('c4', {
        status: 'status-warning'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });
  
  test('when node is an ec2 instance with type c4 that is in error state it returns correct icon and components', () => {
    process.env.PUBLIC_URL = '';
  
    const node = {
      name: 'anEC2Instance',
      properties: {
        resourceType: 'AWS::EC2::Instance',
        instanceType: 'c4.micro',
        configuration: c4,
        state: 'shutting-down'
      }
    };
    const expectedResult = {
      styling: {
        borderStyle: 'dotted',
        borderColour: '#D13212',
        borderOpacity: 0.25,
        borderSize: 1,
        message: 'shutting-down',
        colour: '#D13212'
      },
      icon: fetchImage('c4', {
        status: 'status-negative'
      }),
      detailsComponent: (
        <InstanceItem
          title='Instance Details'
          configuration={node.properties.configuration}
        />
      )
    };
  
    const result = parseEC2Instance(node);
    expect(result.styling).toEqual(expectedResult.styling);
    expect(result.icon).toEqual(expectedResult.icon);
    expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
  });

test('when node is an ec2 instance with type a1 that is in healthy state it returns correct icon and components', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'anEC2Instance',
    properties: {
      resourceType: 'AWS::EC2::Instance',
      instanceType: 'a1.micro',
      configuration: a1,
      state: 'available'
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
    icon: fetchImage('a1', {
      status: 'status-available'
    }),
    detailsComponent: (
      <InstanceItem
        title='Instance Details'
        configuration={node.properties.configuration}
      />
    )
  };

  const result = parseEC2Instance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an ec2 instance with type a1 that is in warning state it returns correct icon and components', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'anEC2Instance',
    properties: {
      resourceType: 'AWS::EC2::Instance',
      instanceType: 'a1.micro',
      configuration: a1,
      state: 'provisioning'
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
    icon: fetchImage('a1', {
      status: 'status-warning'
    }),
    detailsComponent: (
      <InstanceItem
        title='Instance Details'
        configuration={node.properties.configuration}
      />
    )
  };

  const result = parseEC2Instance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an ec2 instance with type a1 that is in error state it returns correct icon and components', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'anEC2Instance',
    properties: {
      resourceType: 'AWS::EC2::Instance',
      instanceType: 'a1.micro',
      configuration: a1,
      state: 'shutting-down'
    }
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#D13212',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'shutting-down',
      colour: '#D13212'
    },
    icon: fetchImage('a1', {
      status: 'status-negative'
    }),
    detailsComponent: (
      <InstanceItem
        title='Instance Details'
        configuration={node.properties.configuration}
      />
    )
  };

  const result = parseEC2Instance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an ec2 instance with type t2 that is in error state it returns correct icon and components', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'anEC2Instance',
    properties: {
      resourceType: 'AWS::EC2::Instance',
      instanceType: 't2.micro',
      configuration: t2,
      state: 'available'
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
    icon: fetchImage('t2', {
      status: 'status-available'
    }),
    detailsComponent: (
      <InstanceItem
        title='Instance Details'
        configuration={node.properties.configuration}
      />
    )
  };

  const result = parseEC2Instance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an ec2 instance with type t2 that is in error state it returns correct icon and components', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'anEC2Instance',
    properties: {
      resourceType: 'AWS::EC2::Instance',
      instanceType: 't2.micro',
      configuration: t2,
      state: 'provisioning'
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
    icon: fetchImage('t2', {
      status: 'status-warning'
    }),
    detailsComponent: (
      <InstanceItem
        title='Instance Details'
        configuration={node.properties.configuration}
      />
    )
  };

  const result = parseEC2Instance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});

test('when node is an ec2 instance with type t2 that is in error state it returns correct icon and components', () => {
  process.env.PUBLIC_URL = '';

  const node = {
    name: 'anEC2Instance',
    properties: {
      resourceType: 'AWS::EC2::Instance',
      instanceType: 't2.micro',
      configuration: t2,
      state: 'shutting-down'
    }
  };
  const expectedResult = {
    styling: {
      borderStyle: 'dotted',
      borderColour: '#D13212',
      borderOpacity: 0.25,
      borderSize: 1,
      message: 'shutting-down',
      colour: '#D13212'
    },
    icon: fetchImage('t2', {
      status: 'status-negative'
    }),
    detailsComponent: (
      <InstanceItem
        title='Instance Details'
        configuration={node.properties.configuration}
      />
    )
  };

  const result = parseEC2Instance(node);
  expect(result.styling).toEqual(expectedResult.styling);
  expect(result.icon).toEqual(expectedResult.icon);
  expect(result.detailsComponent).toEqual(expectedResult.detailsComponent);
});
