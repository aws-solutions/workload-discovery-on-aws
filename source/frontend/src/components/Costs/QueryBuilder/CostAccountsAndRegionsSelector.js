// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Header,
  FormField,
  Container,
  Multiselect,
  ColumnLayout,
  SpaceBetween,
} from '@awsui/components-react';
import PropTypes from 'prop-types';
import CostDatePicker from '../../Diagrams/Draw/Utils/CostDatePicker';
import {useAccounts} from "../../Hooks/useAccounts";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import * as R from "ramda";

dayjs.extend(localizedFormat);

const CostAccountsAndRegionsSelector = ({
  selectedAccounts,
  setSelectedAccounts,
  selectedRegions,
  setSelectedRegions,
  setDateInterval,
}) => {
  const {data: accountsData=[]} = useAccounts();
  const accounts = R.map((account) => {
    return {
      label: account.accountId,
      value: account.accountId,
      accountId: account.accountId,
      regions: R.chain((region) => {
        return { value: region.name, label: region.name };
      }, account.regions),
    };
  }, accountsData)

  return (
    <Container
      header={
        <Header
          variant='h2'
          description='Specify the Accounts & Regions to query'>
          Accounts & Regions
        </Header>
      }>
      <SpaceBetween direction='vertical' size='l'>
        <ColumnLayout columns={3}>
          <FormField label='Account Ids'
                     description='The AWS accounts to include in the query.'>
            <Multiselect
              description='The time period for which cost data is calculated.'
              selectedOptions={selectedAccounts}
              onChange={({ detail }) =>
                setSelectedAccounts(detail.selectedOptions)
              }
              deselectAriaLabel={(e) => 'Remove ' + e.label}
              options={accounts}
              placeholder='All accounts'
              selectedAriaLabel='Selected'
            />
          </FormField>
          <FormField label='Regions'
                     description='The regions to include in the query.'>
            <Multiselect
              disabled={R.isEmpty(selectedAccounts)}
              selectedOptions={selectedRegions}
              onChange={({ detail }) =>
                setSelectedRegions(detail.selectedOptions)
              }
              deselectAriaLabel={(e) => 'Remove ' + e.label}
              options={R.uniq(R.chain((e) => e.regions, selectedAccounts))}
              placeholder='All regions'
              selectedAriaLabel='Selected'
            />
          </FormField>
          <CostDatePicker disabled={false} onIntervalChange={setDateInterval} />{' '}
        </ColumnLayout>
      </SpaceBetween>
    </Container>
  );
};

CostAccountsAndRegionsSelector.propTypes = {
  selectedAccounts: PropTypes.array.isRequired,
  setSelectedAccounts: PropTypes.func.isRequired,
  selectedRegions: PropTypes.array.isRequired,
  setSelectedRegions: PropTypes.func.isRequired,
};

export default CostAccountsAndRegionsSelector;
