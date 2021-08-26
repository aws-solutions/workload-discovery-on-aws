import React from 'react';
import {
  Header,
  ExpandableSection,
  Box,
  SpaceBetween,
  Form,
} from '@awsui/components-react';
import CopyContent from '../../../../../Utils/Forms/Copy/CopyContent';

const R = require('ramda');

const ExampleCSV = () => {
  return (
    <ExpandableSection
      variant='container'
      header={
        <Header
          description='An example CSV file that can be used to import Regions'
          variant='h2'>
          Example CSV
        </Header>
      }>
      <Form actions={<CopyContent componentId='exampleCSV' />}>
        <p id='exampleCSV'>
          <code>
            accountId,accountName,region <br />
            123456789123,example-account-1,eu-west-1,
            <br />
            123456789123,example-account-1,eu-west-2,
            <br />
            123456789124,example-account-2,eu-west-1,
            <br />
            123456789125,example-account-3,eu-west-1,
            <br />
          </code>
        </p>
      </Form>
    </ExpandableSection>
  );
};

export default ExampleCSV;
