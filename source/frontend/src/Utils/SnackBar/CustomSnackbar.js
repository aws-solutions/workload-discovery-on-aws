import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { makeStyles } from '@material-ui/core/styles';
import ReplayIcon from '@material-ui/icons/Replay';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    width: 'fit-content',
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: '#0073bb',
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginRight: '5px'
  },
  root: {
    width: 'fit-content',
  },
  div: { display: 'inline-flex', width: '100%' },
  menuButton: {
    margin: 'auto',
    padding: 'unset',
    margin: ['0 0 0 5px'].join(','),
    '&:hover': {
      outline: 'none',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  externalIcon: {
    width: '18px',
  },
}));

function MySnackbarContentWrapper(props) {
  const classes = useStyles();
  const { className, message, onClose, variant, progress, action, ...other } = props;
  const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      classes={{ root: classes[variant], message: classes.message }}
      action={action}
      aria-describedby='client-snackbar'
      message={
        <div className={classes.div}>
          <span id='client-snackbar' className={classes.message}>
            <Icon className={clsx(classes.icon, classes.iconVariant)} />
            {message}
          </span>
          {progress && progress}
        </div>
      }
      {...other}
    />
  );
}

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

export default ({
  type,
  message,
  vertical,
  horizontal,
  progress,
  retryFunction,
}) => {
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const action = () => (
    <IconButton
      disableTouchRipple
      disableFocusRipple
      edge='start'
      className={classes.menuButton}
      onClick={retryFunction}
      color='inherit'
      aria-label='menu'>
      <ReplayIcon className={classes.externalIcon} />
    </IconButton>
  );

  return (
    <Snackbar
      anchorOrigin={{
        vertical: vertical ? vertical : 'bottom',
        horizontal: horizontal ? horizontal : 'right',
      }}
      open={open}
      onClose={handleClose}>
      <MySnackbarContentWrapper
        variant={type}
        message={message}
        onClose={handleClose}
        progress={progress}
        action={retryFunction ? action() : null}
      />
    </Snackbar>
  );
};
