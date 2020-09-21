import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { fetchImage } from '../../../../../../Utils/ImageSelector';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { uploadObject } from '../../../../../../API/Storage/S3Store';
import { useResourceState } from '../../../../../Contexts/ResourceContext';
import Button from '@material-ui/core/Button';
import { useGraphState } from '../../../../../Contexts/GraphContext';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import FormField from '../../../../../../Utils/Forms/FormField';
var uniqBy = require('lodash.uniqby');

const columns = [
  { id: 'checkbox', label: 'Resource Type', minWidth: 150, align: 'left' },
  { id: 'icon', label: 'Icon', minWidth: 50, align: 'left' },
];

function createData(checkbox, icon) {
  return {
    checkbox,
    icon,
  };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '500px',
    // maxHeight: '600px',
    overflow: 'hidden',
    boxShadow: 'none',
    border: '1px solid rgba(224, 224, 224, 1)',
  },
  container: {
    maxHeight: '500px',
  },
  cell: {
    color: '#545b64',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '.85rem',
    fontWeight: 600,
  },
  rowCell: {
    color: '#16191f',
    fontSize: '.75rem',
    padding: '0 0 0 1%',
    margin: '0 0 0 1%',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  headRowCell: {
    background: '#fff',
    color: '#16191f',
    fontSize: '.75rem',
    padding: '0 0 0 1%',
    margin: '0 0 0 1%',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    top: 37,
  },
  name: {
    width: '100%',
    margin: 0,
    color: '#16191f',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '.75rem',
    padding: '0',
    // margin: '0 0 0 1%',
  },
  title: {
    margin: '5px 0 15px 0',
    color: '#16191f',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '.75rem',
  },
  button: {
    width: '15%',
    margin: '2%',
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
    '&:focus': {
      outline: 'none',
    },
  },
  formGroup: {
    width: '100%',
  },
  pagination: {
    backgroundColor: '#fafafa',
    color: '#545b64',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontSize: '.85rem',
    fontWeight: 600,
  },
  iconLabel: {
    color: '#16191f',
    fontSize: '.75rem',
    // padding: '0 0 0 1%',
    margin: 'auto',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  textfield: {
    width: '350px',
    fontStyle: 'italic',
    padding: '0 5px',

    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '& .MuiInput-underline:hover:before': {
      border: 0,
    },
    '& .MuiInput-underline:before': {
      border: 0,
    },
    '& .MuiInput-underline:after': {
      border: 0,
    },
    '& .MuiInput-root': {
      fontSize: '0.75rem',
      border: '1px solid #545b64',
      padding: '0 5px',
    },
    '& .Mui-focused': {
      fontStyle: 'normal',
    },
    '& .Mui-error': {
      color: '#d13212',
      border: '1px solid #d13212',
    },
  },
  saveRow: {
    display: 'inline-flex',
    width: '100%',
    margin: '15px 5px',
  },
  info: {
    fontSize: '0.75rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    margin: 'auto 15px',
  },
  search: {
    width: '35%',
  },
});

const CustomCheckbox = withStyles({
  root: {
    color: '#687078',
    '&$checked': {
      color: '#137cbd',
    },
    '&.MuiIconButton-root:hover': {
      background: 'none',
    },
  },
  checked: {},
})((props) => <Checkbox color='default' disableRipple {...props} />);

export default () => {
  const classes = useStyles();
  const [status, setStatus] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [{ resources }, dispatch] = useResourceState();
  const [{ graphFilters }, updateFilters] = useGraphState();

  React.useEffect(() => {
    processResources();
  }, []);

  function createCheckbox(label) {
    return (
      <FormControlLabel
        control={
          <CustomCheckbox
            indeterminate={false}
            checked={graphFilters.typeFilters.indexOf(label) >= 0}
            onChange={(event, item) => {
              if (item) {
                graphFilters.typeFilters.push(label);
                setStatus(!status);
              } else {
                graphFilters.typeFilters.splice(
                  graphFilters.typeFilters.indexOf(label),
                  1
                );
                setStatus(!status);
              }
              uploadObject(
                'filters/resources/filters',
                JSON.stringify(graphFilters),
                'private',
                'application/json'
              ).then((response) => {
                updateFilters({
                  type: 'updateFilters',
                  graphFilters: graphFilters,
                });
              });
            }}
            inputProps={{ 'aria-label': 'select view' }}
          />
        }
        classes={{ root: classes.name, label: classes.name }}
        label={label}
      />
    );
  }

  const processResources = () => {
    const processedResources = [];
    resources
      .map((resource) => resource.metaData.resourceTypes)
      .map((resourceTypes) => {
        resourceTypes.map((type) => {
          processedResources.push({
            name: `${Object.keys(type)[0]}`,
            visible: true,
          });
        });
      });
    setRows(uniqBy(processedResources, 'name'));
  };

  const getRows = () => {
    return rows
      .filter((resource) => resource.visible)
      .map((resource) =>
        createData(
          createCheckbox(resource.name),
          getResourceIcon(resource.name)
          // resource.count
        )
      )
      .sort((a, b) => {
        if (a.checkbox.props.label < b.checkbox.props.label) return -1;
        if (a.checkbox.props.label > b.checkbox.props.label) return 1;
        return 0;
      });
  };

  const getResourceIcon = (type) => {
    return (
      <img
        alt={`${type} icon`}
        src={fetchImage(type)}
        style={{
          background: 'white',
          width: '35px',
          height: '35px',
          marginLeft: '5%',
        }}
      />
    );
  };

  return (
    // <div style={{ display: 'inline-flex', width: '100%', height: '100%' }}>
    <div style={{ width: '100%', marginRight: '1%', height: '100%' }}>
      <div className={classes.saveRow}>
        <div className={classes.search}>
          <FormField
            search
            width='100%'
            placeholder='Search'
            autoFocus={true}
            // classes={{ root: classes.textfield }}
            onInput={(name) => {
              setRows(
                rows.map((resource) => {
                  resource.visible =
                    resource.name
                      .toLowerCase()
                      .trim()
                      .indexOf(name.target.value.toLowerCase().trim()) >= 0;
                  return resource;
                })
              );
            }}
            type={'text'}
          />
        </div>
        <Typography
          classes={{
            root: classes.info,
          }}>
          {`Select the resources types that you would like to hide from your architecture diagrams.`}
        </Typography>
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label='sticky table' size='small'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    classes={{ root: classes.cell }}
                    style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {getRows()
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover={false}
                      role='checkbox'
                      tabIndex={-1}
                      key={index}
                      style={{ height: '25px', padding: 0 }}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            classes={{ root: classes.rowCell }}>
                            {column.format ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
    // </div>
  );
};
