// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react';
import CostAccountsAndRegionsSelector from './CostAccountsAndRegionsSelector';
import CostQueryTypeSelector from './CostQueryTypeSelector';
import { Button, Form, SpaceBetween } from '@cloudscape-design/components';
import {
  getCostForResource,
  getCostForService,
  getResourcesByCost,
} from '../../../API/Handlers/CostsGraphQLHandler';
import dayjs from 'dayjs';
import Breadcrumbs from '../../../Utils/Breadcrumbs';
import { fetchNextPage, sendCostQuery } from './Utils/CostAPIQuery';
import CostServiceQuerySelector from './CostServiceQuerySelector';
import CostARNQuerySelector from './CostARNQuerySelector';
import getSymbolFromCurrency from 'currency-symbol-map';
import SummaryOverview from './SummaryOverview';
import {COSTS, CREATE_DIAGRAM} from '../../../routes';
import { useResourceState } from '../../Contexts/ResourceContext';
import { useHistory } from 'react-router-dom';
import * as R from "ramda";
import {useAccounts} from "../../Hooks/useAccounts";
import CostTable from "./CostTable";
import {useGetResourceGraph} from "../../Hooks/useGetResourceGraph";

const processCosts = (response, queryType) =>
  R.pathOr([], [queryType, 'costItems'], response).map((e, index) => {
    e.id = index;
    return e;
  });

const processQueryDetails = (response, queryType) =>
  R.pathOr([], [queryType, 'queryDetails'], response);

const processTotalCost = (response, queryType) => {
  return R.pathOr(0, [queryType, 'totalCost'], response);
};

const CostsPage = () => {
  const [costResponse, setCostResponse] = useState({});
  const [queryType, setQueryType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [dateInterval, setDateInterval] = useState({
    type: 'absolute',
    startDate: dayjs()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: dayjs()
      .endOf('month')
      .format('YYYY-MM-DD'),
  });
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [resultsQueryType, setResultsQueryType] = useState(null);
  const [arns, setARNs] = useState([]);
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
  const [, dispatch] = useResourceState();
  const {data: nodeData, refetch: loadSelected, isError} = useGetResourceGraph(R.map((id) => id.line_item_resource_id, selectedResources));

  const history = useHistory();

  useEffect(() => {
    if (nodeData && !isError) {
      Promise.resolve(dispatch({
        type: 'updateGraphResources',
        graphResources: nodeData,
      }))
        .then(() => history.push(CREATE_DIAGRAM))
    }
  }, [nodeData, dispatch, history, isError])

  const fetchNext = (pagination) => {
    setLoading(true);
    fetchNextPage(pagination, costResponse.queryDetails)
      .then((response) => {
        setCostResponse({
          totalCost: costResponse.totalCost,
          costs: processCosts(response.body.data, 'readResultsFromS3'),
          queryDetails: processQueryDetails(
            response.body.data,
            'readResultsFromS3'
          ),
          resultCount: processQueryDetails(
            response.body.data,
            'readResultsFromS3'
          ).resultCount,
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const queryCostAPI = (queryToExecute) => {
    setLoading(true);
    return sendCostQuery(queryToExecute)
      .then((response) => {
        setLoading(false);
        setResultsQueryType(queryType);
        setCostResponse({
          totalCost: processTotalCost(
            response.body.data,
            queryToExecute.queryType
          ),
          costs: processCosts(response.body.data, queryToExecute.queryType),
          queryDetails: processQueryDetails(
            response.body.data,
            queryToExecute.queryType
          ),
          resultCount: processQueryDetails(
            response.body.data,
            queryToExecute.queryType
          ).resultCount,
        });
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const buildResults = () => {
    return {
      costs: costResponse.costs,
      queryDetails: costResponse.queryDetails,
      totalCost: costResponse.totalCost,
      resultCount: costResponse.resultCount,
    };
  };

  const processAccounts = () =>
    R.isEmpty(selectedAccounts)
      ? R.uniq(R.chain((e) => e.value, accounts))
      : R.uniq(R.chain((e) => e.value, selectedAccounts));

  const processRegions = () =>
    R.isEmpty(selectedRegions)
      ? R.uniq(R.chain((e) => R.map((x) => x.value, e.regions), accounts))
      : R.uniq(R.chain((e) => e.value, selectedRegions));

  const getQuery = () => {
    switch (queryType) {
      case 'all':
        return {
          queryType: 'getResourcesByCost',
          queryFunction: getResourcesByCost,
          queryOptions: {
            resourcesByCostQuery: {
              accountIds: processAccounts(),
              pagination: { start: 0, end: 10 },
              regions: processRegions(),
              period: {
                from: dateInterval.startDate,
                to: dateInterval.endDate,
              },
            },
          },
        };
      case 'service':
        return {
          queryType: 'getCostForService',
          queryFunction: getCostForService,
          queryOptions: {
            costForServiceQuery: {
              accountIds: processAccounts(),
              pagination: { start: 0, end: 10 },
              regions: processRegions(),
              serviceName: R.propOr('*', ['label'], selectedService),
              period: {
                from: dateInterval.startDate,
                to: dateInterval.endDate,
              },
            },
          },
        };
      case 'arn':
        return {
          queryType: 'getCostForResource',
          queryFunction: getCostForResource,
          queryOptions: {
            costForResourceQuery: {
              pagination: { start: 0, end: 10 },
              resourceIds: R.map(
                (e) => R.propOr('*', ['resourceArn'], e),
                arns
              ),
              period: {
                from: dateInterval.startDate,
                to: dateInterval.endDate,
              },
            },
          },
        };
      default:
        break;
    }
  };

  const getQuerySpecificForm = () => {
    switch (queryType) {
      case 'service':
        return (
          <CostServiceQuerySelector
            selectedService={selectedService}
            setSelectedService={setSelectedService}
          />
        );
      case 'arn':
        return <CostARNQuerySelector arns={arns} setARNs={setARNs} />;
      default:
        break;
    }
  };

  const isReadyToSubmit = () => {
    if (queryType === 'service') return !!selectedService
    if (queryType === 'arn') return arns.length > 0 && arns.every(i => !!i.resourceArn)
    return true
  }

  return (
    <SpaceBetween size='l'>
      <Breadcrumbs items={[{ text: 'Costs', href: COSTS }]} />
      <Form
        actions={
          <SpaceBetween direction='horizontal' size='s'>
            <Button
              loading={loading}
              disabled={!isReadyToSubmit()}
              onClick={(e) => {
                e.preventDefault();
                return queryCostAPI(getQuery());
              }}
              variant='primary'>
              Calculate Costs
            </Button>
          </SpaceBetween>
        }>
        <SpaceBetween size='l'>
          <CostQueryTypeSelector
            queryType={queryType}
            setQueryType={setQueryType}
          />
          <CostAccountsAndRegionsSelector
            selectedAccounts={selectedAccounts}
            setSelectedAccounts={setSelectedAccounts}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            setDateInterval={setDateInterval}
          />
          {getQuerySpecificForm()}
        </SpaceBetween>
      </Form>
      {!R.isEmpty(costResponse) && (
        <>
          <SummaryOverview
            cost={`${getSymbolFromCurrency('USD')}${buildResults().totalCost}`}
            from={dayjs(dateInterval.startDate).format('llll')}
            to={dayjs(dateInterval.endDate).format('llll')}
            resultCount={
              buildResults().resultCount ? buildResults().resultCount : 0
            }
          />

          <CostTable
            addToGraph={resultsQueryType !== "service" ? loadSelected : null}
            results={buildResults()}
            pageChanged={fetchNext}
            selectedItems={selectedResources}
            onSelectionChange={setSelectedResources}
            selectionType={
              R.includes(resultsQueryType, ['all', 'arn']) ? 'multi' : "single"
            }
          />
        </>
      )}
    </SpaceBetween>
  );
};

export default CostsPage;
