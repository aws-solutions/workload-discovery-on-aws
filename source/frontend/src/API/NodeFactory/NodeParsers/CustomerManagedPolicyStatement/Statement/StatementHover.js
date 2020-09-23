import React from 'react';
import { fetchImage } from '../../../../../Utils/ImageSelector';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
    display: 'grid',
    width: '100%',
    height: '100%',
    marginTop: '1vh'
  },
  list: {
    // flexGrow: 1,
    display: 'grid',
    width: '100%',
    height: '100%'
    // marginTop: '1vh',
  },
  item: {
    padding: '1vh',
    color: theme.palette.text.secondary,
    wordWrap: 'break-word',
    fontSize: '0.75rem',
    marginLeft: '1vw'
  },
  div: {
    display: 'grid'
  },
  divInlineFlex: { display: 'inline-flex' },
  span: {
    padding: '1vh',
    // color: getColor(item),
    wordWrap: 'break-word',
    fontSize: '0.75rem'
  },
  image: { width: 16, marginLeft: '1vw' },
  title: {
    color: '#535B63',
    fontSize: '1rem',
    lineHeight: '2rem',
    margin: '0 0 2% 0'
  },
  effect: {
    color: '#535B63',
    fontSize: '0.75rem',
    lineHeight: '2rem',
    margin: 'auto 0 auto 5%'
  },
  titleDivider: {
    margin: '5% 0 5% 0'
  },
  imageActionDiv: { display: 'inline-flex', width: '100%' },
  imageAction: { width: 16, margin: 'auto 0 auto 5%' },
  actionP: { margin: 'auto 0 auto 5%' }
}));

export default ({ statement, resourceStatus, actionStatus }) => {
  const classes = useStyles();

  return (
    <div className={classes.div}>
      <span className={classes.title}>Statement</span>
      <div className={classes.div}>
        <div className={classes.divInlineFlex}>
          <span className={classes.effect}>Effect</span>
          <span className={classes.effect}>{statement.Effect}</span>
        </div>
        <Divider className={classes.titleDivider} />

        <div className={classes.imageActionDiv}>
          <img
            src={fetchImage(actionStatus.status)}
            className={classes.imageAction}
          />
          <span className={classes.effect}>Actions:</span>
          <p className={classes.actionP}>{actionStatus.text}</p>
        </div>
        <div className={classes.imageActionDiv}>
          <img
            src={fetchImage(resourceStatus.status)}
            className={classes.imageAction}
          />
          <span className={classes.effect}>Resources:</span>
          <p className={classes.actionP}>{resourceStatus.text}</p>
        </div>
      </div>
    </div>
  );
};
