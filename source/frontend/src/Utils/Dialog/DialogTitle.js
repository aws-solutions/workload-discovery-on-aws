import React from 'react';
import { withStyles} from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Close from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      backgroundColor: '#fafafa'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
    },
    titleText: {
      color: '#16191f',
      fontWeight: 700,
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    }
  });

  export const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography className={classes.titleText}>{children}</Typography>
        { onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <Close />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );

    

  });