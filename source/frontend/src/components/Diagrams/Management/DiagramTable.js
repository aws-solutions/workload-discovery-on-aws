// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useState} from 'react';
import {
  Table,
  Box,
  TextFilter,
  Header,
  Pagination,
  SpaceBetween,
  Button,
  Modal,
  Link,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {CREATE_DIAGRAM, OPEN_DIAGRAM} from '../../../routes';
import { useHistory } from 'react-router-dom';
import * as R from "ramda";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  diagramsPrefix,
  privateLevel,
  publicLevel,
  useListObjects,
  useRemoveObject,
} from "../../Hooks/useS3Objects";
import useLink from "../../Hooks/useLink";

dayjs.extend(relativeTime);

const DiagramTable = () => {
  const [selectedDiagrams, setSelectedDiagrams] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const history = useHistory();
  const {data: privateDiagrams=[], isLoading: loadingPrivate, refetch: refetchPrivate} = useListObjects(diagramsPrefix, privateLevel);
  const {data: publicDiagrams=[], isLoading: loadingPublic, refetch: refetchPublic} = useListObjects(diagramsPrefix, publicLevel);
  const {removeAsync} = useRemoveObject(diagramsPrefix);
  const { handleFollow } = useLink();
  const loading = loadingPrivate || loadingPublic;
  const refreshDiagrams = () => Promise.all([
    refetchPrivate(),
    refetchPublic(),
  ]);

  function link(item){
    return <Link href={OPEN_DIAGRAM.replace(
      ':name',
      item.label
    ).replace(
      ':visibility',
      item.visibility
    )} onFollow={handleFollow}>{item.label}</Link>;
  }

  const columns = [
    {
      id: 'label',
      header: 'Name',
      cell: (e) => link(e),
      width: 350,
      minWidth: 350,
    },
    {
      id: 'visibility',
      header: 'Visibility',
      cell: (e) =>
        e.visibility.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }),
      width: 150,
      minWidth: 150,
    },
    {
      id: 'lastModified',
      header: 'Last modified',
      cell: (e) =>
        R.isNil(e.lastModified) ? 'No data' : dayjs(e.lastModified).fromNow(),

      width: 150,
      minWidth: 150,
    },
  ];

  const mapper = visibility => e => {
    return {
      label: R.split('/', e.key)[1],
      value: e.key,
      visibility: visibility,
      tags: [visibility],
      lastModified: e.lastModified,
    }
  }
  const diagrams = R.concat(
    R.map(mapper(privateLevel), privateDiagrams),
    R.map(mapper(publicLevel), publicDiagrams),
  )

  const {
    items,
    filterProps,
    collectionProps,
    paginationProps,
  } = useCollection(diagrams, {
    filtering: {
      empty: (
        <Box textAlign='center' color='inherit'>
          <b>No Architecture diagrams</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Architecture diagrams to display.
          </Box>
        </Box>
      ),
      noMatch: (
        <Box textAlign='center' color='inherit'>
          <b>No match</b>
          <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
            No Architecture diagrams matched.
          </Box>
        </Box>
      ),
    },
    pagination: { pageSize: 10 },
    sorting: { sortingColumn: 'name' },
  });

  const handleDelete = () => {
    removeAsync({
        key: R.head(selectedDiagrams).label,
        level: R.head(selectedDiagrams).visibility,
      }
    ).then(() => {
      setSelectedDiagrams([]);
      setShowDeleteConfirm(false);
    });
  }

  return (
    <>
      <Modal
        onDismiss={() => setShowDeleteConfirm(false)}
        visible={showDeleteConfirm}
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setShowDeleteConfirm(false)} variant="link">Cancel</Button>
              <Button onClick={handleDelete} variant="primary">Delete</Button>
            </SpaceBetween>
          </Box>
        }
        header="Delete Diagram"
      >
        Permanently delete <strong>{selectedDiagrams.map(i => i.label).join(", ")}</strong>? This cannot be undone.
      </Modal>

      <Table
        {...collectionProps}
        header={
          <Header
            actions={
              <SpaceBetween direction='horizontal' size='xs'>
                <Button
                  disabled={R.isEmpty(selectedDiagrams)}
                  onClick={() => setShowDeleteConfirm(true)}
                  variant='normal'>
                  Delete
                </Button>
                <Button
                  disabled={R.isEmpty(selectedDiagrams)}
                  onClick={() =>
                    history.push(
                      OPEN_DIAGRAM.replace(
                        ':name',
                        R.head(selectedDiagrams).label
                      ).replace(
                        ':visibility',
                        R.head(selectedDiagrams).visibility
                      )
                    )
                  }>
                  Open
                </Button>
                <Button
                  variant={"primary"}
                  onClick={() => history.push(CREATE_DIAGRAM)}>
                  Create
                </Button>
                <Button onClick={() => refreshDiagrams()} iconName='refresh' />
              </SpaceBetween>
            }
            variant='h2'>
            Diagrams
          </Header>
        }
        trackBy={'label'}
        resizableColumns
        stickyHeader
        columnDefinitions={columns}
        items={items}
        loading={loading}
        selectedItems={selectedDiagrams}
        selectionType='single'
        onSelectionChange={(evt) => {
          setSelectedDiagrams(evt.detail.selectedItems);
        }}
        filter={
          <TextFilter {...filterProps} filteringPlaceholder='Find a diagram' />
        }
        empty={
          <Box textAlign='center' color='inherit'>
            <b>No Architecture diagrams</b>
            <Box padding={{ bottom: 's' }} variant='p' color='inherit'>
              No Architecture diagrams to display.
            </Box>
          </Box>
        }
        pagination={<Pagination {...paginationProps} />}
      />
    </>
  );
};

DiagramTable.propTypes = {
};

export default DiagramTable;
