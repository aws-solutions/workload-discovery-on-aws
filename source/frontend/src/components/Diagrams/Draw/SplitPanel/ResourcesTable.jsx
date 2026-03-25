// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    Table,
    Box,
    TextFilter,
    Pagination,
} from '@cloudscape-design/components';
import {useCollection} from '@cloudscape-design/collection-hooks';
import PropTypes from 'prop-types';
import {useDiagramSettingsState} from '../../../Contexts/DiagramSettingsContext';
import {fetchImage} from '../../../../Utils/ImageSelector';

import * as R from 'ramda';

const ResourcesTable = ({resources, selectedResource, setSelectedResource}) => {
    const [{canvas}] = useDiagramSettingsState();

    const navigateToSelectedResource = element => {
        canvas.zoom({level: 1.0});
        canvas.nodes().removeClass('highlight');
        canvas.center(element);
        element.addClass('highlight');
        const removeHighlight = setTimeout(() => {
            canvas.elements().map(function (ele) {
                ele.removeClass('highlight');
            });
        }, 2000);
        return () => clearTimeout(removeHighlight);
    };

    const onSelectionChange = selectedResources => {
        setSelectedResource(selectedResources);
        navigateToSelectedResource(
            canvas.getElementById(R.head(selectedResources).id)
        );
    };

    function imageCell(item) {
        return (
            <img
                alt={`${item.data.resource.type} icon`}
                src={fetchImage(item.data.resource.type)}
                style={{
                    background: 'white',
                    width: '30px',
                    height: '30px',
                }}
            />
        );
    }

    const {items, filterProps, collectionProps, paginationProps} =
        useCollection(resources, {
            filtering: {
                empty: (
                    <Box textAlign="center" color="inherit">
                        <b>No resource</b>
                        <Box
                            padding={{bottom: 's'}}
                            variant="p"
                            color="inherit"
                        >
                            Resources will appear when a diagram is created
                        </Box>
                    </Box>
                ),
                noMatch: (
                    <Box textAlign="center" color="inherit">
                        <b>No match</b>
                        <Box
                            padding={{bottom: 's'}}
                            variant="p"
                            color="inherit"
                        >
                            No resources matched.
                        </Box>
                    </Box>
                ),
            },
            pagination: {pageSize: 5},
            sorting: {sortingColumn: 'name'},
        });

    return (
        <Table
            {...collectionProps}
            filter={
                <TextFilter
                    {...filterProps}
                    filteringPlaceholder="Find a resource"
                />
            }
            empty={collectionProps.empty}
            columnDefinitions={[
                {
                    id: 'icon',
                    cell: item => imageCell(item),
                    width: 50,
                    minWidth: 50,
                },

                {
                    id: 'name',
                    header: 'Name',
                    cell: item => item.name,
                    width: 200,
                    minWidth: 200,
                },
                {
                    id: 'type',
                    header: 'Type',
                    cell: item => item.data.resource.type,
                    width: 200,
                    minWidth: 200,
                },
            ]}
            visibleColumns={['icon', 'name', 'type']}
            onSelectionChange={({detail}) =>
                onSelectionChange(detail.selectedItems)
            }
            items={items}
            resizableColumns
            selectionType="single"
            selectedItems={selectedResource}
            pagination={<Pagination {...paginationProps} />}
            // stickyHeader
        />
    );
};

ResourcesTable.propTypes = {
    resources: PropTypes.array.isRequired,
    selectedResource: PropTypes.array.isRequired,
    setSelectedResource: PropTypes.func.isRequired,
};
export default ResourcesTable;
