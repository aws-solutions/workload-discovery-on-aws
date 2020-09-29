import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import FormAutoComplete from '../../../../../Utils/Forms/FormAutoComplete';
import {
  downloadCloudFormationTemplateForRegion,
  uploadCloudFormationTemplateForRegion,
} from './TemplateGenerator';
import { generateCloudFormationLink } from './CloudFormationURLGenerator';
import { AWSIconButton } from '../../../../../Utils/Forms/AWSIconButton';
import {
  handleResponse,
  addRegions,
  wrapRequest,
  getAccounts,
} from '../../../../../API/GraphQLHandler';
import CustomSnackbar from '../../../../../Utils/SnackBar/CustomSnackbar';
var findIndex = require('lodash.findindex');
var fileDownload = require('js-file-download');

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
    // padding: '15px',
    // height: '500px',
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
  expanded: {
    overflow: 'scroll',
  },
  heading: {
    color: '#535B63',
    fontSize: '1rem',
    fontFamily: 'Amazon Ember, Helvetica, Arial, sans-serif',
    lineHeight: '2rem',
    marginBottom: '.5rem',
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
  const [selectedAccount, setSelectedAccount] = useState();
  const [selectedRegion, setSelectedRegion] = useState();
  const [templateUrl, setTemplateUrl] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();

  React.useEffect(() => {
    wrapRequest(getAccounts)
      .then(handleResponse)
      .then((response) =>
        response.body.data.getAccounts.map((account) => {
          accounts.push({
            accountId: account.accountId,
            regions: account.regions,
            visible: true,
          });
          setAccounts(accounts.map((account) => account));
        })
      );
  }, []);

  const classes = useStyles();

  function buildAutoCompleteAccountItem(account) {
    return {
      value: account.accountId,
      label: account.accountId,
      id: account.accountId,
      group: account.accountId,
      regions: account.regions,
    };
  }

  function buildAutoCompleteRegionItem(region) {
    return {
      value: region.id,
      label: region.name,
      id: region.id,
      group: region.id,
    };
  }

  function handleRegionImport() {
    setError(null);
    setLoading(true);
    wrapRequest(addRegions, {
      accountId: selectedAccount.id,
      regions: [{ name: selectedRegion.id }],
    })
      .then((response) => {
        handleResponse(response);
        uploadCloudFormationTemplateForRegion().then((template) =>
          setTemplateUrl(template)
        );
        setLoading(false);
      })

      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }

  return (
    <div style={{ width: '50%', margin: '15px' }}>
      <Typography classes={{ root: classes.title }}>Import a Region</Typography>
      <div className={classes.root}>
        <Typography classes={{ root: classes.text }}>
          You can make a new AWS Region discoverable to AWS Perspective by:
        </Typography>
        <ol className={classes.text}>
          <li>Selecting the 12-digit Account Id.</li>
          <li>Selecting the Region.</li>
          <li>Deploy the CloudFormation template.</li>
        </ol>
        <FormAutoComplete
          onSelected={(event, account) => {
            setSelectedAccount(account);
          }}
          label='Account'
          description='Select the AWS Account'
          width='300px'
          margin='15px'
          options={accounts.map((account) =>
            buildAutoCompleteAccountItem(account)
          )}
          multiSelect={false}
        />
        {selectedAccount && (
          <FormAutoComplete
            onSelected={(event, region) => setSelectedRegion(region)}
            label='Region'
            description='Select the Region'
            width='300px'
            margin='15px'
            options={regionMap
              .filter(
                (region) =>
                  findIndex(selectedAccount.regions, { name: region.id }) < 0
              )
              .map((region) => buildAutoCompleteRegionItem(region))}
            multiSelect={false}
            buttonAction={handleRegionImport}
            buttonText={'Import'}
            buttonDisabled={!selectedRegion || loading}
            progress={loading}
          />
        )}
        {templateUrl && (
          <div style={{ display: 'inline' }}>
            <div className={classes.options}>
              <AWSIconButton
                show
                label='Deploy Template'
                newtab={true}
                action={() =>
                  window.open(
                    generateCloudFormationLink(
                      selectedAccount.id,
                      selectedRegion.id,
                      templateUrl,
                      true
                    ),
                    '_blank'
                  )
                }></AWSIconButton>
              <div>
                <AWSIconButton
                  show
                  label='Save Template'
                  download={true}
                  action={async () =>
                    fileDownload(
                      await downloadCloudFormationTemplateForRegion(),
                      'import-region.template'
                    )
                  }></AWSIconButton>
              </div>
            </div>
            <div>
              <Typography classes={{ root: classes.note }}>
                Ensure you are logged into the AWS account you are importing and
                have completed the first item in the{' '}
                <a href='https://docs.aws.amazon.com/solutions/latest/aws-perspective/automated-deployment.html#step-2.-post-deployment-configuration-tasks'>
                  Post-deployment steps
                </a>{' '}
                before clicking <strong>Deploy Template</strong>.
                <br />
                <br />
                Alternatively, You can click <strong>Save Template</strong> to download the AWS
                CloudFormation template and deploy yourself.
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
          retryFunction={handleRegionImport}
        />
      )}
    </div>
  );
};
