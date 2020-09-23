import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { useImportConfigState } from '../../../../Contexts/ImportDataContext';
import FormAutoComplete from '../../../../../Utils/Forms/FormAutoComplete';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { uploadCloudFormationTemplateForAccount } from './TemplateGenerator';
import FormField from '../../../../../Utils/Forms/FormField';
import { generateCloudFormationLink } from './CloudFormationURLGenerator';
import { AWSIconButton } from '../../../../../Utils/Forms/AWSIconButton';
import { useAccountsState } from '../../../../Contexts/AccountsContext';
import {
  addAccounts,
  wrapRequest,
  getAccounts,
  handleResponse,
} from '../../../../../API/GraphQLHandler';
import CustomSnackbar from '../../../../../Utils/SnackBar/CustomSnackbar';

const regionMap = [
  { id: 'us-east-1', name: 'US East (N. Virginia)' },
  { id: 'us-east-2', name: 'US East (Ohio)' },
  { id: 'us-west-1', name: 'US West (N. California)' },
  { id: 'us-west-2', name: 'US West (Oregon)' },
  { id: 'af-south-1', name: 'Africa (Cape Town)' },
  { id: 'ap-east-1', name: 'Asia Pacific (Hong Kong)' },
  { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)' },
  { id: 'ap-northeast-3', name: 'Asia Pacific (Osaka-Local)' },
  { id: 'ap-northeast-2', name: 'Asia Pacific (Seoul)' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)' },
  { id: 'ap-southeast-2', name: 'Asia Pacific (Sydney)' },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)' },
  { id: 'ca-central-1', name: 'Canada (Central)' },
  { id: 'eu-central-1', name: 'Europe (Frankfurt)' },
  { id: 'eu-west-1', name: 'Europe (Ireland)' },
  { id: 'eu-west-2', name: 'Europe (London)' },
  { id: 'eu-south-1', name: 'Europe (Milan)' },
  { id: 'eu-west-3', name: 'Europe (Paris)' },
  { id: 'eu-north-1', name: 'Europe (Stockholm)' },
  { id: 'me-south-1', name: 'Middle East (Bahrain)' },
  { id: 'sa-east-1', name: 'South America (São Paulo)' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    // border: '1px solid #eaeded',
    // width: '100%',
    margin: '15px',
  },
  regionImport: {
    display: 'flex',
    width: '100%',
  },
  regionSelector: {
    width: '50%',
  },
  text: {
    width: '100%',
    fontSize: '0.75rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    margin: '15px',
  },

  externalIcon: {
    width: '18px',
    verticalAlign: 'bottom',
    color: '#0073bb',
  },
  link: {
    color: '#0073bb',
  },
  button: {
    height: '30px',
    marginLeft: '10px',
    backgroundColor: '#ec7211',
    borderColor: '#ec7211',
    color: '#fff',
    verticalAlign: 'bottom',
    borderRadius: '2px',
    border: '1px solid',
    fontWeight: 700,
    display: 'inline-block',
    cursor: 'pointer',
    fontSize: '0.75rem',
    textTransform: 'capitalize',
    fontFamily: ['Amazon Ember, Helvetica, Arial, sans-serif'].join(','),
    '&:hover': {
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#eb5f07',
      borderColor: '#dd6b10',
    },
    '&:focus': {
      outline: 'none',
    },
  },
  title: {
    margin: '15px',
    fontSize: '0.85rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontWeight: 600,
  },
  accountField: {
    width: '50%',
  },
  options: {
    display: 'flex',
  },
  note: {
    border: '1px solid #0073bb',
    background: '#f1faff',
    padding: '15px',
    fontSize: '0.75rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    fontWeight: 500,
    marginTop: '15px',
  },
}));

export default ({}) => {
  const [accounts, setAccounts] = useState([]);
  const [templateUrl, setTemplateUrl] = useState();
  const [accountId, setAccountId] = useState();
  const [region, setRegion] = useState();
  const [exists, setExists] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    wrapRequest(getAccounts)
      .then(handleResponse)
      .then((response) => {
        response.body.data.getAccounts.map((account) =>
          accounts.push({
            accountId: account.accountId,
            regions: account.regions,
            visible: true,
          })
        );
        setAccounts(accounts.map((account) => account));
      });
  }, []);

  const classes = useStyles();

  function buildAutoCompleteRegionItem(region) {
    return {
      value: region.id,
      label: region.name,
      id: region.id,
      group: region.id,
    };
  }

  function handleAccountImport() {
    setError(null);
    setLoading(true);
    wrapRequest(addAccounts, {
      accounts: [
        {
          accountId: accountId,
          regions: [{ name: region }],
        },
      ],
    })
      .then((response) => {
        handleResponse(response);
        uploadCloudFormationTemplateForAccount().then((template) =>
          setTemplateUrl(template)
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }

  function handleInput(input) {
    setAccountId(input);
    setExists(
      accounts.filter((account) => account.accountId === input).length > 0
    );
  }

  const renderRegionSelector = () =>
    !exists && accountId && new RegExp('^(?!0+$)[0-9]{12}$').exec(accountId);

  return (
    <>
      <div style={{ width: '50%', margin: '15px' }}>
        <Typography classes={{ root: classes.title }}>
          Import an Account
        </Typography>
        <div className={classes.root}>
          <Typography classes={{ root: classes.text }}>
            You can make a new AWS Account discoverable to AWS Perspective by:
          </Typography>
          <ol className={classes.text}>
            <li>Entering the 12-digit Account Id.</li>
            <li>Selecting the Region.</li>
            <li>Deploy the CloudFormation template.</li>
          </ol>
          <div className={classes.accountField}>
            <FormField
              onInput={(input) => handleInput(input.target.value)}
              label='Account'
              description='Enter 12-digit AWS Account Id'
              width='300px'
              margin='15px'
              error={exists}
              helper={exists ? 'This account already exists' : ''}
              // placeholder='Enter your AWS Account Id'
            />
          </div>
          {renderRegionSelector() && (
            <FormAutoComplete
              onSelected={(event, region) => setRegion(region.id)}
              // placeholder='Select a Region...'
              label='Region'
              description='Select the Region to import'
              width='300px'
              margin='15px'
              options={regionMap.map((region) =>
                buildAutoCompleteRegionItem(region)
              )}
              multiSelect={false}
              buttonAction={handleAccountImport}
              buttonText={'Import'}
              buttonDisabled={!region || loading}
              progress={loading}
            />
          )}
          {templateUrl && (
            <div style={{ display: 'inline' }}>
              <div className={classes.options}>
                <AWSIconButton
                  show
                  label='Deploy Template'
                  action={() =>
                    window.open(
                      generateCloudFormationLink(
                        accountId,
                        region,
                        templateUrl,
                        true
                      ),
                      '_blank'
                    )
                  }></AWSIconButton>
                <div>
                  <AWSIconButton
                    show
                    label='View Template'
                    action={() =>
                      window.open(templateUrl, '_blank')
                    }></AWSIconButton>
                </div>
              </div>
              <div>
                <Typography classes={{ root: classes.note }}>
                  Ensure you are logged into the account you are importing
                  before you attempt to deploy the template.
                </Typography>
              </div>
            </div>
          )}
        </div>
        {error && (
          <CustomSnackbar
            vertical='bottom'
            horizontal='center'
            type='error'
            message={error.message}
            retryFunction={handleAccountImport}
          />
        )}
      </div>
    </>
  );
};
