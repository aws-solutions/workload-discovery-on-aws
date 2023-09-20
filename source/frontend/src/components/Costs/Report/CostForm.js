// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import PropTypes from "prop-types";
import {
  Form,
  SpaceBetween,
} from '@cloudscape-design/components';
import CostDatePicker from '../../Diagrams/Draw/Utils/CostDatePicker';

const CostForm = ({ setDateInterval }) => {
  return (
    <>
      <Form>
        <SpaceBetween direction='horizontal' size='l'>
          <CostDatePicker disabled={false} onIntervalChange={setDateInterval} />
        </SpaceBetween>
      </Form>
    </>
  );
};

CostForm.propTypes = {
  setDateInterval: PropTypes.func.isRequired
}

export default CostForm;
