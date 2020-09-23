import React from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import Tooltip from '@material-ui/core/Tooltip';
import { getGroupedResources } from './ResourceGrouper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  item: {
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    marginLeft: '0.5vw',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  div: {
    display: 'grid'
  },
  title: {
    color: '#535B63',
    fontSize: '1rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    lineHeight: '2rem',
    marginBottom: '.5rem'
  },
  image: { width: 20 },
  notState: {
    textTransform: 'capitalize',
    fontSize: '0.75rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    marginLeft: '0.5vw'
  },
  tableIcon: { fontSize: '0.75rem', width: '5%' , fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',},
  tableColumn: { fontSize: '0.75rem', width: '15%', fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif', },
  tableSubHeader: { fontSize: '.75rem' , fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',},
  div: { width: '100%', boxShadow: 'none' },
  toolbar: { backgroundColor: '#fafafa', fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif', }
}));

export default ({
  tableRef,
  results,
  groupNodes,
  columns,
  selectedNodes,
  exportCSV
}) => {
  const classes = useStyles();

  const setSelectedNodes = rows => {
    const nodes = rows.map(node => {
      node.data.id = `${node.data.id}`;
      return node;
    });
    selectedNodes(nodes);
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'Icon',
        field: 'imageUrl',
        cellStyle: { fontSize: '0.75rem', width: '5%' },
        render: rowData => {
          return (
            rowData.data && (
              <Tooltip title={rowData.data.resource.type}>
                <img src={rowData.data.image} className={classes.image} />
              </Tooltip>
            )
          );
        }
      },
      {
        title: 'Name',
        field: 'data.title',
        cellStyle: { fontSize: '0.75rem', width: '15%' }
      },
      {
        title: 'Account',
        field: 'data.resource.accountId',
        cellStyle: { fontSize: '0.75rem', width: '15%' }
      },
      {
        title: 'Region',
        field: 'data.resource.region',
        cellStyle: { fontSize: '0.75rem', width: '15%' },
        width: '10%'
      },
      {
        title: 'Cost',
        field: 'data.cost',
        cellStyle: { fontSize: '0.75rem', width: '15%' },
        width: '15%',
        render: rowData => rowData.data && `$${rowData.data.cost}`
      },
      {
        title: 'Discovered',
        field: 'data.properties.perspectiveBirthDate',
        cellStyle: { fontSize: '0.75rem', width: '15%' },
        render: rowData => {
          return rowData.data && rowData.data.properties.perspectiveBirthDate
            ? new Date(
                rowData.data.properties.perspectiveBirthDate
              ).toLocaleDateString()
            : 'N/A';
        }
      },
      {
        title: 'Deleted',
        field: 'data.properties.softDeleteDate',
        cellStyle: { fontSize: '0.75rem', width: '15%' },
        render: rowData => {
          return rowData.data && rowData.data.properties.softDeleteDate
            ? new Date(
                rowData.data.properties.softDeleteDate
              ).toLocaleDateString()
            : 'N/A';
        }
      }
    ];
    if (groupNodes) {
      columns.unshift(
        {
          title: 'Main Type',
          field: 'mainType',
          cellStyle: { fontSize: '.75rem' }
        },
        {
          title: 'Sub Type',
          field: 'subType',
          cellStyle: { fontSize: '.75rem' }
        }
      );
    }
    return columns;
  };

  const resources = groupNodes ? getGroupedResources(results) : results;
  return (
    <div className={classes.div}
      id='matTable'>
      <MaterialTable
        tableRef={tableRef}
        components={{
          Toolbar: props => (
            <div className={classes.toolbar}>
              <MTableToolbar {...props} />
            </div>
          )
        }}
        title='Resources'
        columns={columns ? columns : getColumns()}
        parentChildData={(row, rows) => {
          return groupNodes ? rows.find(a => a.id === row.parentId) : undefined;
        }}
        data={resources}
        options={{
          exportButton: exportCSV,
          paging: false,
          filtering: false,
          showTitle: false,
          toolbar: exportCSV,
          sorting: true,
          grouping: false,
          search: false,
          selection: selectedNodes !== undefined,
          headerStyle: {
            backgroundColor: '#fafafa',
            color: '#212529',
            border: 'none',
            position: 'sticky',
            top: 0,
            fontSize: '1.0rem'
          },
          maxBodyHeight: `${window.innerHeight / 2}px`,
          rowStyle: {
            backgroundColor: '#fff',
            color: '#212529',
            borderTop: '1px solid #E0E0E0',
            fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif'
          }
        }}
        onSelectionChange={rows => setSelectedNodes(rows)}
      />
    </div>
  );
};
