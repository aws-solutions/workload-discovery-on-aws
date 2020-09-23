import React from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';

export default ({ tags }) => {
  const useStyles = makeStyles(theme => ({
    div: {
      width: '100%'
    },
    chip: {
      background: '#0073bb',
      color: '#fff',
      height: '25px',
      margin: theme.spacing(0.5),
      fontSize: theme.typography.pxToRem(10),
      fontWeight: theme.typography.fontWeightRegular,
      wordBreak: 'break-all'
    }
  }));

  const classes = useStyles();

  return (
    <div className={classes.div}>
      {Object.keys(tags).map(tag => (
        <Chip
          key={`${tag} : ${tags[`${tag}`]}`}
          label={`${tag} : ${tags[`${tag}`]}`}
          className={classes.chip}
        />
      ))}
    </div>
  );
};
