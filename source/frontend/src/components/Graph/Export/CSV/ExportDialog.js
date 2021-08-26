import React, { useState, useRef } from 'react';
import {
  Modal,
  Box,
  Button,
  SpaceBetween,
  Input,
  FormField,
  Container,
  Grid,
  Header,
} from '@awsui/components-react';
import { CsvBuilder } from 'filefy';
import ExportTable from './ExportTable';
import PropTypes from 'prop-types';

const validFilename = require('valid-filename');

const columns = [
  {
    id: 'type',
    header: 'Type',
    cell: (e) => e.type,
    sortingField: 'type',
    width: 250,
    minWidth: 250,
  },
  {
    id: 'name',
    header: 'Name',
    cell: (e) => e.name,
    sortingField: 'name',
    width: 150,
    minWidth: 150,
  },
  {
    id: 'account',
    header: 'Account Id',
    cell: (e) => e.accountId,
    sortingField: 'accountId',
    width: 150,
    minWidth: 150,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.region,
    sortingField: 'region',
    width: 150,
    minWidth: 150,
  },
  {
    id: 'cost',
    header: 'Estimated cost',
    cell: (e) => e.cost,
    sortingField: 'cost',
    width: 300,
    minWidth: 300,
  },
];

function createData(id, type, name, accountId, region, cost) {
  return {
    id,
    type,
    name,
    accountId,
    region,
    cost,
  };
}

function createExportRow(type, name, accountId, region, cost) {
  return { type, name, accountId, region, cost };
}

const ExportDialog = ({ nodes, toggleDialog }) => {
  const [filename, setFilename] = useState();
  const [delimiter, setDelimeter] = useState(',');
  const [error, setError] = useState(false);

  const resources = nodes.nodes
    ? nodes.nodes.filter((item) => !item.edge && item.data.type === 'resource')
    : [];

  const getRows = () => {
    return resources.map((e) =>
      createData(
        e.data.id,
        e.data.resource.type,
        e.data.title,
        e.data.resource.accountId,
        e.data.resource.region,
        e.data.cost
      )
    );
  };

  const getExportRows = () => {
    return resources.map((e) =>
      createExportRow(
        e.data.resource.type,
        e.data.title,
        e.data.resource.accountId,
        e.data.resource.region,
        e.data.cost
      )
    );
  };

  const defaultExportCsv = () =>
    new CsvBuilder(`${filename}.csv`)
      .setDelimeter(delimiter)
      .setColumns(columns.map((column) => column.header))
      .addRows(getExportRows().map((e) => Object.values(e)))
      .exportFile();

  const handleDownload = () => {
    if (validFilename(filename)) {
      setError(false);
      defaultExportCsv();
    } else {
      setError(true);
    }
  };

  return (
    <Modal
      onDismiss={toggleDialog}
      visible={true}
      closeAriaLabel='Close modal'
      size='large'
      footer={
        <Box float='right'>
          <SpaceBetween direction='horizontal' size='xs'>
            <Button onClick={toggleDialog} variant='link'>
              Close
            </Button>
            <Button
              variant='primary'
              iconName='download'
              onClick={defaultExportCsv}>
              Download
            </Button>
          </SpaceBetween>
        </Box>
      }
      header='Export as CSV'>
      <SpaceBetween direction='vertical' size='l'>
        <Container header={<Header variant='h2'>File details</Header>}>
          <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
            <FormField
              label='File name'
              errorText={error ? 'Please enter a valid file name' : null}
              description='Provide a name for the CSV file'>
              <Input
                value={filename}
                onChange={({ detail }) => setFilename(detail.value)}
              />
            </FormField>
            <FormField
              label='File delimiter'
              description='Provide the delimiter to use in your CSV'>
              <Input
                value={delimiter}
                onChange={({ detail }) => setDelimeter(detail.value)}
              />
            </FormField>
          </Grid>
        </Container>
        <ExportTable
          trackBy='id'
          rows={getRows()}
          columns={columns}
          sortColumn={'region'}
          pageSize={10}
        />
      </SpaceBetween>
    </Modal>
  );
};

ExportDialog.propTypes = {
  title: PropTypes.string.isRequired,
  blob: PropTypes.object.isRequired,
  toggleDialog: PropTypes.bool.isRequired,
};

export default ExportDialog;
