import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormField from '../../../../../../Utils/Forms/FormField';
import { useResourceState } from '../../../../../Contexts/ResourceContext';
import { getFilterMenuTree } from '../FilterBuilder';
import MetadataContext from '../../../../../Contexts/MetadataContext';
import { filterOnAccountAndRegion } from '../../../../../Actions/ResourceActions';
import { uploadObject } from '../../../../../../API/Storage/S3Store';
import { Typography } from '@material-ui/core';
import { useAccountsState } from '../../../../../Contexts/AccountsContext';
import { wrapRequest, getAccounts, handleResponse } from '../../../../../../API/GraphQLHandler';

const columns = [
  { id: 'account', label: 'Account ID', minWidth: 50, align: 'left' },
  { id: 'region', label: 'Region', minWidth: 50, align: 'left' },
  // { id: 'resourceCount', label: 'Resources', minWidth: 50, align: 'left' },
];

function createData(account, region, resourceCount) {
  return {
    account,
    region,
    resourceCount,
  };
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    // height: '100%',
    // maxHeight: '600px',
    overflow: 'hidden',
    boxShadow: 'none',
    border: '1px solid rgba(224, 224, 224, 1)',
  },
  container: {
    maxHeight: '100%',
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

export default ({}) => {
  const classes = useStyles();
  const [{ filters, resources }, dispatch] = useResourceState();
  const [searchFilters, setSearchFilters] = React.useState([]);
  const [allFilters, setAllFilters] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);

  useEffect(() => {
    wrapRequest(getAccounts)
      .then(handleResponse)
      .then((response) => {
        response.body.data.getAccounts.map((account) =>
          accounts.push({
            accountId: account.accountId,
            regions: account.regions,
            visible: true,
          })
        );
        setAccounts(accounts.map((account) => account));
        setSearchFilters(fetchFilters(getFilterMenuTree(accounts)));
        setAllFilters(fetchFilters(getFilterMenuTree(accounts)));
      });
  }, []);

  function fetchFilters(accounts) {
    const processedFilters = [];

    accounts.forEach((account) => {
      const accountFilter = { id: account.label, accountId: account.label };
      processedFilters.push(accountFilter);
      account.regions.forEach((region) => {
        const filter = {
          id: `${account.label} :: ${region.label}`,
          accountId: account.label,
          region: region.label,
        };
        processedFilters.push(filter);
      });
    });
    return processedFilters;
  }

  const updateFilters = async () => {
    await applyFilters().then((response) => {
      uploadObject(
        'filters/accounts/filters',
        JSON.stringify(filters),
        'private',
        'application/json'
      ).then(
        dispatch({
          type: 'updateAccountOrRegionFilters',
          filters: filters,
        })
      );
    });
  };

  const applyFilters = async () => {
    await filterOnAccountAndRegion(filters).then((response) => {
      if (response.error) {
        return false;
      } else {
        dispatch({
          type: 'updateResources',
          resources: response.body,
        });
        return true;
      }
    });
  };

  function createCheckbox(filter) {
    return (
      <FormControlLabel
        control={
          <CustomCheckbox
            indeterminate={false}
            checked={filters.filter((item) => item.id === filter.id).length > 0}
            onChange={(event, item) => {
              if (item) {
                filters.push(filter);
              } else {
                filters.splice(filters.indexOf(filter), 1);
              }
              updateFilters();
            }}
            inputProps={{ 'aria-label': 'select view' }}
          />
        }
        classes={{ root: classes.name, label: classes.name }}
        label={filter.accountId}
      />
    );
  }

  const getRows = (rowData) => {
    const rows = [];
    rowData.map((filter) => {
      rows.push(createData(createCheckbox(filter), filter.region));
    });
    return rows;
  };

  const applyFilter = (event) => {
    if (event.target.value === '') {
      setSearchFilters(allFilters);
    } else {
      const filtered = allFilters.filter((filter) => {
        return (
          filter.accountId
            .toLowerCase()
            .trim()
            .indexOf(event.target.value.toLowerCase().trim()) >= 0 ||
          (filter.region &&
            filter.region
              .toLowerCase()
              .trim()
              .indexOf(event.target.value.toLowerCase().trim()) >= 0)
        );
      });
      setSearchFilters(filtered);
    }
  };

  return (
    <div style={{ width: '100%', marginRight: '1%', height: '100%' }}>
      <div className={classes.saveRow}>
        <div className={classes.search}>
          <FormField
            autoFocus={true}
            search
            width='100%'
            placeholder='Search'
            // classes={{ root: classes.textfield }}
            onInput={applyFilter}
            type={'text'}
          />
        </div>
        <Typography
          classes={{
            root: classes.info,
          }}>
          {`Select the accounts and/or regions you wish to see data for`}
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
              {getRows(searchFilters)
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
  );
};
