import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import RootRef from '@material-ui/core/RootRef';
import { Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export function GraphImporter({setImportedGraph}) {

  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();

      reader.onabort = () => console.error('file reading was aborted');
      reader.onerror = () => console.error('file reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;
        setImportedGraph({name: file.name, graph: JSON.parse(binaryStr)})
      };
      reader.readAsText(file);
    });
  }, [setImportedGraph]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const { ref, ...rootProps } = getRootProps();

  const useStyles = makeStyles(theme => ({
    root: {
      width: '100%',
      textAlign: 'center',
      border: '2px dashed #fafafa',
      marginBottom: '2%',
      '&:focus': {
        outline: 'none'
    },
    },
    text: {
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
      fontSize: '1rem',
      padding: '5%',
      color: '#AAB7B8'
    }
  }));

  const classes = useStyles();

  return (
    <div>
      <RootRef rootRef={ref}>
        <Paper className={classes.root} {...rootProps}>
          <input {...getInputProps()} />
          <Typography className={classes.text}>
            Drop JSON graph files here, or click to select files
          </Typography>
        </Paper>
      </RootRef>
      
    </div>
  );
}
