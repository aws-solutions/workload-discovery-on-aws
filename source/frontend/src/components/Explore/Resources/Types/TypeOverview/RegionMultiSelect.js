// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import PropTypes from "prop-types";
import {Button, FormField, Multiselect} from "@cloudscape-design/components";
import * as R from "ramda";
import {useResourcesRegionMetadata} from "../../../../Hooks/useResourcesMetadata";
import {useDeepCompareEffect} from "react-use";

const RegionMultiSelect = ({accounts=[], selected=[], onChange=() => ({}), onOptionsChange=() => ({}), disabled=false}) => {
  const { data=[], isLoading, status } = useResourcesRegionMetadata(accounts.map(i => ({accountId: i})), {
    enabled: !disabled
  });
  const toRegions = R.chain((e) => e.regions)
  const regions = toRegions(data);

  useDeepCompareEffect(() => {
    if (!isLoading)
      onOptionsChange(toRegions(data).map(i => i.name));
  }, [data, isLoading, onOptionsChange, toRegions])

  const options = Object.values(regions
    .reduce((acc, next) => ({
      ...acc,
      [next.name]: {
        name: next.name,
        resourceTypes: R.uniq(next.resourceTypes.concat(acc[next.name]?.resourceTypes || [])),
        count: next.count + (acc[next.name]?.count || 0)
      }
    }), {}))
    .map(i => ({
      label: i.name,
      value: i.name,
      tags:[
        `${i.resourceTypes.length} resource types`,
        `${i.count} resources`,
      ],
    }));

  const handleSelectAll = () => {
    onChange(R.uniq(R.map(i => i.value, options)));
  }

  return (<>
    <FormField label={"Regions"} secondaryControl={<Button onClick={handleSelectAll}>Choose All</Button>}>
      <Multiselect
        filteringType="auto"
        options={options}
        status={status}
        disabled={disabled}
        selectedOptions={options.filter(i => selected.indexOf(i.value) !== -1)}
        onChange={({detail}) => onChange(
          R.uniq(R.map(i => i.value, detail.selectedOptions))
        )}
        placeholder="Choose regions to filter by"
        tokenLimit={5}
        i18nStrings={{
          tokenLimitShowMore: "Show more chosen options",
          tokenLimitShowFewer: "Show fewer chosen options"
        }}
      />
    </FormField>
  </>)
}

RegionMultiSelect.propTypes = {
  accounts: PropTypes.array,
  selected: PropTypes.array,
  onChange: PropTypes.func,
  onOptionsChange: PropTypes.func,
  disabled: PropTypes.bool,
}

export default RegionMultiSelect;
