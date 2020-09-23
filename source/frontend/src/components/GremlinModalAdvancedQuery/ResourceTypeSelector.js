import React, { useState } from 'react';
import Select from 'react-select';

const styles = {
  container: (provided, state) => ({
    ...provided,
    width: '100%',
    border: '1px #f2f3f3 solid',
    backgroundColor: '#fff',
    fontSize: '0.75rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    zIndex: 100
  }),
  control: () => ({
    display: 'flex'
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...provided, opacity, transition };
  },
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: state.isFocused ? '#f2f3f3' : '#fff',
      borderBottom: '1px #f2f3f3 solid',
      color: state.isFocused ? '#16191f' : '#16191f',
      fontSize: '0.75rem',
      fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
      minHeight: '15px'
    };
  }
};

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  width100: {
    width: '100%'
  }
}));

export default ({ items, onSelection }) => {
  const classes = useStyles();

  const searchItems = items.map(item => {
    return { id: item, label: item };
  });

  return (
    <div id='searchBar' className={classes.width100}>
      <>
        <Select
          className='multiSelect'
          onChange={item => onSelection(item.id)}
          styles={styles}
          options={searchItems}
        />
      </>
    </div>
  );
};
