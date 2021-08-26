import * as React from 'react';
import {
  Form,
  SpaceBetween,
  Button,
  Header,
  FormField,
  Container,
  Toggle,
  ColumnLayout,
  Grid,
  DatePicker,
} from '@awsui/components-react/';
import {
  getCostForResource,
  handleResponse,
  wrapCostAPIRequest,
} from '../../../../API/Handlers/CostsGraphQLHandler';
import Flashbar from '../../../../Utils/Flashbar/Flashbar';

const R = require('ramda');
const dayjs = require('dayjs');
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);

const processCosts = (response, parent) =>
  R.pathOr([], [parent, 'costItems'], response).map((e, index) => {
    e.id = index;
    return e;
  });

const processQueryDetails = (response) =>
  R.pathOr([], ['getResourcesByCost', 'queryDetails'], response);

const processTotalCost = (response) =>
  R.pathOr(0, ['getResourcesByCost', 'totalCost'], response);

export default ({
  onChange,
  resources,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}) => {
  const pageSize = 10;
  const [loading, setLoading] = React.useState(false);
  const [costs, setCosts] = React.useState([]);
  const [queryDetails, setQueryDetails] = React.useState({});

  const [totalCost, setTotalCost] = React.useState(0);
  const [resultCount, setResultCount] = React.useState(0);
  const [error, setError] = React.useState();

  const queryCostAPI = () => {
    setLoading(true);
    return wrapCostAPIRequest(getCostForResource, {
      costForResourceQuery: {
        pagination: {
          start: 0,
          end: resources.filter((e) => !R.isNil(e.data.resource.arn)).length,
        },
        resourceIds: resources
          .filter((e) => !R.isNil(e.data.resource.arn))
          .map((e) => e.data.resource.arn),
        period: { from: fromDate, to: toDate },
      },
    });
  };

  const onSubmit = () => {
    setLoading(true);
    queryCostAPI()
      .then(handleResponse)
      .then((response) => {
        setError();
        setLoading(false);
        setTotalCost(processTotalCost(response.body.data));
        setCosts(processCosts(response.body.data, 'getCostForResource'));
        setQueryDetails(processQueryDetails(response.body.data));
        setResultCount(processQueryDetails(response.body.data).resultCount);
        onChange(processCosts(response.body.data, 'getCostForResource'));
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  const datesValid = () =>
    R.and(
      dayjs(fromDate).isBefore(dayjs(toDate)),
      dayjs(toDate).isAfter(dayjs(fromDate))
    );

  return (
    <Container
      header={
        <Header
          description='Change the time period that cost data is calculated.'
          variant='h2'>
          Time period
        </Header>
      }>
      {error && (
        <Flashbar
          type='error'
          message='We could not submit that query. Have you enabled Cost Processing in Settings?'
        />
      )}
      <Form
        actions={
          <Button onClick={onSubmit} variant='primary' loading={loading}>
            Submit
          </Button>          
        }>
        <SpaceBetween direction='horizontal' size='l'>
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
            />
          </FormField>
        </SpaceBetween>
      </Form>
    </Container>
  );
};
