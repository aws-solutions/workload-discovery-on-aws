import * as React from 'react';
import Form from '@awsui/components-react/form';
import SpaceBetween from '@awsui/components-react/space-between';
import Button from '@awsui/components-react/button';
import Header from '@awsui/components-react/header';
import ExpandableSection from '@awsui/components-react/expandable-section';
import FormField from '@awsui/components-react/form-field';
import Container from '@awsui/components-react/container';
import Multiselect from '@awsui/components-react/multiselect';
import ColumnLayout from '@awsui/components-react/column-layout';
import DatePicker from '@awsui/components-react/date-picker';
import getSymbolFromCurrency from 'currency-symbol-map';
import { services } from '../../../../Utils/Dictionaries/service-names';

import PropTypes from 'prop-types';

import {
  wrapRequest,
  getAccounts,
} from '../../../../API/Handlers/SettingsGraphQLHandler';
import {
  getResourcesByCost,
  handleResponse,
  getCostForService,
  getCostForResource,
} from '../../../../API/Handlers/CostsGraphQLHandler';
import Flashbar from '../../../../Utils/Flashbar/Flashbar';
import { Input, RadioGroup, Select } from '@awsui/components-react';
import AttributeCreator from '../../../../Utils/Forms/AttributeCreator';
import QueryDetails from './QueryDetails';
import { getRegions } from './Utils/CostUtils';

const R = require('ramda');
const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

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

const CostQueryForm = ({ executeQuery, loading, queryDetails }) => {
  const [fromDate, setFromDate] = React.useState(
    dayjs().startOf('month').format('YYYY-MM-DD')
  );
  const [toDate, setToDate] = React.useState(dayjs().format('YYYY-MM-DD'));
  const [selectedAccounts, setSelectedAccounts] = React.useState([]);
  const [selectedRegions, setSelectedRegions] = React.useState([]);
  const [selectedService, setSelectedService] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [queryType, setQueryType] = React.useState('all');
  const [error, setError] = React.useState();
  const [resourceItems, setResourceItems] = React.useState([]);

  React.useEffect(() => {
    wrapRequest(getAccounts)
      .then(handleResponse)
      .then((response) =>
        response.body.data.getAccounts.map((account) => {
          accounts.push({
            accountId: account.accountId,
            regions: account.regions,
            visible: true,
          });
          setAccounts(
            accounts.map((account, index) => {
              return {
                label: account.accountId,
                id: index,
                value: account.accountId,
                regions: account.regions.map((region, id) => {
                  return { value: region.name, label: region.name, id: id };
                }),
              };
            })
          );
        })
      )
      .then(setError())
      .catch((err) => setError(err));
  }, []);

  const definition = React.useMemo(
    () => [
      {
        label: 'Resource',
        control: ({ resourceArn = '' }, itemIndex) => (
          <Control
            prop='resourceArn'
            value={resourceArn}
            index={itemIndex}
            placeholder={'Enter a Resource Id or ARN'}
            setItems={setResourceItems}
          />
        ),
      },
    ],
    []
  );

  const datesValid = () =>
    R.and(
      dayjs(fromDate).isBefore(dayjs(toDate)),
      dayjs(toDate).isAfter(dayjs(fromDate))
    );

  const getQuery = () => {
    if (R.equals(queryType, 'all')) {
      return {
        queryType: 'getResourcesByCost',
        queryFunction: getResourcesByCost,
        queryOptions: {
          resourcesByCostQuery: {
            accountIds: R.isEmpty(selectedAccounts)
              ? accounts.map((account) => account.label)
              : selectedAccounts.map((account) => account.label),
            pagination: { start: 0, end: 10 },
            regions: getRegions(selectedRegions, selectedAccounts, accounts),
            period: { from: fromDate, to: toDate },
          },
        },
      };
    }
    if (R.equals(queryType, 'service')) {
      return {
        queryType: 'getCostForService',
        queryFunction: getCostForService,
        queryOptions: {
          costForServiceQuery: {
            accountIds: R.empty(selectedAccounts)
              ? accounts.map((account) => account.label)
              : selectedAccounts.map((account) => account.label),
            pagination: { start: 0, end: 10 },
            regions: getRegions(selectedRegions, selectedAccounts, accounts),
            serviceName: selectedService.value,
            period: { from: fromDate, to: toDate },
          },
        },
      };
    }
    if (R.equals(queryType, 'arn')) {
      return {
        queryType: 'getCostForResource',
        queryFunction: getCostForResource,
        queryOptions: {
          costForResourceQuery: {
            pagination: { start: 0, end: 10 },
            resourceIds: resourceItems
              .filter((e) => !R.isNil(e.resourceArn))
              .map((e) => R.trim(e.resourceArn)),
            period: { from: fromDate, to: toDate },
          },
        },
      };
    }
  };

  return (
    <div>
      {error && (
        <Flashbar
          type='error'
          message='We could not submit that query. Have you enabled Cost Processing in Settings?'
        />
      )}
      <Container
        header={
          <Header
            variant='h2'
            description='Specify the parameters of the Cost & Usage Report query'>
            Query
          </Header>
        }>
        <SpaceBetween direction='vertical' size='l'>
          <Form
            actions={
              <Button
                variant='primary'
                loading={loading}
                onClick={() => executeQuery(getQuery())}>
                Submit
              </Button>
            }>
            <ColumnLayout columns={1}>
              <RadioGroup
                onChange={({ detail }) => setQueryType(detail.value)}
                value={queryType}
                items={[
                  {
                    value: 'all',
                    label: 'Query all Resources',
                    description:
                      'Build a query that will return resources with the highest cost first.',
                  },
                  {
                    value: 'service',
                    label: 'Query by Service',
                    description:
                      'Build a query that will return cost data for a particular AWS Service',
                  },
                  {
                    value: 'arn',
                    label: 'Query by Id/ARN',
                    description:
                      'Build a query that will return cost data for the provided Resource Ids or Amazon Resource Names (ARNs)',
                  },
                ]}
              />
              <FormField label='Account Ids'>
                <Multiselect
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
              <FormField label='Regions'>
                <Multiselect
                  disabled={R.isEmpty(selectedAccounts)}
                  selectedOptions={selectedRegions}
                  onChange={({ detail }) =>
                    setSelectedRegions(detail.selectedOptions)
                  }
                  deselectAriaLabel={(e) => 'Remove ' + e.label}
                  options={R.chain((e) => e.regions, selectedAccounts)}
                  placeholder='All regions'
                  selectedAriaLabel='Selected'
                />
              </FormField>
              {R.equals(queryType, 'service') && (
                <FormField label='Service name'>
                  <Select
                    selectedOption={selectedService}
                    onChange={({ detail }) =>
                      setSelectedService(detail.selectedOption)
                    }
                    options={services.map((e) => {
                      return { label: e.service, value: e.service };
                    })}
                    filteringType='auto'
                    selectedAriaLabel='Selected'
                  />
                </FormField>
              )}
              {R.equals(queryType, 'arn') && (
                <AttributeCreator
                  item='Resource Id'
                  items={resourceItems}
                  label='Amazon Resource Id'
                  placeholder='Enter a Resource Id or ARN'
                  itemAdded={() => setResourceItems([...resourceItems, {}])}
                  itemRemoved={(itemIndex) => {
                    const tmpItems = [...resourceItems];
                    tmpItems.splice(itemIndex, 1);
                    setResourceItems(tmpItems);
                  }}
                  setItems={setResourceItems}
                  definition={definition}
                />
              )}
              <FormField
                label='From'
                errorText={
                  !datesValid() ? "Cannot occur before 'To' date" : undefined
                }>
                <DatePicker
                  invalid={!datesValid()}
                  onChange={({ detail }) => setFromDate(detail.value)}
                  value={fromDate}
                  nextMonthAriaLabel='Next month'
                  placeholder='YYYY/MM/DD'
                  previousMonthAriaLabel='Previous month'
                  todayAriaLabel='Today'
                  isDateEnabled={(date) =>
                    new dayjs(date).isBefore(new dayjs())
                  }
                />
              </FormField>
              <FormField
                label='To'
                errorText={
                  !datesValid() ? "Cannot occur after 'From' date" : undefined
                }>
                <DatePicker
                  invalid={!datesValid()}
                  onChange={({ detail }) => setToDate(detail.value)}
                  value={toDate}
                  nextMonthAriaLabel='Next month'
                  placeholder='YYYY/MM/DD'
                  previousMonthAriaLabel='Previous month'
                  todayAriaLabel='Today'
                  isDateEnabled={(date) =>
                    new dayjs(date).isBefore(new dayjs())
                  }
                />
              </FormField>
            </ColumnLayout>
          </Form>
        </SpaceBetween>

        <ExpandableSection header='Query details'>
          <QueryDetails queryDetails={queryDetails} />
        </ExpandableSection>
      </Container>
    </div>
  );
};

CostQueryForm.propTypes = {
  executeQuery: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  queryDetails: PropTypes.object.isRequired,
};

export default CostQueryForm;
