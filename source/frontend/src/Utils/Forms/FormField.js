import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { fetchImage } from '../ImageSelector';

export default ({
  autoFocus,
  onInput,
  label,
  description,
  width,
  margin,
  error,
  helper,
  placeholder,
  type,
  search,
}) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'grid',
      flexWrap: 'wrap',
      margin: margin,
      width: width,
      // height: '35px'
      // height: '-webkit-fill-available'
    },
    textfield: {
      width: width,
      padding: '0 0 0 5px',
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
        fontSize: '1.4rem',
      },
      '& .MuiFocused': {
        borderColor: '#C52328',
        borderWidth: '2px',
      },
      '& .Mui-error': {
        borderColor: '#C52328',
        borderWidth: '2px',
      },
      '& .MuiFormHelperText-root': {
        marginTop: '10px',
      },
    },
    label: {
      marginLeft: '0',
      fontWeight: 600,
      fontSize: '1.4rem',
    },
    description: {
      marginLeft: '0',
      color: '#687078',
      fontWeight: 400,
      fontSize: '1.2rem',
    },
    searchBar: {
      border: error ? '1px solid #C52328' : '1px solid #aab7b8',
      // boxShadow: '0 2px 2px -2px #232f3e',
      display: 'inline-flex',
      width: '100%',
      height: '35px',
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.label} variant='body2'>
        {label}
      </Typography>
      <Typography className={classes.description} variant='caption'>
        {description}
      </Typography>
      <div className={classes.searchBar}>
        {search && (
          <img
            src={fetchImage('search')}
            style={{ width: '16px', margin: '5px 10px' }}
          />
        )}
        <TextField
          autoFocus={autoFocus}
          error={error ? true : false}
          helperText={helper ? helper : ''}
          classes={{ root: classes.textfield, error: classes.error }}
          onChange={onInput}
          type={type ? type : 'text'}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
