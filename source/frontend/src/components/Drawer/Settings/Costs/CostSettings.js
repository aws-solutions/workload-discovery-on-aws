import React, { useState, useEffect } from 'react';
import {
  Header,
  Alert,
  Toggle,
  SpaceBetween,
  Container,
  Form,
  Link,
  Grid,
  FormField,
  ColumnLayout,
  DatePicker,
  TextContent,
} from '@awsui/components-react';
import { useCostsState } from '../../../Contexts/CostsContext';
import { uploadObject } from '../../../../API/Storage/S3Store';

const R = require('ramda');
const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

export default () => {
  const [{ costPreferences }, dispatch] = useCostsState();
  const [fromDate, setFromDate] = React.useState(
    R.pathOr(
      dayjs().startOf('month').format('YYYY-MM-DD'),
      ['period', 'fromDate'],
      costPreferences
    )
  );
  const [toDate, setToDate] = React.useState(
    R.pathOr(
      dayjs().endOf('month').format('YYYY-MM-DD'),
      ['period', 'toDate'],
      costPreferences
    )
  );
  const [processCosts, setProcessCosts] = React.useState(
    R.pathOr(false, ['processCosts'], costPreferences)
  );

  const updateProcessCosts = (checked) => {
    setProcessCosts(checked);
    dispatch({
      type: 'updatePreferences',
      preferences: {
        period: { fromDate: fromDate, toDate: toDate },
        processCosts: checked,
      },
    });
    uploadObject(
      'costs/preferences',
      JSON.stringify({
        period: { fromDate: fromDate, toDate: toDate },
        processCosts: checked,
      }),
      'private',
      'application/json'
    );
  };

  return (
    <Container>
      <Form>
        <SpaceBetween direction='vertical' size='l'>
          <Alert
            visible={processCosts}
            dismissAriaLabel='Close alert'
            type='warning'
            header='This will incur an extra cost for running AWS Perspective.'>
            Athena is used to query your Cost and Usage Reports (CURs), so there
            will be an extra cost when this feature is enabled.
          </Alert>
          <Alert
            type='info'
            header='Have you set up your Cost & Usage Reports (CURs)?'>
            {
              <TextContent>
                <p>
                  You need to complete the set up steps to allow AWS Perspective
                  to process your CURs.
                </p>
              </TextContent>
            }
          </Alert>
          <Toggle
            description={`Turn ${
              processCosts ? 'off' : 'on'
            } cost processing in AWS Perspective`}
            onChange={({ detail }) => updateProcessCosts(detail.checked)}
            checked={processCosts}>
            Process Costs
          </Toggle>
        </SpaceBetween>
      </Form>
    </Container>
  );
};
