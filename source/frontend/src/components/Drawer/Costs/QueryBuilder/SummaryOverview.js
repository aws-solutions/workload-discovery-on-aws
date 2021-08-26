import React from 'react';
import {
  Box,
  Container,
  Header,
  Link,
  ColumnLayout,
  TextContent,
} from '@awsui/components-react';
import PropTypes from 'prop-types';

const SummaryOverview = ({ cost, from, to, resultCount }) => {
  return (
    <Container>
      <ColumnLayout disableGutters columns='4' variant='text-grid'>        
        <div>
          <Box margin={{ bottom: 'xxxs' }} color='text-label'>
            Estimated AWS cost
          </Box>
          <TextContent>
            <h1>{cost}</h1>
          </TextContent>
        </div>
        <div>
          <Box margin={{ bottom: 'xxxs' }} color='text-label'>
            AWS Resources
          </Box>
          <TextContent>
            <h1>{resultCount}</h1>
          </TextContent>
        </div>
        <div>
          <Box margin={{ bottom: 'xxxs' }} color='text-label'>
            From
          </Box>
          <TextContent>
            <h1>{from}</h1>
          </TextContent>
        </div>
        <div>
          <Box margin={{ bottom: 'xxxs' }} color='text-label'>
            To
          </Box>
          <TextContent>
            <h1>{to}</h1>
          </TextContent>
        </div>
      </ColumnLayout>
    </Container>
  );
};

SummaryOverview.propTypes = {
  cost: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  resultCount: PropTypes.number.isRequired,
};

export default SummaryOverview;
