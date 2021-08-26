import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import OpenInNew from '@material-ui/icons/OpenInNew';
import GetAppIcon from '@material-ui/icons/GetApp';


const useStyles = makeStyles((theme) => ({
  menuButton: {
    // height: '18px',
    padding: 'unset',
    margin: ['0 0 0 2%'].join(','),
    '&:hover': {
      outline: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  drawio: {
    display: 'inline-flex',
    height: '50px',
    padding: '0 5px 0 5px',
  },
  externalIcon: {
    width: '18px',
    marginLeft: '3px',
  },
  removebutton: {
    margin: theme.spacing(1),
    backgroundColor: '#fff',
    borderColor: '#545b64',
    color: '#545b64',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'flex',
    cursor: 'pointer',
    fontSize: '1.2rem',
    textTransform: 'capitalize',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#fafafa',
      borderColor: '#000',
      color: '#000',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#fafafa',
      borderColor: '#000',
      color: '#000',
    },
    '&:focus': {
      outline: 'none',
    },
  },
}));

export function AWSIconButton(props) {
  const classes = useStyles();
  return (
    <div className={classes.drawio}>
      <Button
        classes={{ root: classes.removebutton }}
        onClick={props.action}
        aria-label='externalbutton'>
        {props.label}
        {props.show && props.newtab && <OpenInNew className={classes.externalIcon} />}
        {props.show && props.download && <GetAppIcon className={classes.externalIcon} />}
      </Button>
    </div>
  );
}
