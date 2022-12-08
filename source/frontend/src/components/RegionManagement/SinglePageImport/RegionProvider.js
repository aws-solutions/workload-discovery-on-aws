// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
  Alert,
  Container,
  Header,
  SpaceBetween,
  TextContent,
} from '@awsui/components-react';

import RegionUploadMethod from './RegionUploadMethod';
import RegionEditor from './RegionEditor';
import FileUploader from '../../../Utils/Forms/Upload/AWSFileUpload';
import ImportTable from './ImportTable';
import { regionMap } from '../../../Utils/Dictionaries/RegionMap';

import * as R  from 'ramda';
const mapIndexed = R.addIndex(R.map);
const CSV = 'csv';

const itemHasAccountId = R.has('accountId');
const itemHasAccountName = R.has('accountName');
const itemHasRegion = R.has('region');
const itemHasAll = R.allPass([
  itemHasAccountId,
  itemHasAccountName,
  itemHasRegion,
]);

const csvAccountIdIsValid = (item) =>
  R.equals(R.length(R.prop('accountId', item)), 12);
const csvAccountNameIsValid = (item) =>
  R.lte(R.length(R.prop('accountName', item)), 64);
const csvRegionisValid = (item) =>
  R.gte(R.findIndex(R.propEq('id', R.prop('region', item)), regionMap), 0);
const itemIsValid = R.allPass([
  csvAccountIdIsValid,
  csvAccountNameIsValid,
  csvRegionisValid,
]);

const RegionProvider = ({ regions, setRegions }) => {
  const [uploadMethod, setUploadMethod] = React.useState(CSV);
  const [csvError, setCSVError] = React.useState([]);

  const handleChange = (items) => {
    setRegions(R.uniq([...regions].concat(items)));
  };

  const validateAndUploadCSV = (items) => {
    setCSVError([]);
    const tooManyItems = R.gt(R.length(items), 50);

    const invalidItems = R.reduce(
      (acc, val) => {
        if (!itemHasAll(val))
          acc.push({
            item: val,
            message: 'A column is missing from the CSV file.',
          });
        if (!itemIsValid(val))
          acc.push({
            item: val,
            message: 'There are formatting errors in the values provided',
          });
        return acc;
      },
      [],
      items
    );

    if (tooManyItems)
      invalidItems.push({
        item: null,
        message:
          'Too many Regions provided, you can upload a maximum of 50 Regions',
      });

    R.isEmpty(invalidItems)
      ? handleChange(items)
      : setCSVError(R.uniqBy(R.prop('message'), invalidItems));
  };

  return (
    <SpaceBetween size='l'>
      <Container header={<Header variant='h2'>Import Method</Header>}>
        <SpaceBetween size='l'>
          <RegionUploadMethod setUploadMethod={setUploadMethod} />
          {R.equals(CSV, uploadMethod) ? (
            <FileUploader
              validateAndUpload={validateAndUploadCSV}
              onError={(item) => setCSVError(item)}
            />
          ) : (
            <RegionEditor onChange={handleChange} />
          )}
          {!R.isEmpty(csvError) && (
            <Alert
              visible={true}
              dismissAriaLabel='Close alert'
              type='error'
              header='That CSV file is not valid.'>
              <TextContent>
                <ul>
                  {mapIndexed(
                    (e, index) => (
                      <li key={index}>{e.message}</li>
                    ),
                    csvError
                  )}
                </ul>
              </TextContent>
            </Alert>
          )}
        </SpaceBetween>
      </Container>
      <ImportTable regions={regions} setRegions={setRegions} />
    </SpaceBetween>
  );
};

export default RegionProvider;
