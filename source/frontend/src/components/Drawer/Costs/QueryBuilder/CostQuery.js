import * as React from 'react';

import CostQueryResults from './CostQueryResults';
import CostQueryForm from './CostQueryForm';
import PropTypes from 'prop-types';
import { Grid, SpaceBetween } from '@awsui/components-react';
import {
  handleResponse,
  readResultsFromS3,
  wrapCostAPIRequest,
} from '../../../../API/Handlers/CostsGraphQLHandler';
import dayjs from 'dayjs';

const R = require('ramda');

const processCosts = (response, queryType) =>
  R.pathOr([], [queryType, 'costItems'], response).map((e, index) => {
    e.id = index;
    return e;
  });

const processQueryDetails = (response, queryType) =>
  R.pathOr([], [queryType, 'queryDetails'], response);

const processTotalCost = (response, queryType) =>
  R.pathOr(0, [queryType, 'totalCost'], response);

const CostQuery = ({
  selectedResources,
  setSelectedResources,
  handleNodeSelect,
}) => {
  const [selection, setSelection] = React.useState('all');
  const [totalCost, setTotalCost] = React.useState(0);
  const [resultCount, setResultCount] = React.useState(0);
  const [costs, setCosts] = React.useState([]);
  const [query, setQuery] = React.useState({});
  const [queryDetails, setQueryDetails] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const queryCostAPI = (queryToExecute) => {
    setLoading(true);
    setQuery(queryToExecute);
    wrapCostAPIRequest(
      queryToExecute.queryFunction,
      queryToExecute.queryOptions
    )
      .then(handleResponse)
      .then((response) => {
        setError();
        setLoading(false);
        setTotalCost(
          processTotalCost(response.body.data, queryToExecute.queryType)
        );
        setCosts(processCosts(response.body.data, queryToExecute.queryType));
        setQueryDetails(
          processQueryDetails(response.body.data, queryToExecute.queryType)
        );
        setResultCount(
          processQueryDetails(response.body.data, queryToExecute.queryType)
            .resultCount
        );
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  const fetchNext = (pagination) => {
    setLoading(true);
    wrapCostAPIRequest(readResultsFromS3, {
      s3Query: {
        bucket: queryDetails.s3Bucket,
        key: queryDetails.s3Key,
        pagination: pagination,
      },
    })
      .then(handleResponse)
      .then((response) => {
        setError();
        setCosts(processCosts(response.body.data, 'readResultsFromS3'));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  const buildResults = () => {
    return {
      costs: costs,
      queryDetails: queryDetails,
      totalCost: totalCost,
      resultCount: queryDetails.resultCount,
    };
  };

  const buildQuery = () => {
    return {
      toDate: R.pathOr(dayjs().format('YYYY-MM-DD'), ['queryOptions', R.prop('queryType', query), 'period', 'to'], query),
      fromDate: R.pathOr(dayjs().startOf('month').format('YYYY-MM-DD'), ['queryOptions', R.prop('queryType', query), 'period', 'from'], query)
    };
  };

  return (
    <Grid gridDefinition={[{ colspan: 3 }, { colspan: 8 }]}>
      <CostQueryForm executeQuery={queryCostAPI} loading={loading} queryDetails={queryDetails}/>
      <CostQueryResults
        addToGraph={handleNodeSelect}
        queryType={R.prop('queryType', query)}
        query={buildQuery()}
        results={buildResults()}
        selectedResources={selectedResources}
        setSelectedResources={setSelectedResources}
        handleNodeSelect={handleNodeSelect}
        fetchNext={fetchNext}
      />
    </Grid>
  );
};

CostQuery.propTypes = {
  selectedResources: PropTypes.array.isRequired,
  setSelectedResources: PropTypes.func.isRequired,
  handleNodeSelect: PropTypes.func.isRequired,
};

export default CostQuery;
