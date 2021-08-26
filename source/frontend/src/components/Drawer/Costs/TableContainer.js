import * as React from 'react';
import Container from '@awsui/components-react/container';
import Header from '@awsui/components-react/header';
import PolarisTable from './PolarisTable';

export default () => {
  return (
    <Container
      className='container-test'
      footer='Container footer'
      header={
        <Header variant='h2' description='Container description'>
          Container title
        </Header>
      }>
      <PolarisTable />
    </Container>
  );
};
