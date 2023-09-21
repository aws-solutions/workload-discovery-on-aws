// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import CostBreakdownTable from './CostBreakdownTable';
import PropTypes from 'prop-types';
import CostBreakdownChart from './CostBreakdownChart';
import {Box, Container, Spinner} from "@cloudscape-design/components";

const CostBreakdown = ({
  resources,
  setSelectedItems,
  resourceDailyBreakdown,
  loading=false,
}) => {

  return (
    <>
      <CostBreakdownTable
        resources={resources}
        onSelectionChange={setSelectedItems}
      />
      {
        loading
          ? <Container>
              <Box textAlign={"center"}>
                <Spinner size="large"/>
              </Box>
            </Container>
          : <CostBreakdownChart items={resourceDailyBreakdown}/>
      }
    </>
  );
};

CostBreakdown.propTypes = {
  loading: PropTypes.bool.isRequired,
  resources: PropTypes.array.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  resourceDailyBreakdown: PropTypes.array.isRequired,
};

export default CostBreakdown;
