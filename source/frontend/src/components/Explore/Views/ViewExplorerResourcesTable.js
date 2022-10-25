import React, {useEffect} from 'react';
import {Table, Box, TextFilter, Pagination, SpaceBetween, Button, Header} from '@awsui/components-react';
import { useCollection } from '@awsui/collection-hooks';
import PropTypes from 'prop-types';
import { fetchImage } from '../../../Utils/ImageSelector';
import { useResourceState } from '../../Contexts/ResourceContext';
import { useHistory } from 'react-router-dom';
import * as R from "ramda";
import {useResourcesSearchPaginated} from "../../Hooks/useResources";
import {useDebounce} from "react-use";
import {useBatchGetLinkedNodesHierarchy} from "../../Hooks/useGetLinkedNodesHierarchy";
import {CREATE_DIAGRAM} from "../../../routes";

const pageSize = 10;
const ViewExplorerResourcesTable = ({ selectedView }) => {
  const history = useHistory();
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [, dispatch] = useResourceState();
  const {data: nodeData, refetch: loadSelected, isLoading, isError} = useBatchGetLinkedNodesHierarchy(R.map((x) => x.id, selectedItems));
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [filterText, setFilterText] = React.useState("");
  const [debouncedValue, setDebouncedValue] = React.useState("");
  const [paginationToken, setPaginationToken] = React.useState({
    start: 0,
    end: 1000,
  });
  const {data: resources=[], count: resourceCount=0, isLoading: loadingResources} = useResourcesSearchPaginated(
    debouncedValue,
    paginationToken,
    R.chain((e) => {
      return {
        accountId: e.accountId,
        ...(
          e.regions?.length > 0
            ? {
              regions: R.map((r) => {
                return { name: r.name };
              }, R.pathOr([], ['regions'], e))
            }
            : {}
        ),
      };
    }, R.pathOr([], ['accounts'], selectedView)),
    R.map(
      (r) => r.type,
      R.pathOr([], ['resourceTypes'], selectedView)
    ),
  )

  useEffect(() => {
    if (nodeData && !isError) {
      Promise.resolve(dispatch({
        type: 'updateGraphResources',
        graphResources: nodeData,
      }))
        .then(() => history.push(CREATE_DIAGRAM))
    }
  }, [nodeData, dispatch, history, isError])

  useDebounce(
    () => {
      setDebouncedValue(filterText);
    },
    1000,
    [filterText]
  );

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
      loading={loadingResources}
      header={
        <Header
          actions={
            <SpaceBetween size={"s"} direction={"horizontal"}>
              <Button
                disabled={R.isEmpty(selectedItems)}
                loading={isLoading}
                onClick={loadSelected}
                variant='primary'>
                Add to diagram
              </Button>
            </SpaceBetween>
          }
          counter={`(${resourceCount})`}>
          Resources
        </Header>
      }
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
      columnDefinitions={[
        {
          id: 'icon',
          minWidth: 75,
          width: 75,
          cell: (item) => (
            <img
              src={fetchImage(item.properties.resourceType)}
              style={{ width: '25px' }}
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
          openEnd
        />
      }
      items={items}
    />
  );
};

ViewExplorerResourcesTable.propTypes = {
  selectedView: PropTypes.object.isRequired,
};
export default ViewExplorerResourcesTable;
