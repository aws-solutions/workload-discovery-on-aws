import React, { useRef, useState } from 'react';
import HistoricalResourceDialog from '../Resources/HistoricalResourceDialog';
import Cytoscape from './Cytoscape';
import 'react-splitter-layout/lib/index.css';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  div: { flex: 1, position: 'relative' }
}));
export default () => {

  const classes = useStyles();


  return (
    <div style={{height: '100%', width: '100%'}}>
      {/* <div style={{ flex: 1, position: 'relative' }}> */}
      {/* {historyDialog && (
        <HistoricalResourceDialog
          selectedNode={selectedNode.current}
          hideHistoryDialog={hideHistoryDialog}
        />
      )} */}

      <Cytoscape />
    </div>
  );
};
