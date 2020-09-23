import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
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
import { previewStyle } from '../../../../Graph/Styling/GraphStyling';
import Cytoscape from 'cytoscape';
import TextField from '@material-ui/core/TextField';
import { useGraphState } from '../../../../Contexts/GraphContext';
import Button from '@material-ui/core/Button';
import {
  listObjects,
  uploadObject,
  removeObject,
  getObject,
  removeObjects,
} from '../../../../../API/Storage/S3Store';
import FormField from '../../../../../Utils/Forms/FormField';

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
    padding: '5px',
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
}));

export default ({ toggleDialog, level }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('modified');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [exists, setExists] = useState();
  const compound = React.useRef();
  const [{ graphResources }, dispatch] = useGraphState();
  const [maps, setMaps] = useState([]);
  const [filename, setFilename] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    fetchMaps().then((result) => {
      if (isMounted) {
        processMaps(result);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

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
              inputProps={{ 'aria-label': 'select all desserts' }}
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

  const columns = [
    {
      id: 'name',
      label: 'Name',
      maxWidth: 150,
      align: 'left',
    },
    {
      id: 'modified',
      label: 'Modified',
      maxWidth: 100,
      align: 'center',
      format: (value) => (value ? dayjs(value).fromNow() : undefined),
    },
    {
      id: 'action',
      label: '',
      maxWidth: 150,
      align: 'center',
    },
  ];

  function createData(name, modified, action, exists) {
    return {
      name,
      modified,
      action,
      exists,
    };
  }

  function fetchMaps() {
    return listObjects('maps/', level)
      .catch((err) => console.error('Error fetching saved architecture diagrams, please try again'));
  }

  function processMaps(result) {
    setMaps(
      result
        .filter((map) => {
          return map.key.split('/')[map.key.split('/').length - 1] !== '';
        })
        .map((key) => {
          return {
            key: key.key.split('/')[key.key.split('/').length - 1],
            modified: key.lastModified,
            visible: true,
          };
        })
    );
  }

  function filenameChanged(input) {
    const mapExists = maps
      .map((map, index) => {
        map.cursor = index;
        return map;
      })
      .filter((map, index) => map.key === input);
    if (mapExists.length > 0) {
      setExists(mapExists[0].key);
      setOrderBy('exists');
    }
    setFilename(input);
  }

  function handleSave() {
    uploadObject(
      `maps/${filename}`,
      JSON.stringify(graphResources),
      level,
      'application/json'
    ).then((result) => fetchMaps().then(processMaps));
    setFilename('');
    setExists();
  }

  const layout = {
    name: 'cola',
    padding: 100,
    maxSimulationTime: 5,
    randomize: true,
    animate: true,
    handleDisconnected: true,
    nodeSpacing: function (node) {
      return 10;
    },
    // flow: { axis: 'y', minSeparation: 15 },
    fit: true,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true,
    ungrabifyWhileSimulating: true,

    /* layout event callbacks */
    ready: () => {}, // on layoutready
    stop: () => {
      compound.current.fit();
      compound.current.minZoom(0.3);
      compound.current.maxZoom(2.0);
    }, // on layoutstop
  };

  const createSaveRow = () => (
    <div className={classes.saveRow}>
      <TextField
        classes={{ root: classes.textfield }}
        onChange={(name) => {
          setExists();
          filenameChanged(name.target.value);
        }}
        type={'text'}
        placeholder={'my-architecture-diagram'}
        error={exists != null}
        value={filename}
      />
      {createSaveButton()}
    </div>
  );

  function createButtons(architectureMap) {
    return (
      <>
        <Button
          size='small'
          className={classes.secondaryButton}
          onClick={(e) => {
            e.stopPropagation();
            createCytoscape(architectureMap.key);
          }}>
          Preview
        </Button>
        <Button
          size='small'
          className={classes.button}
          onClick={(e) => {
            e.stopPropagation();
            openMap(architectureMap.key);
          }}>
          Open
        </Button>
      </>
    );
  }

  function createSaveButton() {
    return (
      <>
        {exists && (
          <Button
            size='small'
            className={classes.saveButtonClear}
            onClick={() => {
              setExists();
              setFilename('');
            }}>
            Cancel
          </Button>
        )}
        <Button
          disabled={filename === ''}
          size='small'
          className={exists ? classes.inRowOverwriteButton : classes.saveButton}
          onClick={() => handleSave()}>
          {exists ? 'Overwrite' : 'Save'}
        </Button>
      </>
    );
  }

  const getRows = () => {
    return maps
      .filter((map) => map.visible)
      .map((map) =>
        createData(
          map.key,
          map.modified,
          createButtons(map),
          exists === map.key
        )
      );
  };

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };

  const createCytoscape = (key) => {
    getObject(`maps/${key}`, level).then((resources) => {
      compound.current = Cytoscape({
        elements: resources,
        style: previewStyle,
        layout: layout,
        container: document.getElementById('preview'),
      });
    });
  };

  const openMap = (key) => {
    getObject(`maps/${key}`, level).then((resources) => {
      dispatch({
        type: 'updateGraphResources',
        graphResources: resources,
      });
      toggleDialog();
    });
  };

  const handleDelete = async () =>
    await removeObjects(
      selected.map((map) => `maps/${map}`),
      level
    )
      .then(() => {
        fetchMaps().then((result) => {
          processMaps(result);
          setDeleting(false);
        });
      })
      .catch((error) => console.error('Error fetching saved architecture diagrams, please try again'));

  function awaitConfirmation() {
    setDeleting(true);
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
      const newSelecteds = getRows().map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1 || name === exists;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, getRows().length - page * rowsPerPage);

  return (
    <>
      {createSaveRow()}
      <div style={{ display: 'inline-flex', width: '100%', height: '100%' }}>
        <div style={{ width: '70%', marginRight: '1%', overflow: 'hidden' }}>
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
                        setMaps(
                          maps.map((map) => {
                            map.visible =
                              map.key
                                .toLowerCase()
                                .trim()
                                .indexOf(
                                  name.target.value.toLowerCase().trim()
                                ) >= 0;
                            return map;
                          })
                        );
                      }}
                      type={'text'}
                    />
                  </div>
                  <div
                    style={{
                      // height: '50px',
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
                      disabled={selected.length === 0}
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
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row.name);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            classes={{ root: classes.tableRow }}
                            onClick={(event) => handleClick(event, row.name)}
                            role='checkbox'
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.name}
                            style={{
                              borderLeft: `${
                                exists === row.name
                                  ? '1px solid #d13212'
                                  : 'none'
                              }`,
                            }}
                            selected={isItemSelected}>
                            <TableCell padding='checkbox'>
                              <CustomCheckbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                                name={row.name}
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
          </div>
        </div>
        <div style={{ width: '30%', marginLeft: '1%', height: '500px' }}>
          {/* <div style={{ width: '100%', height: '100%' }}> */}
          <div
            id='preview'
            style={{
              width: '100%',
              height: '500px',
              maxHeight: '500px',
              border: '1px solid rgba(224, 224, 224, 1)',
            }}></div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};
