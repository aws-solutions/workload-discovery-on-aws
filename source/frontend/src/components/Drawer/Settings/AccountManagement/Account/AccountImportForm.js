import React from 'react';
import Alert from '@awsui/components-react/alert';
import Form from '@awsui/components-react/form';
import SpaceBetween from '@awsui/components-react/space-between';
import Button from '@awsui/components-react/button';
import Header from '@awsui/components-react/header';
import Input from '@awsui/components-react/input';
import Container from '@awsui/components-react/container';
import Multiselect from '@awsui/components-react/multiselect';
import TextContent from '@awsui/components-react/text-content';
import {
  wrapRequest,
  handleResponse,
  addAccounts,
} from '../../../../../API/Handlers/SettingsGraphQLHandler';
import AttributeCreator from '../../../../../Utils/Forms/AttributeCreator';
import { useMemo } from 'react';
import { regionMap } from '../../../../../Utils/Dictionaries/RegionMap';
import {
  downloadCloudFormationTemplateForAccount,
  downloadCloudFormationTemplateForRegion,
  uploadCloudFormationTemplateForAccount,
} from '../../../../../Utils/CloudFormation/TemplateGenerator';
import FileUploader from '../../../../../Utils/Forms/Upload/AWSFileUpload';
import AccountImportTable from './AccountImportTable';
import { FormField, Grid, RadioGroup } from '@awsui/components-react';
import Flashbar from '../../../../../Utils/Flashbar/Flashbar';
import { TextareaAutosize } from '@material-ui/core';
import PropTypes from 'prop-types';


const fileDownload = require('js-file-download');
const R = require('ramda');
const EDITOR = 'editor';

const columns = [
  {
    id: 'account',
    header: 'Account Id',
    cell: (e) => e.accountId,
    sortingField: 'accountId',
    width: 200,
    minWidth: 200,
  },
  {
    id: 'accountName',
    header: 'Account Name',
    cell: (e) => e.accountName,
    sortingField: 'accountName',
    width: 300,
    minWidth: 300,
  },
  {
    id: 'region',
    header: 'Region',
    cell: (e) => e.label,
    width: 200,
    minWidth: 200,
  },
];

function createData(id, label, region, accountId, accountName) {
  return {
    id,
    label,
    region,
    accountId,
    accountName
  };
}

const AccountIdControl = React.memo(({ value, index, placeholder, setItems, prop }) => {
  return (
    <FormField
      errorText={
        R.length(value) !== 12 ? 'Account Id should be 12 digits' : undefined
      }>
      <Input
        invalid={R.length(value) !== 12}
        value={value}
        placeholder={placeholder}
        onChange={({ detail }) => {
          setItems((items) => {
            const updatedItems = [...items];
            updatedItems[index] = {
              ...updatedItems[index],
              [prop]: detail.value,
              ['csv']: false,
            };
            return updatedItems;
          });
        }}
      />
    </FormField>
  );
});

const AccountNameControl = React.memo(({ value, index, placeholder, setItems, prop }) => {
  return (
    <FormField
      errorText={
        R.length(value) > 64 ? 'Account name should be less than 64 characters' : undefined
      }>
      <Input
        invalid={R.length(value) > 64}
        value={value}
        placeholder={placeholder}
        onChange={({ detail }) => {
          setItems((items) => {
            const updatedItems = [...items];
            updatedItems[index] = {
              ...updatedItems[index],
              [prop]: detail.value,
              ['csv']: false,
            };
            return updatedItems;
          });
        }}
      />
    </FormField>
  );
});

const RegionControl = React.memo(
  ({ value, index, placeholder, setItems, prop, options }) => {
    return (
      <FormField>
        <Multiselect
          filteringType='auto'
          tokenLimit={2}
          selectedOptions={value}
          onChange={({ detail }) =>
            setItems((items) => {
              const updatedItems = [...items];
              updatedItems[index] = {
                ...updatedItems[index],
                [prop]: R.map((e) => {
                  return {
                    region: e.id,
                    label: e.label,
                    id: e.id,
                    value: e.label,
                  };
                }, detail.selectedOptions),
              };
              return updatedItems;
            })
          }
          deselectAriaLabel={(e) => 'Remove ' + e.label}
          options={options}
          placeholder={placeholder}
          selectedAriaLabel='Selected'
        />
      </FormField>
    );
  }
);

const mapIndexed = R.addIndex(R.map);
const byAccount = R.groupBy((e) => e.accountId);

const AccountImportForm = ({ onChange }) => {
  const pageSize = 10;
  const [selected, setSelected] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const [error, setError] = React.useState();
  const [importType, setImportType] = React.useState('editor');

  const definition = useMemo(
    () => [
      {
        label: 'Account Id',
        control: ({ accountId = '' }, itemIndex) => (
          <AccountIdControl
            prop='accountId'
            value={accountId}
            index={itemIndex}
            placeholder={'Enter an AWS Account Id'}
            setItems={setAccounts}
          />
        ),
      },
      {
        label: 'Account name',
        control: ({ accountName = '' }, itemIndex) => (
          <AccountNameControl
            prop='accountName'
            value={accountName}
            index={itemIndex}
            placeholder={'Enter a name for this account'}
            setItems={setAccounts}
          />
        ),
      },
      {
        label: 'Regions',
        control: ({ regions = [] }, itemIndex) => (
          <RegionControl
            prop='regions'
            value={regions}
            index={itemIndex}
            placeholder={'Select AWS Regions'}
            setItems={setAccounts}
            options={regionMap.map((region) => {
              return {
                label: region.name,
                id: region.id,
                value: region.name,
              };
            })}
          />
        ),
      },
    ],
    []
  );

  const getRows = () =>
      R.chain(
        (account) =>
          account.regions
            ? mapIndexed(
                (e, index) =>
                  createData(
                    `${account.accountId}-${e.region}-${index}`,
                    R.find(R.propEq('id', e.region), regionMap).name,
                    e.region,
                    account.accountId,
                    account.accountName
                  ),
                account.regions
              )
            : [],
        accounts
      )
    

  const removeAllAccounts = () => {
    setAccounts([]);
    setSelected([]);
  };

  const removeAccounts = () => {
    R.forEach((account) => {
      const accountToDelete = R.find(
        R.propEq('accountId', account.accountId),
        accounts
      );
      if (accountToDelete) {
        const regionToDelete = R.find(
          R.propEq('region', account.region),
          accountToDelete.regions
        );
        accountToDelete.regions = R.without(
          [regionToDelete],
          accountToDelete.regions
        );
      }
    }, selected);
    setAccounts(R.filter((e) => !R.isEmpty(e.regions), accounts));
  };

  const processCSVImport = (groupBy, items) => {
    const groups = groupBy(items);
    return R.map((e) => {
      return { accountId: e, accountName: R.head(groups[`${e}`]).accountName, regions: groups[`${e}`], csv: true };
    }, R.keys(groups));
  };

  const removeSelectedAccounts = async () => {
    removeAccounts();
    setSelected([]);
  };

  const importAccounts = async () => {
    setLoading(true);
    const regionNames = (acc, { accountName, regions }) => acc.concat({accountName: accountName, regions: regions});
    const toAccountId = ({ accountId }) => accountId;
    await Promise.resolve(
      R.filter((e) => hasAccountId(e) && hasRegion(e), accounts)
    )
      .then(R.reduceBy(regionNames, [], toAccountId))
      .then((e) =>
        R.keys(e).map((k) => {
          return {
            accountId: k,
            name: R.head(e[`${k}`]).accountName,
            regions: R.flatten(e[`${k}`].map((account) => 
              R.map(region => { return { name: region.region }}, account.regions)
            
            )),
          };
        })   
      ) 
      .then((e) =>
        wrapRequest(addAccounts, {
          accounts: e,
        })
          .then(handleResponse)
          .then(setLoading(false))
          .then(() => {
            setAccounts([]);
          })
          .catch((err) => {
            setError(err);
            setLoading(false);
          })
      );

    onChange();
  };

  const handleUpload = (items) => {
    const currentAccounts = [...accounts];
    setAccounts(
      R.uniq(currentAccounts.concat(processCSVImport(byAccount, items)))
    );
  };

  const hasAccountId = (e) => !R.isNil(e.accountId) && !R.isEmpty(e.accountId);
  const hasRegion = (e) => !R.isNil(e.regions) && !R.isEmpty(e.regions);

  const itemRemoved = (itemIndex) => {
    const tmpItems = [...accounts];
    tmpItems.splice(itemIndex, 1);
    setAccounts(tmpItems);
  };

  const itemAdded = () => {
    let index = R.findLastIndex(R.propEq('csv', false), accounts);
    setAccounts(R.insert(index < 0 ? 0 : index++, {}, accounts));
  };

  return (
    <>
      {error && (
        <Flashbar
          type='error'
          message='We could not process that request. It could be a temporary issue. Please try again.'
        />
      )}
      <Container
        header={
          <Header
            variant='h2'
            actions={
              <SpaceBetween direction='horizontal' size='xs'>
                <Button
                  iconName='download'
                  onClick={async () => {
                    fileDownload(
                      await downloadCloudFormationTemplateForAccount(),
                      'aws-perspective-account-import.template'
                    );
                    fileDownload(
                      await downloadCloudFormationTemplateForRegion(),
                      'aws-perspective-region-import.template'
                    );
                  }}>
                  Save template
                </Button>
                <Button
                  variant='primary'
                  disabled={R.or(
                    R.isEmpty(accounts),
                    !R.isEmpty(
                      R.filter(
                        (e) => R.or(R.isNil(e.regions), R.isEmpty(e.regions)),
                        accounts
                      )
                    )
                  )}
                  loading={loading}
                  onClick={importAccounts}>
                  Import
                </Button>
              </SpaceBetween>
            }>
            Import Accounts
          </Header>
        }>
        <SpaceBetween direction='vertical' size='l'>
          <Alert
            dismissible
            header='Download and deploy the AWS CloudFormation templates'>
            To complete the import process you must:
            <ol>
              <li>
                Click <strong>Save template</strong> to download the necessary
                CloudFormation templates.
              </li>
              <li>
                Deploy the <strong>aws-perspective-account-import</strong>{' '}
                CloudFormation template in <strong>One (1)</strong> of the
                Regions you are importing within an AWS account you wish to make
                discoverable to AWS Perspective.
              </li>
              <li>
                Deploy the <strong>aws-perspective-region-import</strong>{' '}
                CloudFormation template in the remaining Regions you wish to
                make discoverable to AWS Perspective.
              </li>
            </ol>
          </Alert>
          <SpaceBetween direction='vertical' size='l'>
            <Grid gridDefinition={[{ colspan: 10 }, { colspan: 2 }]}>
              <SpaceBetween direction='vertical' size='l'>
                <RadioGroup
                  onChange={({ detail }) => setImportType(detail.value)}
                  value={importType}
                  items={[
                    {
                      value: 'editor',
                      label: 'Provide Account Id & Regions',
                      description:
                        'You can provide the AWS Account Id and Regions by clicking Add account',
                    },
                    {
                      value: 'csv',
                      label: 'Upload a CSV',
                      description:
                        'You can upload a CSV file that contains the AWS Accounts and Regions to make discoverable',
                    },
                  ]}
                />
                <SpaceBetween direction='vertical' size='l'>
                  <Form>
                    {R.equals(importType, EDITOR) && (
                      <AttributeCreator
                        item='account'
                        items={R.filter((e) => !e.csv, accounts)}
                        label='Account Id'
                        placeholder='Enter an AWS Account Id'
                        itemAdded={itemAdded}
                        itemRemoved={itemRemoved}
                        setItems={setAccounts}
                        definition={definition}
                      />
                    )}
                    {!R.equals(importType, EDITOR) && (
                      <FileUploader onUpload={handleUpload} />
                    )}
                  </Form>
                </SpaceBetween>
              </SpaceBetween>
            </Grid>

            <AccountImportTable
              trackBy='id'
              rows={getRows()}
              columns={columns}
              onRemove={removeSelectedAccounts}
              onRemoveAll={removeAllAccounts}
              sortColumn={'region'}
              pageSize={pageSize}
              selectionType='multi'
              selectedItems={selected}
              onSelectionChange={(item) => setSelected(item)}
              loading={loading}
            />
          </SpaceBetween>
        </SpaceBetween>
      </Container>
    </>
  );
};

AccountImportForm.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default AccountImportForm;