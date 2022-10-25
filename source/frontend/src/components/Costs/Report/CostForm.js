import React from 'react';
import PropTypes from "prop-types";
import {
  Form,
  SpaceBetween,
} from '@awsui/components-react';
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
