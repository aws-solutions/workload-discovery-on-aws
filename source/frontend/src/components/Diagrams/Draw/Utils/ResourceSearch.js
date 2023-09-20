// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect} from 'react';
import PropTypes from "prop-types";
import {FormField, Select, SpaceBetween} from '@cloudscape-design/components';
import { useResourceState } from '../../../Contexts/ResourceContext';
import { fetchResources } from '../Canvas/Commands/CanvasCommands';
import { useDiagramSettingsState } from '../../../Contexts/DiagramSettingsContext';
import * as R from "ramda";
import {useResourcesSearch} from "../../../Hooks/useResources";
import { useDebounce } from "react-use"

const ResourceSearch = () => {
  const [{ graphResources }] = useResourceState();
  const [{ canvas }, dispatchCanvas] = useDiagramSettingsState();

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
    <SpaceBetween size={"s"}>
      <FormField
        label={"Add Resource"}
        description={"Search for a resource to add to the diagram"}
      >
        <OpensearchResourceSelect
          onChange={({ detail }) => fetchResources(
              canvas,
              updateCanvas,
              updateResources,
              [detail.selectedOption.id],
              graphResources,
            )
          }
        />
      </FormField>
    </SpaceBetween>
  );
};

export const OpensearchResourceSelect = ({selectedOption=null, onChange=()=>{}}) => {
  const [search, setSearch] = React.useState('');
  const [debouncedValue, setDebouncedValue] = React.useState('');
  const {data: resources=[], isError, isFetching, isFetched, fetchNextPage, hasNextPage} = useResourcesSearch(debouncedValue);
  const [status, setStatus] = React.useState("pending");
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false)


  useEffect(() => {
    setHasLoadedOnce(false)
  }, [search])

  useEffect(() => {
    setHasLoadedOnce(true)
  }, [isFetching])

  useEffect(() => {
    if (isFetching) return setStatus("loading")
    else if (isError) return setStatus("error")
    else if (!isFetching && hasNextPage) return setStatus("pending")
    else if (isFetched && hasNextPage === false) return setStatus("finished")
  },[isFetching, hasNextPage, isFetched, isError])

  useDebounce(
    () => {
      setDebouncedValue(search);
    },
    1000,
    [search]
  );

  const byType = R.groupBy((e) => e.label);
  const groups = byType(resources);
  const filterOptions =
    R.map((e) => {
      return {
        label: e,
        id: e,
        options: R.map((v) => {
          return {
            label: v.properties.title,
            id: v.id,
            labelTag: v.label,
            tags: [v.properties.accountId, v.properties.awsRegion].filter(i => !!i),
            value: R.toString(v),
          };
        }, groups[`${e}`]),
      };
    }, Object.keys(groups));

  const handleOnLoad = ({ detail }) => {
    if (detail.filteringText !== search) setSearch(detail.filteringText)
    if (!detail.firstPage && !detail.samePage) {
      fetchNextPage()
    }
  }

  return (
    <Select
      virtualScroll
      placeholder='Find a resource'
      onChange={(e) => {
        setSearch('')
        onChange(e)
      }}
      onLoadItems={handleOnLoad}
      options={filterOptions}
      statusType={status}
      filteringType={"manual"}
      selectedOption={selectedOption}
      onBlur={() => setSearch('')}
      selectedAriaLabel='Selected'
      loadingText="Loading Resources"
      finishedText={!hasLoadedOnce ? "Starting search..." : "All resources loaded"}
      expandToViewport
    />
  )
}

OpensearchResourceSelect.propTypes = {
  selectedOption: PropTypes.object,
  onChange: PropTypes.func
}

export default ResourceSearch;
