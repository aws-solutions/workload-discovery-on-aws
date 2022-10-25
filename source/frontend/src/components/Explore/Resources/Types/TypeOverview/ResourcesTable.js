import React, {useEffect} from 'react';
import {
  Table,
  Header,
  Box,
  TextFilter,
  Pagination,
  Button,
} from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import PropTypes from 'prop-types';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import {
  useResourceState,
} from '../../../../Contexts/ResourceContext';
import { useHistory } from 'react-router-dom';
import { CREATE_DIAGRAM } from '../../../../../routes';
import {useResourcesSearchPaginated} from "../../../../Hooks/useResources";
import * as R from "ramda";
import {useDebounce, useDeepCompareEffect} from "react-use";
import {useBatchGetLinkedNodesHierarchy} from "../../../../Hooks/useGetLinkedNodesHierarchy";

const pageSize = 10;
const ResourcesTable = ({ accounts, resourceTypes=[] }) => {
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [debouncedValue, setDebouncedValue] = React.useState("");
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [paginationToken, setPaginationToken] = React.useState({
    start: 0,
    end: pageSize,
  });
  const {data: resources=[], count: resourceCount=0, isLoading: loadingResources} = useResourcesSearchPaginated(
    debouncedValue,
    paginationToken,
    accounts,
    R.map((e) => e.type, resourceTypes),
  )
  const [{ graphResources }, dispatch] = useResourceState();
  const history = useHistory();
  const {data: nodeData, refetch: loadSelected, isLoading, isError} = useBatchGetLinkedNodesHierarchy(R.map((e) => e.properties.arn, selectedItems), graphResources);

  useDebounce(
    () => {
      setDebouncedValue(filterText);
    },
    1000,
    [filterText]
  );

  useDeepCompareEffect(() => {
    setCurrentPageIndex(1);
    setPaginationToken({
      start: 0,
      end: pageSize
    });
  }, [accounts, resourceTypes]);

  useEffect(() => {
    if (nodeData && !isError) {
      Promise.resolve(dispatch({
        type: 'updateGraphResources',
        graphResources: nodeData,
      }))
        .then(() => history.push(CREATE_DIAGRAM))

    }
  }, [nodeData, dispatch, history, isError])

  const {
    items,
    filterProps,
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
    pagination: { pageSize: pageSize },
    sorting: { sortingColumn: 'name' },
  });

  const handlePageChange = (detail) => {
    let page = detail.currentPageIndex;
    page--;
    setPaginationToken({
      start: pageSize * page,
      end: pageSize * page + pageSize,
    });
    setCurrentPageIndex(detail.currentPageIndex);
  };

  return (
    <Table
      {...collectionProps}
      trackBy={"id"}
      filter={
        <TextFilter
          {...filterProps}
          filteringPlaceholder='Find a resource'
          filteringText={filterText}
          onChange={({ detail }) =>
            setFilterText(detail.filteringText)
          }
        />
      }
      loading={loadingResources}
      selectedItems={selectedItems}
      selectionType='multi'
      onSelectionChange={(e) => {
        dispatch({
          type: 'select',
          resources: e.detail.selectedItems,
        });
        setSelectedItems(e.detail.selectedItems);
      }}
      resizableColumns
      header={
        <Header
          actions={
            <Button
              disabled={R.isEmpty(selectedItems)}
              loading={isLoading}
              onClick={loadSelected}
              variant='primary'>
              Add to diagram
            </Button>
          }
          counter={`(${resourceCount})`}>
          Resources
        </Header>
      }
      columnDefinitions={[
        {
          id: 'icon',
          minWidth: 75,
          width: 75,
          cell: (item) => (
            <img
              src={fetchImage(item.properties.resourceType)}
              style={{ width: '25px', minHeight: "25px" }}
            />
          ),
        },
        {
          id: 'name',
          header: 'Name',
          cell: (item) => item.properties.title,
          minWidth: 250,
          width: 250,
        },
        {
          id: 'type',
          header: 'Type',
          cell: (item) => item.properties.resourceType,
          minWidth: 250,
          width: 250,
        },
        {
          id: 'account',
          header: 'Account Id',
          cell: (item) => item.properties.accountId,
          minWidth: 150,
          width: 150,
        },
        {
          id: 'region',
          header: 'Region',
          cell: (item) => item.properties.awsRegion,
          minWidth: 150,
          width: 150,
        },
      ]}
      pagination={
        <Pagination
          {...paginationProps}
          ariaLabels={{
            nextPageLabel: 'Next page',
            previousPageLabel: 'Previous page',
            pageLabel: (pageNumber) => `Page ${pageNumber} of all pages`,
          }}
          currentPageIndex={currentPageIndex}
          onChange={({ detail }) => handlePageChange(detail)}
          pagesCount={Math.ceil(
            resourceCount / pageSize
          )}
        />
      }
      items={items}
    />
  );
};

ResourcesTable.propTypes = {
  accounts: PropTypes.array,
  resourceTypes: PropTypes.array,
};
export default ResourcesTable;
