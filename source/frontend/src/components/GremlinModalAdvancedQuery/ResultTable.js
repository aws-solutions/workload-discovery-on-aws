import React from 'react';
import MaterialTable from "material-table";
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export default ({ results, selectedNodes }) => {

    const setSelectedNodes = (rows) => {
        const nodes = new Map();
        rows.map(node => nodes.set(node.id, node))
        selectedNodes(nodes);
    }


    return (

        <MaterialTable
            title="Resources"
            columns={[
                { title: 'Name', field: 'label'}
            ]}
            components={{
                Container: props => <Paper {...props} elevation={0} />
            }}
            data={Array.from(results.values())}
            options={{
                paging: false,
                filtering: false,
                showTitle: false,
                toolbar: false,
                sorting: true,
                grouping: false,
                search: false,
                selection: true,
                headerStyle: {
                    backgroundColor: '#fafafa',
                    color: '#212529',
                    border: 'none'
                },
                rowStyle: {
                    backgroundColor: '#fff',
                    color: '#212529',
                    borderTop: '1px solid #E0E0E0',
                    fontSize: '0.75rem',
                    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif'
                }
            }}
            onSelectionChange={(rows) => setSelectedNodes(rows)}
        />
    )
};