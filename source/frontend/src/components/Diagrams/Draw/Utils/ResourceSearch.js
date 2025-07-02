// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import './ResourceSearch.css';
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Multiselect} from '@cloudscape-design/components';
import {useResourceState} from '../../../Contexts/ResourceContext';
import {fetchResources} from '../Canvas/Commands/CanvasCommands';
import {useDiagramSettingsState} from '../../../Contexts/DiagramSettingsContext';
import * as R from 'ramda';
import {useResourcesSearch} from '../../../Hooks/useResources';
import {useDebounce} from 'react-use';

const ResourceSearch = () => {
    const [{graphResources}] = useResourceState();
    const [{canvas}, dispatchCanvas] = useDiagramSettingsState();

    const [search, setSearch] = React.useState('');
    const [selectedOptions, setSelectedOptions] = useState([]);

    function resetSearchBar() {
        setSearch('');
        setSelectedOptions([]);
    }

    const updateCanvas = () => {
        dispatchCanvas({
            type: 'setCanvas',
            canvas: canvas,
        });
    };

    const updateResources = () => {
        dispatchCanvas({
            type: 'setResources',
            resources: canvas.nodes(),
        });
    };

    return (
        <div className="flex-container">
            <div className={'flex-auto'}>
                <OpensearchResourceSelect
                    onChange={({detail}) =>
                        setSelectedOptions(detail.selectedOptions)
                    }
                    selectedOptions={selectedOptions}
                    search={search}
                    setSearch={setSearch}
                />
            </div>
            <div className="flex-no-shrink">
                <Button
                    ariaLabel={`Add ${selectedOptions.length} selected resource${selectedOptions.length !== 1 ? 's' : ''} to diagram`}
                    disabled={selectedOptions.length === 0}
                    onClick={async () => {
                        await fetchResources(
                            canvas,
                            updateCanvas,
                            updateResources,
                            selectedOptions.map(x => x.id),
                            graphResources
                        );
                        resetSearchBar();
                    }}
                >
                    Add to diagram
                </Button>
            </div>
        </div>
    );
};

export const OpensearchResourceSelect = ({
    onChange,
    search,
    setSearch,
    selectedOptions = [],
}) => {
    const [debouncedValue, setDebouncedValue] = React.useState('');
    const {
        data: resources = [],
        isError,
        isFetching,
        isFetched,
        fetchNextPage,
        hasNextPage,
    } = useResourcesSearch(debouncedValue);
    const [status, setStatus] = React.useState('pending');
    const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);

    useEffect(() => {
        setHasLoadedOnce(false);
    }, [search]);

    useEffect(() => {
        setHasLoadedOnce(true);
    }, [isFetching]);

    useEffect(() => {
        if (isFetching) return setStatus('loading');
        else if (isError) return setStatus('error');
        else if (!isFetching && hasNextPage) return setStatus('pending');
        else if (isFetched && hasNextPage === false)
            return setStatus('finished');
    }, [isFetching, hasNextPage, isFetched, isError]);

    useDebounce(
        () => {
            setDebouncedValue(search);
        },
        1000,
        [search]
    );

    const byType = R.groupBy(e => e.label);
    const groups = byType(resources);
    const options = R.map(e => {
        return {
            label: e,
            id: e,
            options: R.map(v => {
                return {
                    label: v.properties.title,
                    id: v.id,
                    labelTag: v.label,
                    tags: [
                        v.properties.accountId,
                        v.properties.awsRegion,
                    ].filter(i => !!i),
                    value: R.toString(v),
                };
            }, groups[`${e}`]),
        };
    }, Object.keys(groups));

    const handleOnLoad = ({detail}) => {
        if (detail.filteringText !== search) setSearch(detail.filteringText);
        if (!detail.firstPage && !detail.samePage) {
            fetchNextPage();
        }
    };

    return (
        <Multiselect
            virtualScroll
            ariaLabel="Resource search bar"
            placeholder="Find resources"
            onChange={onChange}
            onLoadItems={handleOnLoad}
            options={options}
            statusType={status}
            filteringType={'manual'}
            tokenLimit={5}
            selectedOptions={selectedOptions}
            onBlur={() => setSearch('')}
            selectedAriaLabel="Resource selected"
            loadingText="Loading Resources"
            finishedText={
                !hasLoadedOnce ? 'Starting search...' : 'All resources loaded'
            }
            renderHighlightedAriaLive={option => {
                if (!option) return '';

                return `${option.label} will be selected`;
            }}
            expandToViewport
        />
    );
};

OpensearchResourceSelect.propTypes = {
    selectedOption: PropTypes.object,
    onChange: PropTypes.func,
};

export default ResourceSearch;
