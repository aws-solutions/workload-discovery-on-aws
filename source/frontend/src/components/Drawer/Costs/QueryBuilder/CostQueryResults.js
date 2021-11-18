import React, { useMemo } from 'react';
import Form from '@awsui/components-react/form';
import SpaceBetween from '@awsui/components-react/space-between';
import Button from '@awsui/components-react/button';
import Header from '@awsui/components-react/header';
import Grid from '@awsui/components-react/grid';
import FormField from '@awsui/components-react/form-field';
import Container from '@awsui/components-react/container';
import Multiselect from '@awsui/components-react/multiselect';
import ColumnLayout from '@awsui/components-react/column-layout';
import ExpandableSection from '@awsui/components-react/expandable-section';
import Input from '@awsui/components-react/input';
import getSymbolFromCurrency from 'currency-symbol-map';
import SummaryOverview from './SummaryOverview';
import CostTable from '../CostTable';
import {
  wrapRequest,
  handleResponse,
  getAccounts,
} from '../../../../API/Handlers/SettingsGraphQLHandler';
import {
  getCostForResource,
  readResultsFromS3,
  wrapCostAPIRequest,
} from '../../../../API/Handlers/CostsGraphQLHandler';
import AttributeCreator from '../../../../Utils/Forms/AttributeCreator';
import Flashbar from '../../../../Utils/Flashbar/Flashbar';
import PropTypes from 'prop-types';
import { ButtonDropdown, TextContent } from '@awsui/components-react';
import ResourceCountAlert from './ResourceCountAlert';

const R = require('ramda');
const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

const columns = [
  {
    id: 'resource',
    header: 'Resource',
    cell: (e) =>
      e.line_item_resource_id
        ? e.line_item_resource_id
        : e.product_servicename
        ? e.product_servicename
        : 'undefined',
    width: 320,
    minWidth: 320,
  },
  {
    id: 'cost',
    header: 'Estimated cost',
    cell: (e) => `${getSymbolFromCurrency(e.line_item_currency_code)}${e.cost}`,
    sortingField: 'cost',
    width: 300,
    minWidth: 300,
  },
  {
    id: 'accountId',
    header: 'Account Id',
    cell: (e) => e.line_item_usage_account_id,
    width: 150,
    minWidth: 150,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.product_region,
    width: 150,
    minWidth: 150,
  },
];

const Control = React.memo(({ value, index, placeholder, setItems, prop }) => {
  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={({ detail }) => {
        setItems((items) => {
          const updatedItems = [...items];
          updatedItems[index] = {
            ...updatedItems[index],
            [prop]: detail.value,
          };
          return updatedItems;
        });
      }}
    />
  );
});

const CostQueryResults = ({
  addToGraph,
  query,
  results,
  queryType,
  fetchNext,
  selectedResources,
  setSelectedResources,
}) => {
  const pageSize = 10;

  return (
    <div>
      <Container
        header={
          <Header
            variant='h2'
            description='An overview of the data retrieved by the query.'>
            Results
          </Header>
        }>
        <SpaceBetween direction='vertical' size='l'>
          <ResourceCountAlert />
          <SummaryOverview
            cost={`${getSymbolFromCurrency('USD')}${results.totalCost}`}
            from={dayjs(query.fromDate).format('llll')}
            to={dayjs(query.toDate).format('llll')}
            resultCount={results.resultCount ? results.resultCount : 0}
          />
          <Container
            header={
              <Header
                actions={
                  <ButtonDropdown
                    disabled={R.isEmpty(selectedResources)}
                    variant='primary'
                    onItemClick={addToGraph}
                    items={[
                      {
                        text: 'Add to diagram',
                        id: 'add',
                      },
                    ]}>
                    Actions
                  </ButtonDropdown>
                }
                description='The resources that incurred a cost based on the query executed'
                variant='h2'>
                Resources
              </Header>
            }
            disableContentPaddings>
            <CostTable
              trackBy='id'
              header='Results'
              rows={results.costs}
              columns={columns}
              resultCount={results.resultCount}
              sortColumn={'cost'}
              pageSize={pageSize}
              pageChanged={fetchNext}
              selectedItems={selectedResources}
              onSelectionChange={setSelectedResources}
              selectionType={
                R.equals('getResourcesByCost', queryType) ? 'multi' : undefined
              }
            />
          </Container>
        </SpaceBetween>
      </Container>
    </div>
  );
};

CostQueryResults.propTypes = {
  query: PropTypes.object.isRequired,
  results: PropTypes.object.isRequired,
  selectedResources: PropTypes.array.isRequired,
  setSelectedResources: PropTypes.func.isRequired,
  queryType: PropTypes.string,
  fetchNext: PropTypes.func,
  addToGraph: PropTypes.func
};

export default CostQueryResults;
