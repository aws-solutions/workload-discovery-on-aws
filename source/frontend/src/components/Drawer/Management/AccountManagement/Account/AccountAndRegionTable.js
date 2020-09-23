import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import { useImportConfigState } from '../../../../Contexts/ImportDataContext';
import Button from '@material-ui/core/Button';
import FormField from '../../../../../Utils/Forms/FormField';
import Typography from '@material-ui/core/Typography';
import {
  handleResponse,
  wrapRequest,
  getAccounts,
  deleteRegions,
  deleteAccounts,
} from '../../../../../API/GraphQLHandler';
import CustomSnackbar from '../../../../../Utils/SnackBar/CustomSnackbar';
var findIndex = require('lodash.findindex');
var groupBy = require('lodash.groupby');
var forOwn = require('lodash.forown');

var dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  root: {
    width: '100%',
    height: '500px',
    overflow: 'hidden',
    boxShadow: 'none',
    border: ['1px solid rgba(224, 224, 224, 1)'].join(','),
    '& .MuiTableRow-root.Mui-selected': {
      background: '#FAFAFA',
    },
  },
  paper: {
    boxShadow: 'none',
    height: '500px',
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
    padding: '0',
    margin: '0 0 0 5px',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  rowCellInline: {
    color: '#16191f',
    fontSize: '.75rem',
    padding: '0',
    margin: '0 0 0 5px',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  tableRow: {
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  headRowCell: {
    background: '#fafafa',
    color: '#16191f',
    fontSize: '.75rem',
    padding: '5px',
    margin: '0 0 0 5px',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    top: 37,
  },
  name: {
    width: '100%',
    margin: '0 5px 0 5px',
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
  secondaryButton: {
    height: '30px',
    margin: '5px 5px',
    backgroundColor: '#fff',
    borderColor: '#545b64',
    color: '#545b64',
    borderRadius: '2px',
    border: '1px solid',
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
    '&:focus': {
      outline: 'none',
    },
  },
  saveButton: {
    height: '30px',
    marginLeft: '10px',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
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
  saveButtonClear: {
    height: '30px',
    margin: '0',
    backgroundColor: '#fff',
    color: '#545b64',
    border: 'none',
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
    '&:focus': {
      outline: 'none',
    },
  },
  inRowOverwriteButton: {
    height: '30px',
    marginLeft: '10px',
    backgroundColor: '#fff',
    borderColor: '#d13212',
    color: '#d13212',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#fafafa',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#fafafa',
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
  confirm: {
    float: 'right',
    height: '30px',
    margin: '10px 0 0 0',
    backgroundColor: '#fff',
    color: '#d13212',
    borderColor: '#d13212',
    borderRadius: '2px',
    border: '1px solid',
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
    '&:focus': {
      outline: 'none',
    },
  },
  delete: {
    float: 'right',
    height: '30px',
    margin: '10px 15px',
    backgroundColor: '#fff',
    borderColor: '#545b64',
    color: '#545b64',
    borderRadius: '2px',
    border: '1px solid',
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
    '&:focus': {
      outline: 'none',
    },
  },
  saveRow: {
    display: 'inline-flex',
    width: '100%',
    margin: '15px 5px',
  },
  pagination: {
    background: '#fafafa',
  },
  table: {
    height: '400px',
    maxHeight: '400px',
  },
  tableContainer: {
    height: '500px',
    overflow: 'hidden',
  },
  search: {
    width: '100%',
    margin: '10px 15px',
  },
  toolbar: {
    height: '50px',
    display: 'flex',
    width: '100%',
    background: '#fff',
  },
  paragraph: {
    fontSize: '0.75rem',
    fontWeight: theme.typography.fontWeightRegular,
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    margin: '15px',
  },
}));

export default ({}) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('modified');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [regions, setRegions] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState();
  const [render, setRender] = useState(false);

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

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

  function EnhancedTableHead(props) {
    const {
      classes,
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding='checkbox'>
            <CustomCheckbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select regions' }}
            />
          </TableCell>
          {columns.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={'default'}
              style={{ width: headCell.maxWidth, maxWidth: headCell.maxWidth }}
              sortDirection={orderBy === headCell.id ? order : false}>
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function createData(region, accountId, lastCrawled, visible) {
    return {
      region,
      accountId,
      lastCrawled,
      visible,
    };
  }

  const columns = [
    {
      id: 'region',
      label: 'Region',
      maxWidth: '100px',
      align: 'left',
    },
    {
      id: 'accountId',
      label: 'Account',
      maxWidth: '100px',
      align: 'left',
    },
    {
      id: 'lastCrawled',
      label: 'Last Scanned',
      maxWidth: '150px',
      align: 'left',
      format: (value) => (value ? dayjs(value).fromNow() : undefined),
    },
  ];

  function awaitConfirmation() {
    setDeleting(true);
  }

  function removeRegions(deletedRegions) {
    deletedRegions.forEach((region) =>
      regions.splice(findIndex(regions, region), 1)
    );
    setRegions(regions.map((region) => region));
  }

  function removeAccount(deletedAccount) {
    if (findIndex(regions, { accountId: deletedAccount }) < 0) {
      wrapRequest(deleteAccounts, {
        accountIds: [deletedAccount],
      })
        .then(handleResponse)
        .catch((err) => setError(err));
    }
  }

  function groupRegionsByAccount(regions) {
    return groupBy(regions, 'accountId');
  }

  async function handleDelete() {
    setError(null);
    forOwn(groupRegionsByAccount(selected), async (value, key) => {
      await wrapRequest(deleteRegions, {
        accountId: key,
        regions: value.map((region) => {
          return {
            name: region.region,
          };
        }),
      })
        .then(handleResponse)
        .then(removeRegions(value))
        .then(removeAccount(key))
        .catch((err) => setError(err));
    });
    cancelDelete();
  }

  function cancelDelete() {
    setDeleting(false);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = getRows().map((n) => n.accountId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = findIndex(selected, {
      region: row.region,
      accountId: row.accountId,
    });
    selectedIndex < 0 ? selected.push(row) : selected.splice(selectedIndex, 1);
    setSelected(selected.map((region) => region));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (row) =>
    findIndex(selected, { region: row.region, accountId: row.accountId }) !==
    -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, getRows().length - page * rowsPerPage);

  React.useEffect(() => {
    wrapRequest(getAccounts).then((response) => {
      response.body.data.getAccounts.map((account) =>
        account.regions.map((region) =>
          regions.push({
            key: `${account.accountId}-${region.name}`,
            accountId: account.accountId,
            region: region.name,
            lastCrawled: region.lastCrawled,
            visible: true,
          })
        )
      );
      setRegions(regions.map((region) => region));
    });
  }, []);

  function getRows() {
    return regions
      .filter((map) => map.visible)
      .map((region) =>
        createData(
          region.region,
          region.accountId,
          region.lastCrawled,
          region.visible
        )
      );
  }

  return (
    <>
      <div className={classes.divInline}>
        <Typography className={classes.paragraph}>
          You are running AWS Perspective in account with ID:{' '}
          <strong>{window.perspectiveMetadata.rootAccount}</strong>
        </Typography>
      </div>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer className={classes.tableContainer}>
            <div className={classes.toolbar}>
              <div className={classes.search}>
                <FormField
                  search
                  autoFocus={true}
                  width='100%'
                  placeholder='Search'
                  // classes={{ root: classes.textfield }}
                  onInput={(name) => {
                    setRegions(
                      regions.map((map) => {
                        map.visible =
                          map.key
                            .toLowerCase()
                            .trim()
                            .indexOf(name.target.value.toLowerCase().trim()) >=
                          0;
                        return map;
                      })
                    );
                  }}
                  type={'text'}
                />
              </div>
              <div
                style={{
                  width: '100%',
                }}>
                {deleting && (
                  <Button
                    size='small'
                    className={classes.delete}
                    onClick={cancelDelete}>
                    Cancel
                  </Button>
                )}
                <Button
                  disabled={selected.length === 0 || regions.length <= 1}
                  size='small'
                  className={deleting ? classes.confirm : classes.delete}
                  onClick={deleting ? handleDelete : awaitConfirmation}>
                  {deleting ? 'Confirm' : 'Delete'}
                </Button>
              </div>
            </div>
            <Table
              className={classes.table}
              aria-labelledby='tableTitle'
              size='small'
              aria-label='enhanced table'>
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={getRows().length}
              />
              <TableBody>
                {stableSort(getRows(), getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        classes={{ root: classes.tableRow }}
                        // onClick={(event) => handleClick(event, row.accountId)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}>
                        <TableCell padding='checkbox'>
                          <CustomCheckbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                            name={row.accountId}
                            onChange={(event) => handleClick(event, row)}
                          />
                        </TableCell>
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
                {emptyRows > 0 && (
                  <TableRow style={{ height: (362 / 5) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[]}
              component='div'
              count={getRows().length}
              rowsPerPage={rowsPerPage}
              page={page}
              classes={{ root: classes.pagination }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Paper>
        {error && (
          <CustomSnackbar
            vertical='bottom'
            horizontal='center'
            type='error'
            message={error.message}
            retryFunction={handleDelete}
          />
        )}
      </div>
    </>
  );
};
