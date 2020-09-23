import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { filterOptions } from '../../../Utils/Forms/SearchFilterOptions';
import SearchIcon from '@material-ui/icons/Search';
import { fetchImage } from '../../../Utils/ImageSelector';

const useStyles = makeStyles((theme) => ({
  root: {
    height: ['35px'].join(','),
    '& .Mui-focused': {
      fontStyle: 'normal',
    },

    backgroundColor: '#fff',
    width: '100%',
    zIndex: 99,

    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  textfield: {
    height: '35px',
    fontStyle: 'italic',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    border: [0].join(','),
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
      height: '35px',
      margin: 'auto',
      fontSize: '0.85rem',
    },
    '& .MuiFocused': {
      borderColor: '#C52328',
      borderWidth: '2px',
    },
  },
  searchBar: {
    boxShadow: '0 2px 2px -2px #232f3e',
    display: 'inline-flex',
    width: '100%',
  },
  paper: {
    color: '#000',
    fontSize: '.75rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
  },
  groupLabel: {
    height: '1%',
    padding: 'auto',
    margin: 'auto',
    fontSize: '.85rem',
  },
  listbox: {
    padding: 0,
    background: '#fff',
  },
  option: {
    fontSize: '.75rem',
    color: '#16191f',
    height: 'fit-content',
    wordBreak: 'break-all',
    background: '#fff',
  },
}));

export default ({
  onSelected,
  options,
  label,
  description,
  multiSelect,
  group,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const sortTypes = (a, b) => {
    if (a.group.toLowerCase() > b.group.toLowerCase()) {
      return 1;
    }
    if (a.group.toLowerCase() < b.group.toLowerCase()) {
      return -1;
    }
    return 0;
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.label} variant='body2'>
        {label}
      </Typography>
      <Typography className={classes.description} variant='caption'>
        {description}
      </Typography>
      <div className={classes.searchBar}>
        <img
          src={fetchImage('search')}
          style={{ width: '16px', margin: '5px 10px' }}
        />
        <Autocomplete
          autoHighlight
          freeSolo
          multiple={multiSelect}
          clearOnEscape
          options={group ? options.sort((a, b) => sortTypes(a, b)) : options}
          getOptionLabel={(option) => option.label}
          groupBy={(option) => option.group}
          onChange={(event, input) => {
            onSelected(event, input);
            setValue(null);
            setInputValue('');
          }}
          filterOptions={filterOptions}
          classes={{
            root: classes.root,
            paper: classes.paper,
            groupLabel: classes.groupLabel,
            option: classes.option,
            listbox: classes.listbox,
          }}
          inputValue={inputValue}
          value={value}
          onInputChange={(event, input, reason) => {
            if (reason === 'reset') {
              setInputValue(undefined);
              setValue(undefined);
            }
            if (reason === 'clear') {
              setInputValue(undefined);
              setValue(undefined);
            } else {
              setInputValue(input);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              classes={{ root: classes.textfield }}
              placeholder='Search'
              // value={value}
              fullWidth
            />
          )}
        />
      </div>
    </div>
  );
};
