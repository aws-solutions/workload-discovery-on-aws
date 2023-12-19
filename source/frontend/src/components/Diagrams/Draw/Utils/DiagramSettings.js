// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Form,
  FormField,
  Modal,
  Multiselect,
  RadioGroup,
  SpaceBetween,
  Toggle
} from '@cloudscape-design/components';
import CostDatePicker from "./CostDatePicker";
import * as R from "ramda";
import {useResourcesMetadata} from "../../../Hooks/useResourcesMetadata";
import {fetchImage} from "../../../../Utils/ImageSelector";

const DiagramSettings = ({onSettingsChange, initialSettings}) => {
  const [settings, setSettings] = useState(initialSettings);
  const [lastSubmittedSettings, setLastSubmittedSettings] = useState(settings);
  const [hasDestructiveChanges, setHasDestructiveChanges] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const {data={accounts: [], resourceTypes: []}, status} = useResourcesMetadata();
  const uniqRegions = R.compose(
    R.uniq,
    R.chain(i => i.regions?.map(j => ({ label: j.name, value: j.name })) ?? [])
  )

  const options = {
    accounts: data.accounts.map(i => ({ label: i.accountId, value: i.accountId })),
    regions: uniqRegions(data.accounts),
    resourceTypes: data.resourceTypes.map(i => ({
      label: i.type,
      value: i.type,
      iconUrl: fetchImage(i.type)
    }))
  }

  const confirmSubmit = () => {
    setHasDestructiveChanges(false);
    setLastSubmittedSettings(settings);
    onSettingsChange && onSettingsChange(settings);
    setHasUnsavedChanges(false);
  }

  const handleSubmit = () => {
    const isDestructiveKey = (val, key) => !['costInterval', 'hideEdges'].includes(key)
    const filterNonDestructiveKeys = R.pickBy(isDestructiveKey)
    if (!R.equals(filterNonDestructiveKeys(settings), filterNonDestructiveKeys(lastSubmittedSettings))) {
      setHasDestructiveChanges(true)
    } else {
      confirmSubmit()
    }
  }

  useEffect(() => {
      setHasUnsavedChanges(!R.equals(settings, initialSettings));
  }, [settings, initialSettings]);

  const handleChange = (prop, value) => {
    setSettings({
      ...settings,
      [prop]: value
    })
  }

  const filterTypeOptions = [
    { label: "Hide Selected", value: true },
    { label: "Only Show Selected", value: false },
  ]

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Modal
        onDismiss={() => setHasDestructiveChanges(false)}
        visible={hasDestructiveChanges}
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button onClick={() => setHasDestructiveChanges(false)} variant="link">Cancel</Button>
              <Button onClick={confirmSubmit} variant="primary">Apply</Button>
            </SpaceBetween>
          </Box>
        }
        header="Apply Settings"
      >
        <SpaceBetween size={"s"}>
          <Box>Modifying the filters will cause some elements to be removed from your diagram. Are you sure
            you wish to apply these settings?</Box>
          <Alert

            header="Persisting Settings"
          >
            You must also save the diagram after applying new settings in order to persist these changes
          </Alert>
        </SpaceBetween>

      </Modal>
      <Form
        actions={<Button onClick={handleSubmit} disabled={!hasUnsavedChanges} variant="primary">Apply</Button>}>
        <SpaceBetween size={"s"}>
          <CostDatePicker initialInterval={settings.costInterval} normalizeInterval={false} onIntervalChange={(val) => handleChange("costInterval", val)} />
          <FormField label={"Filter type"}>
            <RadioGroup
              onChange={({ detail }) => handleChange("hideSelected", detail.value)}
              value={settings.hideSelected}
              items={filterTypeOptions}
            />
          </FormField>
          <FormField
            label={"Accounts"}
            description={"Select which accounts to display"}
          >
            <Multiselect
              placeholder='Select accounts'
              onChange={e => handleChange('accounts', e.detail.selectedOptions.map(i => i.value))}
              options={options.accounts}
              filteringType={"auto"}
              selectedOptions={options.accounts.filter(i => settings.accounts.includes(i.value))}
              selectedAriaLabel='Selected'
              expandToViewport
              statusType={status}
            />
          </FormField>
          <FormField
            label={"Regions"}
            description={"Select which regions to display"}
          >
            <Multiselect
              placeholder='Select regions'
              onChange={e => handleChange('regions', e.detail.selectedOptions.map(i => i.value))}
              options={options.regions}
              filteringType={"auto"}
              selectedOptions={options.regions.filter(i => settings.regions.includes(i.value))}
              selectedAriaLabel='Selected'
              expandToViewport
              statusType={status}
            />
          </FormField>
          <FormField
            label={"Resource Types"}
            description={"Select which resource types to display"}
          >
            <Multiselect
              placeholder='Select resource types'
              onChange={e => handleChange('resourceTypes', e.detail.selectedOptions.map(i => i.value))}
              options={options.resourceTypes}
              filteringType={"auto"}
              selectedOptions={options.resourceTypes.filter(i => settings.resourceTypes.includes(i.value))}
              selectedAriaLabel='Selected'
              expandToViewport
              statusType={status}
            />
          </FormField>
          <Toggle
            onChange={({ detail }) =>
              handleChange("hideEdges", detail.checked)
            }
            checked={settings.hideEdges}
          >
            Hide Edges
          </Toggle>
        </SpaceBetween>
      </Form>
    </form>
  );
};

export default DiagramSettings;
