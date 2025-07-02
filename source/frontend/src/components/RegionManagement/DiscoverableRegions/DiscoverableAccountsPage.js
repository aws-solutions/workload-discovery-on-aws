// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect, useState} from 'react';
import {Alert, Button, Link, SpaceBetween} from '@cloudscape-design/components';
import DiscoverableRegionsTable from './DiscoverableRegionsTable';
import Breadcrumbs from '../../../Utils/Breadcrumbs';
import {ACCOUNTS} from '../../../routes';
import DiscoverableAccountsTable from './DiscoverableAccountsTable';
import * as R from 'ramda';
import {useAccounts} from '../../Hooks/useAccounts';
import {isUsingOrganizations} from '../../../Utils/AccountUtils';
import {
    GLOBAL_TEMPLATE,
    REGIONAL_TEMPLATE,
    useTemplate,
} from '../../Hooks/useTemplate';
import fileDownload from 'js-file-download';
import {GLOBAL_RESOURCES_TEMPLATE_FILENAME} from '../../../config/constants';

function DownloadButton({template, children}) {
    return (
        <Button
            iconName="download"
            onClick={async () =>
                fileDownload(template, GLOBAL_RESOURCES_TEMPLATE_FILENAME)
            }
        >
            {children}
        </Button>
    );
}

function SelfManagedAccountsAlert({globalTemplate}) {
    return (
        <Alert
            type="warning"
            statusIconAriaLabel="IAM role warning alert"
            action={
                <DownloadButton template={globalTemplate}>
                    Download global resources template
                </DownloadButton>
            }
            header="Undiscovered Accounts"
        >
            The global resources CloudFormation templates have not been deployed
            to one or more accounts. You must provision this template in these
            accounts to make them discoverable by Workload Discovery. You can
            filter the account list by selecting <b>Not Deployed</b> from the
            Role Status dropdown menu to determine which accounts must be
            updated. Choose <b>Download global resources template</b> and deploy
            the template in each of the affected accounts.
        </Alert>
    );
}

function OrganizationsManagedAccounts({globalTemplate, accounts}) {
    const managementAccount = accounts.find(
        x => x.isManagementAccount === true
    );
    const noIamDeployedAccounts = accounts.filter(
        x => x.isIamRoleDeployed === false && !x.isManagementAccount
    );

    return (
        <SpaceBetween size="xxs">
            {R.isEmpty(noIamDeployedAccounts) ? (
                void 0
            ) : (
                <Alert
                    type="warning"
                    statusIconAriaLabel="Warning"
                    header="Undiscovered Accounts"
                >
                    The global resources CloudFormation templates have not been
                    deployed to one or more accounts. These are provisioned by
                    the <b>WdGlobalResources</b> StackSet in the account and
                    region that Workload Discovery has been deployed to. Verify
                    that all the stack instances in the <b>WdGlobalResources</b>{' '}
                    StackSet have deployed successfully.
                </Alert>
            )}
            {managementAccount == null ||
            managementAccount.isIamRoleDeployed === true ? (
                void 0
            ) : (
                <Alert
                    type="warning"
                    statusIconAriaLabel="Warning"
                    action={
                        <DownloadButton template={globalTemplate}>
                            Download global resources template
                        </DownloadButton>
                    }
                    header="Management Account Undiscovered"
                >
                    The global resources CloudFormation template has not been
                    deployed to the AWS Organizations management account. You
                    must provision this template to make this account
                    discoverable by Workload Discovery. Choose{' '}
                    <b>Download global resources template</b> and deploy the
                    template to the management account.
                </Alert>
            )}
        </SpaceBetween>
    );
}

function ConfigEnabledAlert({regionalTemplate}) {
    return (
        <Alert
            type="error"
            statusIconAriaLabel="Config enabled error alert"
            action={
                <DownloadButton template={regionalTemplate}>
                    Download regional resources template
                </DownloadButton>
            }
            header="Undiscovered Regions"
        >
            The regional resources CloudFormation template has not been deployed
            to one or more regions. You must provision this template in every
            imported region to make them discoverable by Workload Discovery.
            Choose <b>Download regional resources template</b> and deploy the
            template in each of the affected regions. For more information on
            how to deploy the template, see the{' '}
            <Link
                external
                href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/import-a-region.html"
            >
                Import a Region
            </Link>{' '}
            documentation.
        </Alert>
    );
}

function IamRoleAlert({globalTemplate, accounts}) {
    return isUsingOrganizations() ? (
        <OrganizationsManagedAccounts
            globalTemplate={globalTemplate}
            accounts={accounts}
        />
    ) : (
        <SelfManagedAccountsAlert globalTemplate={globalTemplate} />
    );
}

const DiscoverableAccountsPage = () => {
    const [selectedAccounts, setSelectedAccounts] = React.useState([]);
    const [hasAccountsMissingRole, setHasAccountsMissingRole] = useState(false);
    const [hasRegionsWithoutConfig, setHasRegionsWithoutConfig] =
        useState(false);
    const [accountsWithCount, setAccountsWithCount] = useState([]);
    const {data: accounts = [], isLoading: isLoadingAccounts} = useAccounts();
    const {data: globalTemplate} = useTemplate(GLOBAL_TEMPLATE);
    const {data: regionalTemplate} = useTemplate(REGIONAL_TEMPLATE);

    useEffect(() => {
        setHasAccountsMissingRole(
            accounts.some(x => x.isIamRoleDeployed === false)
        );

        setHasRegionsWithoutConfig(
            accounts.some(account => {
                for (const region of account.regions) {
                    if (region.isConfigEnabled === false) {
                        return true;
                    }
                }
            })
        );

        setAccountsWithCount(
            R.map(
                ({accountId, name, regions, ...props}) => ({
                    id: accountId + name,
                    accountId,
                    name,
                    regionCount: R.length(regions),
                    regions,
                    ...props,
                }),
                accounts
            )
        );
    }, [accounts]);

    return (
        <SpaceBetween size="l">
            <Breadcrumbs items={[{text: 'Accounts', href: ACCOUNTS}]} />
            <SpaceBetween size="l">
                {hasAccountsMissingRole && (
                    <IamRoleAlert
                        globalTemplate={globalTemplate}
                        accounts={accountsWithCount}
                    />
                )}
                {!isUsingOrganizations() && hasRegionsWithoutConfig && (
                    <ConfigEnabledAlert regionalTemplate={regionalTemplate} />
                )}
                <DiscoverableAccountsTable
                    accounts={accountsWithCount}
                    isLoadingAccounts={isLoadingAccounts}
                    selectedAccounts={selectedAccounts}
                    onSelect={setSelectedAccounts}
                />
                {!R.isEmpty(selectedAccounts) && (
                    <DiscoverableRegionsTable
                        accounts={accounts}
                        selectedAccounts={selectedAccounts}
                    />
                )}
            </SpaceBetween>
        </SpaceBetween>
    );
};

export default DiscoverableAccountsPage;
