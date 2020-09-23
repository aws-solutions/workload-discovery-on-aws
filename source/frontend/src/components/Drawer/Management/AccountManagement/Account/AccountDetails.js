import React from 'react';
import ImportAccount from './ImportAccount';
import ImportRegion from './ImportRegion';
import { Typography } from '@material-ui/core';

export default ({}) => {
  return (
    <div style={{ display: 'flex' }}>
      <ImportAccount />
      <ImportRegion />
    </div>
  );
};
