import React from 'react';
import DiagramLoader from './DiagramLoader';
import Tabs from '@awsui/components-react/tabs';

const R = require('ramda');

export default ({ toggleDialog }) => {
  return (
    <Tabs
      tabs={[
        {
          label: "You",
          id: 'first',
          content: (
            <DiagramLoader
              toggleDialog={toggleDialog}
              level={'private'}
            />
          ),
        },
        {
          label: `All users`,
          id: 'second',
          content: (
            <DiagramLoader
              toggleDialog={toggleDialog}
              level={'public'}
            />
          ),
        },
      ]}
      variant='container'
    />
  );
};
