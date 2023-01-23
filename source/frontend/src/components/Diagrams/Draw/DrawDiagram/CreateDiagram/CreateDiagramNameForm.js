// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  FormField,
  SpaceBetween,
  Button,
  Form,
  Select,
  Autosuggest,
} from '@awsui/components-react';
import {useHistory} from 'react-router-dom';
import {OPEN_DIAGRAM} from '../../../../../routes';
import { useDiagramSettingsState } from '../../../../Contexts/DiagramSettingsContext';
import {diagramsPrefix, useListObjects, usePutObject} from "../../../../Hooks/useS3Objects";
import * as R  from 'ramda';
import validFilename from 'valid-filename';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const mapIndexed = R.addIndex(R.map);

const CreateDiagramNameForm = ({ direction }) => {
  const [{ canvas }] = useDiagramSettingsState();
  const [name, setName] = React.useState('');
  const [visibility, setVisibility] = React.useState({
    label: 'Private',
    value: 'private',
  });
  const {data=[], refetch} = useListObjects(diagramsPrefix, visibility.value);
  const { putAsync } = usePutObject(diagramsPrefix);
  const history = useHistory();
  const diagrams = mapIndexed((e, index) => {
    return {
      id: index,
      name: e.key.split('/')[e.key.split('/').length - 1],
      modified: e.lastModified,
    };
  })(data)

  const handleCreate = () => {
    putAsync({
      key: name,
      level: visibility.value,
      type: 'application/json',
      content: JSON.stringify({
        ...(canvas?.json().elements ?? {nodes: [], edges: []}),
        settings: {
          costInterval: null,
          accounts: [],
          regions: [],
          resourceTypes: [],
          hideSelected: true,
          hideEdges: false,
        }
      })
    })
      .then(() => history.push(
        OPEN_DIAGRAM.replace(':name', name).replace(
          ':visibility',
          visibility.value
        )
      ))
      .catch(console.error);
  };

  const diagramExists = () =>
    R.filter((e) => R.equals(e.name, name), diagrams).length > 0;

  const isValidFilename = () => !R.isEmpty(name) && validFilename(name);

  return (
    <Form
      actions={
        <Button
          iconAlign='right'
          onClick={handleCreate}
          disabled={!isValidFilename()}
          variant={diagramExists() ? 'normal' : 'primary'}>
          {diagramExists() ? 'Overwrite' : 'Create'}
        </Button>
      }>
      <SpaceBetween direction={direction} size='l'>
        <FormField label='Visibility'>
          <Select
            selectedOption={visibility}
            onChange={({ detail }) => setVisibility(detail.selectedOption)}
            options={[
              { label: 'Private', value: 'private' },
              { label: 'Public', value: 'public' },
            ]}
            selectedAriaLabel='Selected'
          />
        </FormField>
        <FormField
          label='Name'
          errorText={
            diagramExists() ? 'A diagram with this name already exists' : null
          }>
          <Autosuggest
            onChange={({ detail }) => setName(detail.value)}
            value={name}
            options={R.map((e) => {
              return { value: e.name };
            }, diagrams)}
            enteredTextLabel={(value) => `Use: "${value}"`}
            ariaLabel='Autosuggest example with suggestions'
            placeholder='Enter a name'
            empty='No matches found'
            onFocus={refetch}
          />
        </FormField>
      </SpaceBetween>
    </Form>
  );
};

export default CreateDiagramNameForm;
