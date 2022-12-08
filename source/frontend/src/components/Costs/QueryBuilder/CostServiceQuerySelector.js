// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Header from '@awsui/components-react/header';
import FormField from '@awsui/components-react/form-field';
import Container from '@awsui/components-react/container';
import { services } from '../../../Utils/Dictionaries/service-names';
import PropTypes from 'prop-types';
import { Select } from '@awsui/components-react';

import * as R  from 'ramda';
import dayjs from 'dayjs';
import localizedFormat  from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

const CostServiceQuerySelector = ({
  selectedService,
  setSelectedService,
}) => {
  return (
    <Container
      header={
        <Header
          variant='h2'
          description='Specify the AWS Service to query'>
          Service name
        </Header>
      }>
      <FormField label='Service name'>
        <Select
          selectedOption={selectedService}
          onChange={({ detail }) => setSelectedService(detail.selectedOption)}
          options={R.map((e) => {
            return { label: e.service, value: e.service, filteringTags: e.filteringTags ?? [] };
          }, services)}
          filteringType='auto'
          placeholder={'Select a service'}
          selectedAriaLabel='Selected'
        />
      </FormField>
    </Container>
  );
};

CostServiceQuerySelector.propTypes = {
  selectedService: PropTypes.object,
  setSelectedService: PropTypes.func.isRequired,
};

export default CostServiceQuerySelector;
