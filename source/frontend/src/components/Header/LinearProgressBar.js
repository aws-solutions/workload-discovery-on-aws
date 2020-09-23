import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  linearColorPrimary: {
    backgroundColor: '#f2f3f3',
  },
  linearBarColorPrimary: {
    backgroundColor: '#eb5f07',
  }
});

function LinearProgressBar(props) {
  const { classes } = props;

  return (
      <LinearProgress
        classes={{
          colorPrimary: classes.linearColorPrimary,
          barColorPrimary: classes.linearBarColorPrimary,
        }}
      />
  );
}

LinearProgressBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LinearProgressBar);
