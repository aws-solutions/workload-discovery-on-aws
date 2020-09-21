import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

export default ({
  onSelected,
  options,
  label,
  description,
  width,
  margin,
  multiSelect,
  placeholder,
  group,
  buttonAction,
  buttonText,
  buttonDisabled,
  progress
}) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'grid',
      flexWrap: 'wrap',
      margin: margin,
      width: '100%',
      zIndex: 99,
    },
    label: {
      marginLeft: '0',
      fontWeight: 600,
      fontSize: '0.85rem',
    },
    description: {
      marginLeft: '0',
      color: '#687078',
      fontWeight: 400,
      fontSize: '0.75rem',
    },
    textfield: {
      width: width,
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
        border: '1px solid #aab7b8',
        padding: '0 0 0 2%',
        fontSize: '14px',
        height: '35px',
      },
    },
    paper: {
      color: '#000',
      fontSize: '14px',
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    },
    button: {
      height: '30px',
      margin: '0 0 2px 15px',
      backgroundColor: '#ec7211',
      borderColor: '#ec7211',
      color: '#fff',
      verticalAlign: 'bottom',
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
    colorPrimary: {
      color: '#fff',
      marginLeft: '5px',
    },
  }));

  const classes = useStyles();

  const GenerateTemplateButton = () => (
    <Button
      disabled={buttonDisabled}
      size='small'
      className={classes.button}
      onClick={() => buttonAction()}>
      {buttonText}
      {progress && (
        <CircularProgress
          classes={{ colorPrimary: classes.colorPrimary }}
          size={10}
        />
      )}
    </Button>
  );

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => option.value,
  });
  return (
    <div className={classes.root}>
      <Typography className={classes.label} variant='body2'>
        {label}
      </Typography>
      <Typography className={classes.description} variant='caption'>
        {description}
      </Typography>

      <Autocomplete
        disableClearable
        multiple={multiSelect}
        options={
          group
            ? options.sort((a, b) => -b.group.localeCompare(a.group))
            : options
        }
        getOptionLabel={(option) => option.label}
        groupBy={group ? (option) => option.group : undefined}
        onChange={onSelected}
        filterOptions={filterOptions}
        classes={{ paper: classes.paper }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              size='small'
              variant='outlined'
              label={option.label}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <>
            <TextField
              {...params}
              placeholder={placeholder}
              classes={{ root: classes.textfield }}
            />
            {buttonAction && <GenerateTemplateButton />}
          </>
        )}
        defaultValue={placeholder}
      />
    </div>
  );
};
