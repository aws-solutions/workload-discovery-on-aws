import React from 'react';
import { Wizard } from '@awsui/components-react';

import {
  addAccounts,
  getAccounts,
  handleResponse,
  wrapRequest,
} from '../../../../../../API/Handlers/SettingsGraphQLHandler';
import AccountImportBody from './AccountImportStackSetsBody';
import AccountImportDownload from './AccountImportStackSetsDownload';
import AccountImportDeploy from './AccountImportStackSetsDeploy';
import AccountImportReview from './AccountImportStackSetsReview';
import { useResourceState } from '../../../../../Contexts/ResourceContext';
import PropTypes from 'prop-types';
import { filterOnAccountAndRegion } from '../../../../../Actions/ResourceActions';
import { uploadObject } from '../../../../../../API/Storage/S3Store';
import { useGraphState } from '../../../../../Contexts/GraphContext';

const R = require('ramda');

const AccountImportStackSetsWizard = ({ reloadTable }) => {
  const [{ filters }, dispatch] = useResourceState();
  const [{ graphFilters }, updateFilters] = useGraphState();

  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [regions, setRegions] = React.useState([]);
  const [importedRegions, setImportedRegions] = React.useState([]);
  const [error, setError] = React.useState();

  const byAccount = R.groupBy((e) => e.accountId);

  React.useEffect(() => {
    wrapRequest(getAccounts)
      .then(handleResponse)
      .then(R.pathOr([], ['body', 'data', 'getAccounts']))
      .then(
        R.reduce(
          (acc, e) =>
            R.concat(
              acc,
              R.chain((region) => {
                return {
                  accountId: e.accountId,
                  accountName: e.name,
                  name: region.name,
                };
              }, e.regions)
            ),
          []
        )
      )
      .then(setImportedRegions)
      .catch(setError);
  }, []);

  const buildFilters = () => {
    let filterList = [];

    R.forEach((region) => {
      filterList.push({
        accountId: region.accountId,
        id: `${region.accountId} :: global`,
        region: 'global',
      });

      filterList.push({
        accountId: region.accountId,
        id: `${region.accountId} :: ${region.name}`,
        region: region.name,
      });
    }, regions);
    return R.uniq(R.concat(filterList, filters));
  };

  const isMatch = (node) =>
    !R.includes(node.resourceType, graphFilters.typeFilters);

  const removeFilteredNodes = (resources) =>
    Promise.resolve(R.pathOr([], ['body'], resources)).then((e) => {
      dispatch({
        type: 'updateResources',
        resources: {
          nodes: R.filter((e) => isMatch(e), e.nodes),
          metaData: e.metaData,
        },
      });
    });

  const applyFilters = () => {
    const filtersToApply = buildFilters();

    Promise.resolve(filterOnAccountAndRegion(filtersToApply))
      .then(handleResponse)
      .then(removeFilteredNodes)
      .then(
        uploadObject(
          'filters/accounts/filters',
          JSON.stringify(filtersToApply),
          'private',
          'application/json'
        )
          .then(
            dispatch({
              type: 'updateAccountOrRegionFilters',
              filters: filtersToApply,
            })
          )
          .then(setError())
          .catch(setError)
      )
      .then(setError())
      .catch(setError);
  };

  const importAccounts = async () => {
    const accounts = byAccount(regions);

    Promise.resolve(
      R.reduce(
        (acc, val) => {
          acc.push({
            accountId: R.head(accounts[val]).accountId,
            name: R.head(accounts[val]).accountName,
            regions: R.map((region) => {
              return { name: region.name };
            }, accounts[val]),
          });
          return acc;
        },
        [],
        R.keys(accounts)
      )
    )
      .then((e) =>
        wrapRequest(addAccounts, {
          accounts: e,
        })
          .then((response) => {
            handleResponse(response);
            applyFilters();
            reloadTable();
            setRegions([]);
            setError();
          })
          .catch((err) => {
            setError(err);
          })
      )
      .catch((err) => console.error(err));
  };

  const regionExists = (region) =>
    R.gte(
      R.findIndex(
        R.both(
          R.propEq('name', region.name),
          R.propEq('accountId', region.accountId)
        )
      )(importedRegions),
      0
    );

  return (
    <Wizard
      i18nStrings={{
        stepNumberLabel: (stepNumber) => `Step ${stepNumber}`,
        collapsedStepsLabel: (stepNumber, stepsCount) =>
          `Step ${stepNumber} of ${stepsCount}`,
        previousButton: 'Previous',
        nextButton: 'Next',
        submitButton: 'Import',
        optional: 'optional',
      }}
      onSubmit={importAccounts}
      onNavigate={({ detail }) => setActiveStepIndex(detail.requestedStepIndex)}
      activeStepIndex={activeStepIndex}
      steps={[
        {
          title: 'Provide AWS Regions',
          description:
            'Tell us the AWS Regions to make discoverable to AWS Perspective.',
          content: (
            <AccountImportBody
              regions={regions}
              setRegions={setRegions}
              importedRegions={importedRegions}
            />
          ),
        },
        {
          title: 'Download AWS CloudFormation templates',
          description:
            'Download the AWS CloudFormation templates required to complete the import process.',
          content: <AccountImportDownload />,
        },
        {
          title: 'Configure AWS CloudFormation StackSets',
          description:
            'Configure AWS CloudFormation StackSets to set up the infrastructure to allow AWS Perspective to discover resources in the AWS Regions shown below.',
          content: (
            <AccountImportDeploy
              regions={R.filter((region) => !regionExists(region), regions)}
            />
          ),
        },
        {
          title: 'Review and import',
          description: `Almost done! Now click Import to complete the process`,
          content: (
            <AccountImportReview
              regions={R.filter((region) => !regionExists(region), regions)}
              error={error}
            />
          ),
        },
      ]}
    />
  );
};

AccountImportStackSetsWizard.propTypes = {
  reloadTable: PropTypes.func.isRequired,
};

export default AccountImportStackSetsWizard;
