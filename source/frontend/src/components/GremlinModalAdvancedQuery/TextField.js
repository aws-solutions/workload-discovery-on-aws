import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
}));

export default ({ label, handleChange }) => {

    const classes = useStyles();

    return (
        <TextField
            id={label}
            label={label}
            // value='0'
            onChange={handleChange}
            className={classes.textField}
            InputLabelProps={{
                shrink: true,
            }}
            margin="normal"
        />
    )
}
