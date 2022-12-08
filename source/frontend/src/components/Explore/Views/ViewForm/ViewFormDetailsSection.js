// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useState} from 'react';
import {
  Alert,
  Button,
  Container,
  Form,
  FormField, Header,
  Input,
  SpaceBetween,
} from '@awsui/components-react';
import PropTypes from 'prop-types';
import {privateLevel, useListObjects, viewsPrefix} from "../../../Hooks/useS3Objects";
import * as R  from 'ramda';

const ViewFormDetailsSection = ({ view, onSubmit }) => {
  const [viewName, setViewName] = useState(view.name ?? "");
  const {data: existingViews=[]} = useListObjects(viewsPrefix, privateLevel);

  const validName = R.allPass([
    (x) => R.equals(R.length(R.match(/[!@#$%^&*(),.?":{}|<>]/g, x)), 0),
    (x) => R.and(R.gt(R.length(x), 0), R.lte(R.length(x), 64)),
  ]);

  const isAnOverwrite = () =>
    R.includes(
      viewName,
      R.map((e) => R.split('/', e.key)[1], existingViews)
    );

  return (
    <SpaceBetween size='l'>
      <Form
        actions={
          <Button
            iconAlign='right'
            disabled={R.and(
              R.isEmpty(view.selectedAccounts),
              R.isEmpty(view.selectedResourceTypes)
            )}
            onClick={() => onSubmit(viewName)}
            variant={'primary'}>
            Save
          </Button>
        }>
        <Container header={<Header variant={"h2"}>View Details</Header> }>
          <SpaceBetween size={"s"}>
            <FormField
              stretch
              errorText={
                !validName(viewName)
                  ? 'Should be fewer than 64 characters and contain no special characters'
                  : null
              }
              label='Name'
              description='The name that will identify this View.'>
              <Input
                onChange={({ detail }) => setViewName(detail.value)}
                value={viewName}
              />
            </FormField>
            {
              isAnOverwrite() && <Alert
                type='warning'
                dismissAriaLabel='Close alert'
                header='Overwrite Existing View'>
                Workload Discovery on AWS will Overwrite the existing view <strong>{viewName}</strong>
              </Alert>
            }
          </SpaceBetween>
        </Container>
      </Form>
    </SpaceBetween>
  );
};

ViewFormDetailsSection.propTypes = {
  view: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ViewFormDetailsSection;
