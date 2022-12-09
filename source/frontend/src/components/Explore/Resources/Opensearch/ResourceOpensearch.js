// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Box,
  TextFilter,
  Header,
  Pagination,
  SpaceBetween,
  Table,
} from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import { fetchImage } from '../../../../Utils/ImageSelector';
import {useResourcesSearch} from "../../../Hooks/useResources";

const ResourceOpensearch = () => {
  const [search, setSearch] = React.useState('');
  const {data: resources=[], isLoading} = useResourcesSearch(search)

  const {
    items,
    collectionProps,
    paginationProps,
  } = useCollection(resources, {
    filtering: {
      empty: (
        <Box textAlign='center' color='inherit'>
          <b>No resources</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            Try selecting a resource type from the table above.
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
    sorting: { sortingColumn: 'name' },
  });

  return (
    <SpaceBetween size='l' direction='vertical'>
      <Table
        {...collectionProps}
        filter={
          <TextFilter
            filteringText={search}
            onChange={({ detail }) => setSearch(detail.filteringText)}
            filteringPlaceholder='Find a resource'
          />
        }
        resizableColumns
        loading={isLoading}
        header={<Header>Resources</Header>}
        columnDefinitions={[
          {
            id: 'icon',            
            cell: (e) => <img alt={`${e.resourceType} icon`} src={fetchImage(e.resourceType)} style={{ width: '25px' }} />,
            width: 75,
            minWidth: 50,            
          },
          {
            id: 'resourceId',
            header: 'Name',
            cell: (item) => item.resourceId,
            width: 350,
            minWidth: 250,
          },
          {
            id: 'type',
            header: 'Type',
            cell: (item) => item.resourceType,
            width: 150,
            minWidth: 100,
          },
          {
            id: 'account',
            header: 'Account Id',
            cell: (item) => item.accountId,
            width: 150,
            minWidth: 100,
          },
          {
            id: 'region',
            header: 'Region',
            cell: (item) => item.awsRegion,
            width: 150,
            minWidth: 100,
          },
        ]}
        pagination={<Pagination {...paginationProps} />}
        items={items}
        loadingText='Loading resources'
      />
    </SpaceBetween>
  );
};

export default ResourceOpensearch;
