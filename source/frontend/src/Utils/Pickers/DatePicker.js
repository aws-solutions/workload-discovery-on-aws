import 'date-fns';
import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const materialTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#232f3e'
    }
  },
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#232f3e'
      }
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: '#232f3e',
        // color: "#fff",
      }
    },
    MuiPickersDay: {
      day: {
        color: '#000'
      },
      daySelected: {
        backgroundColor: '#0073bb'
      },
      dayDisabled: {
        color: '#f2f3f3'
      },
      current: {
        color: '#fff'
      }
    },
    MuiPickersModal: {
      dialogAction: {
        color: '#fff'
      }
    }
  }
});
export default ({ label, value, onChange }) => {
  const [date, setDate] = useState(value);

  const handleDateChange = newDate => {
    setDate(newDate);
    onChange(newDate);
  };

  return (
      <ThemeProvider theme={materialTheme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            className='datepicker'
            variant='inline'
            autoOk
            ampm={false}
            disableFuture
            format='yyyy-MM-dd hh:mm'
            label={label}
            inputVariant='outlined'
            value={date}
            onChange={handleDateChange}
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
  );
};
