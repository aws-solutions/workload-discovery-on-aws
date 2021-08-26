import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  SpaceBetween,
  FormField,
  Input,
  Button,
  Header,
  Container,
  Multiselect,
  Alert,
  TextContent,
  ExpandableSection,
  Autosuggest,
} from '@awsui/components-react';
import { regionMap } from '../../../../../../Utils/Dictionaries/RegionMap';
import FileUploader from '../../../../../../Utils/Forms/Upload/AWSFileUpload';
import CopyContent from '../../../../../../Utils/Forms/Copy/CopyContent';
import ExampleCSV from '../ExampleCSV';

const R = require('ramda');

const isAccountIdValid = (accountId) => R.equals(12, R.length(accountId));
const isAccountNameValid = (accountName) =>
  R.and(R.gt(R.length(accountName), 0), R.lte(R.length(accountName), 64));
const areRegionsValid = (regions) => !R.isEmpty(regions);

const mapIndexed = R.addIndex(R.map);

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

const AccountImportStackSetsForm = ({ importedRegions, addRegions }) => {
  const [selectedRegions, setSelectedRegions] = React.useState([]);
  const [accountId, setAccountId] = React.useState();
  const [accountName, setAccountName] = React.useState('');
  const [csvError, setCSVError] = React.useState([]);
  const [showValidationError, setShowValidationError] = React.useState(false);

  const validateInputs = () => {
    setShowValidationError(true);

    if (!isAccountIdValid(accountId)) {
      return false;
    }
    if (!isAccountNameValid(accountName)) {
      return false;
    }
    if (!areRegionsValid(selectedRegions)) {
      return false;
    }
    setShowValidationError(false);
    return true;
  };

  const handleClick = () => {
    addRegions(
      R.map(
        (region) => buildRegion(accountId, accountName, region.region),
        selectedRegions
      )
    );
    setAccountId();
    setAccountName();
    setSelectedRegions([]);
  };

  const buildRegion = (accountId, accountName, region) => {
    return {
      accountId: accountId,
      accountName: accountName,
      name: region,
    };
  };

  const processCSVImport = (items) =>
    addRegions(
      R.map(
        (region) =>
          buildRegion(region.accountId, region.accountName, region.region),
        items
      )
    );

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
      ? processCSVImport(items)
      : setCSVError(R.uniqBy(R.prop('message'), invalidItems));
  };

  const updateForm = (account) => {
    setAccountId(account.accountId);
    setAccountName(account.accountName);
  };

  const resetForm = (id) => {
    setAccountId(id);
    setAccountName();
  };

  const lookupAccount = (id) => {
    const accountIndex = R.findIndex(
      R.propEq('accountId', id),
      importedRegions
    );
    R.lt(accountIndex, 0)
      ? resetForm(id)
      : updateForm(importedRegions[accountIndex]);
  };
  return (
    <Form
      actions={
        <SpaceBetween direction='horizontal' size='xs'>
          <Button
            variant='primary'
            onClick={() => {
              if (validateInputs()) handleClick();
            }}>
            Add
          </Button>
        </SpaceBetween>
      }>
      <SpaceBetween direction='vertical' size='l'>
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
        <ExampleCSV />

        <Container
          header={
            <Header
              description='Tell us about the AWS Regions to make discoverable'
              actions={
                <FileUploader
                  validateAndUpload={validateAndUploadCSV}
                  onError={(item) => setCSVError(item)}
                />
              }
              variant='h2'>
              AWS Region details
            </Header>
          }>
          <SpaceBetween direction='horizontal' size='l'>
            <FormField
              label='Account Id'
              description='The 12-digit AWS Account Id'
              errorText={
                R.and(showValidationError, !isAccountIdValid(accountId))
                  ? 'Account Id should be 12-digits'
                  : undefined
              }>
              <Autosuggest
                onChange={({ detail }) => lookupAccount(detail.value)}
                value={R.isNil(accountId) ? '' : accountId}
                options={R.map((region) => {
                  return { value: region.accountId };
                }, importedRegions)}
                enteredTextLabel={(value) => `Add new account: "${value}"`}
                ariaLabel='Enter a 12-digit AWS Account Id'
                placeholder='Enter an Account Id'
                empty='No Accounts found'
              />
            </FormField>
            <FormField
              label='Account name'
              description='A friendly name to associate with this Account.'
              errorText={
                R.and(showValidationError, !isAccountNameValid(accountName))
                  ? 'Account name should have fewer than 64 characters'
                  : undefined
              }>
              <Input
                invalid={R.and(
                  showValidationError,
                  !isAccountNameValid(accountName)
                )}
                value={accountName}
                placeholder='Enter a name'
                onChange={({ detail }) => setAccountName(detail.value)}
              />
            </FormField>
            <FormField
              description='Select the Regions to make discoverable.'
              label='Regions'
              errorText={
                R.and(showValidationError, !areRegionsValid(selectedRegions))
                  ? 'You need to select at least one Region'
                  : undefined
              }>
              <Multiselect
                filteringType='auto'
                tokenLimit={2}
                selectedOptions={selectedRegions}
                onChange={({ detail }) =>
                  setSelectedRegions(detail.selectedOptions)
                }
                deselectAriaLabel={(e) => 'Remove ' + e.label}
                options={regionMap.map((region) => {
                  return {
                    label: region.name,
                    id: region.id,
                    region: region.id,
                    value: region.name,
                  };
                })}
                placeholder='Select Regions'
                selectedAriaLabel='Selected'
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Form>
  );
};

AccountImportStackSetsForm.propTypes = {
  importedRegions: PropTypes.array.isRequired,
  addRegions: PropTypes.func.isRequired,
};

export default AccountImportStackSetsForm;
