import React from 'react';
import {
  Box,
  ColumnLayout,
  Container,
  Header,
  TextContent,
} from '@awsui/components-react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

const ValueWithLabel = ({ label, children }) => (
  <div>
    <Box margin={{ bottom: 'xxxs' }} color='text-label'>
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

ValueWithLabel.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.object
}

const ViewOverview = ({ accounts, resourceTypes }) => {
  const accountsToRegionList = R.uniq(R.chain(i => i.regions, accounts));

  return (
    <Container
      header={<Header>Overview</Header>}>
      <ColumnLayout columns={4} variant='text-grid'>
        <ValueWithLabel label='Accounts'>
          <TextContent>
            <h1>{R.length(accounts)}</h1>
          </TextContent>
        </ValueWithLabel>
        <ValueWithLabel label='Regions'>
          <TextContent>
            <h1>{R.length(accountsToRegionList)}</h1>
          </TextContent>
        </ValueWithLabel>
        <ValueWithLabel label='Resources types'>
          <TextContent>
            <h1>{R.length(resourceTypes)}</h1>
          </TextContent>
        </ValueWithLabel>
      </ColumnLayout>
    </Container>
  );
};

ViewOverview.propTypes = {
  accounts: PropTypes.array.isRequired,
  regions: PropTypes.array.isRequired,
  resourceTypes: PropTypes.array.isRequired,
};

export default ViewOverview;
