import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { DialogTitle } from '../../../Utils/Dialog/DialogTitle';
import ResourceTable from '../../Resources/ResourceTable';
import { Typography } from '@material-ui/core';
import { CsvBuilder } from 'filefy';
import FormField from '../../../Utils/Forms/FormField';
import FormAutoComplete from '../../../Utils/Forms/FormAutoComplete';
import ResourceItem from '../DetailsDialog/ResourceItem';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { filenameValidator } from '../../../Utils/Validators/FilenameValidator';

const getColumns = () => {
  const columns = [
    {
      title: 'Type',
      field: 'data.resource.type',
      cellStyle: {
        fontSize: '0.75rem',
        width: '5%',
        fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
      },
    },
    {
      title: 'Name',
      field: 'data.title',
      cellStyle: {
        fontSize: '0.75rem',
        width: '25%',
        fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
      },
    },
    {
      title: 'Account',
      field: 'data.resource.accountId',
      cellStyle: {
        fontSize: '0.75rem',
        width: '25%',
        fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
      },
    },
    {
      title: 'Region',
      field: 'data.resource.region',
      cellStyle: {
        fontSize: '0.75rem',
        width: '25%',
        fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
      },
    },
    {
      title: 'Cost',
      field: 'data.cost',
      cellStyle: {
        fontSize: '0.75rem',
        width: '25%',
        fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
      },
      render: (rowData) => rowData.data && `$${rowData.data.cost}`,
    },
  ];
  return columns;
};

const styles = makeStyles((theme) => ({
  dialogPaper: {
    minHeight: '30vh',
    maxHeight: '75vh',
    width: '100vw',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  actions: {
    borderTop: '1px solid #eaeded',
    padding: '0 1%',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  header: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    background: '#fafafa',
  },
  label: {
    marginBottom: '1vh',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  root: {
    marginTop: '2vh',
    marginBottom: '2vh',
  },
  singleButton: {
    width: '15%',
    marginTop: '1vh',
    marginBottom: '1vh',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    float: 'right',
    // position: 'absolute',
    // right: '0',
    // top: '0',
    cursor: 'pointer',
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
  },
  button: {
    // width: '15%',
    margin: '1%',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
  },
  clearButton: {
    // width: '15%',
    margin: '1%',
    backgroundColor: '#fff',
    // borderColor: '#000',
    color: '#000',
    // borderRadius: '2px',
    // border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#fafafa',
      // borderColor: '#000'
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#fafafa',
      // borderColor: '#000'
    },
  },
  gridParent: {
    paddingLeft: '1vw',
    paddingRight: '1vw',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  divider: {
    margin: '0 5% 0 5%',
  },
  div: { display: 'inline-flex', margin: '1% 0 1% 0', width: '100%' },
  resourceItemTitleStyle: {
    color: '#545b64',
    fontSize: '1rem',
    lineHeight: '2rem',
    marginBottom: '1%',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  resourceItemValueStyle: {
    fontSize: '0.75rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  margin: { margin: '1% 0 1% 0' },
}));

export default ({ nodes, toggleDialog }) => {
  const [showExportDialog, setShowExportDialog] = useState(true);
  const [filename, setFilename] = useState(undefined);
  const [delimiter, setDelimeter] = useState(',');
  const [filenameError, setFilenameError] = useState(false);
  const [filenameHelperText, setFilenameHelperText] = useState(undefined);
  const tableRef = useRef(undefined);

  const classes = styles();

  const resources = nodes.nodes
    ? nodes.nodes.filter((item) => !item.edge && item.data.type === 'resource')
    : [];

  const defaultExportCsv = () => {
    const columns = tableRef.current.state.columns
      .filter((columnDef) => {
        return (
          !columnDef.hidden && columnDef.field && columnDef.export !== false
        );
      })
      .sort((a, b) =>
        a.tableData.columnOrder > b.tableData.columnOrder ? 1 : -1
      );
    const dataToExport = tableRef.current.state.renderData;
    const data = dataToExport.map((rowData) =>
      columns.map((columnDef) => {
        return tableRef.current.dataManager.getFieldValue(rowData, columnDef);
      })
    );

    const builder = new CsvBuilder(`${filename}.csv`);
    builder
      .setDelimeter(delimiter)
      .setColumns(columns.map((columnDef) => columnDef.title))
      .addRows(data)
      .exportFile();
    setShowExportDialog(!showExportDialog);
  };

  const handleFilename = (input) => {
    const validation = filenameValidator(input.target.value);
    setFilenameError(!validation.valid);
    setFilenameHelperText(validation.reason);
    setFilename(validation.valid ? validation.input : undefined);
  };

  const handleClose = () => {
    toggleDialog();
    setShowExportDialog(!showExportDialog);
  };

  return (
    <Dialog
      open={showExportDialog}
      onClose={handleClose}
      maxWidth={'lg'}
      scroll={'paper'}
      classes={{ paper: classes.dialogPaper }}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
      aria-labelledby='form-dialog-title'>
      <DialogTitle onClose={() => handleClose()}>Export Architecture Diagram</DialogTitle>
      <DialogContent>
        <Typography className={classes.label} variant='body2'>
          Give your CSV a name and optionally, change the delimiter
        </Typography>
        <div className={classes.root}>
          <Grid container className={classes.gridParent}>
            <Grid item xs>
              <ResourceItem
                title='Selected'
                resource={nodes.title}
                titleStyle={classes.resourceItemTitleStyle}
                valueStyle={classes.resourceItemValueStyle}
              />
            </Grid>
            <Divider
              orientation='vertical'
              flexItem
              className={classes.divider}
            />
            <Grid item xs>
              <ResourceItem
                title='No. of Resources'
                resource={resources.length}
                titleStyle={classes.resourceItemTitleStyle}
                valueStyle={classes.resourceItemValueStyle}
              />
            </Grid>
          </Grid>
        </div>
        <div className={classes.div}>
          <FormField
            onInput={(input) => handleFilename(input)}
            label='File name'
            description='Enter the name you would like to use'
            width='100%'
            margin='0 1% 1% 1%'
            error={filenameError}
            helper={filenameHelperText}
          />
          <FormAutoComplete
            onSelected={(input) => setDelimeter(input.value)}
            label='Column Delimiter'
            description='Select the delimiter for your CSV'
            width='100%'
            margin='0 1% 1% 1%'
            options={[
              { value: ',', label: ',', id: 'comma' },
              { value: ';', label: ';', id: 'semi-colon' },
            ]}
            multiSelect={false}
            placeholder={{ value: ',', label: ',', id: 'comma' }}
          />
        </div>
        <div className={classes.margin}>
          <ResourceTable
            tableRef={tableRef}
            results={resources}
            groupNodes={false}
            columns={getColumns()}
            exportCSV={false}
          />
        </div>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button className={classes.clearButton} onClick={handleClose}>
          Close
        </Button>
        <Button
          disabled={filename === undefined}
          className={classes.button}
          onClick={defaultExportCsv}>
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};
