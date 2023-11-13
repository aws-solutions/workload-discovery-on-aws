// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Table,
  Box,
  TextFilter,
  Header,
  Pagination,
} from '@cloudscape-design/components';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import { useCollection } from '@cloudscape-design/collection-hooks';
import PropTypes from 'prop-types';
import * as R from "ramda";
import {useResourcesAccountMetadata, useResourcesMetadata} from "../../../../Hooks/useResourcesMetadata";
import {groupSumBy} from "../../../../../Utils/ArrayUtils";
import {
    createTableAriaLabels
} from "../../../../../Utils/AccessibilityUtils";

const mapIndexed = R.addIndex(R.map);

const ResourcesTypes = ({ accounts, onSelection }) => {
  const { data: resources= {accounts: []}, isLoading: loadingResources } = useResourcesMetadata();
  const accountsFilter = R.isEmpty(accounts) ? resources.accounts : accounts;
  const [selectedItems, setSelectedItems] = React.useState([]);
  const { data=[], isLoading } = useResourcesAccountMetadata(accountsFilter, {batchSize: 50});
  const resourceTypes = R.compose(
    groupSumBy('type', 'count'),
    R.chain(e => e.resourceTypes)
  )(data);

  const onSelectionChange = (items) => {
    setSelectedItems(items);
    onSelection(items);
  };

  const getResourceCards = () =>
    mapIndexed((resourceType) => {
      return {
        id: resourceType.type,
        type: resourceType.type,
        icon: (
          <img src={fetchImage(resourceType.type)} style={{ width: '25px', minHeight: '25px' }} />
        ),
        resourceCount: resourceType.count,
      };
    }, resourceTypes);

  const {
    items,
    filterProps,
    collectionProps,
    paginationProps,
  } = useCollection(getResourceCards(), {
    filtering: {
      empty: (
        <Box textAlign='center' color='inherit'>
          <b>No resources</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No resources to display.
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No match</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No resources matched.
          </Box>
        </Box>
      ),
    },
    pagination: { pageSize: 10 },
    sorting: {},
  });

  return (
    <Table
      trackBy='type'
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder='Find a resource type'
        />
      }
      ariaLabels={createTableAriaLabels('resource type', 'resource types', {
          keys: ['type'],
          fallback: 'Unknown resource type'
      }, 'Resources types')}
      {...collectionProps}
      loading={loadingResources || isLoading}
      columnDefinitions={[
        {
          id: 'icon',
          header: 'Icon',
          cell: (item) => item.icon,
          width: 100,
          minWidth: 100,
        },
        {
          id: 'type',
          header: 'Type',
          cell: (item) => item.type,
          width: 275,
          minWidth: 275,
        },
        {
          id: 'resourceCount',
          header: 'Count',
          cell: (item) => item.resourceCount,
          sortingField: 'resourceCount',
          width: 75,
          minWidth: 50,
        },
      ]}
      onSelectionChange={({ detail }) =>
        onSelectionChange(detail.selectedItems)
      }
      selectedItems={selectedItems}
      items={items}
      resizableColumns
      loadingText='Loading resource types'
      selectionType='multi'
      visibleColumns={['icon', 'type', 'resourceCount']}
      empty={
        <Box textAlign='center' color='inherit'>
          <b>No resources</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No resources to display.
          </Box>
        </Box>
      }
      header={
        <Header counter={`(${getResourceCards().length})`}>
          Resources types
        </Header>
      }
      pagination={<Pagination {...paginationProps} />}
    />
  );
};

ResourcesTypes.propTypes = {
  accounts: PropTypes.array,
  onSelection: PropTypes.func.isRequired,
};

export default ResourcesTypes;
