// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    Alert,
    Box,
    Button,
    ColumnLayout,
    Container,
    Header,
    Link,
    SpaceBetween,
    Spinner,
    TextContent,
} from '@cloudscape-design/components';
import * as R from 'ramda';
import {
    useResourcesAccountMetadata,
    useResourcesMetadata,
    useResourcesRegionMetadata,
} from '../../Hooks/useResourcesMetadata';
import {useAccounts} from '../../Hooks/useAccounts';
import ValueWithLabel from '../../Shared/ValueWithLabel';
import {
    getAppInsightsDashboardLink,
    isUsingOrganizations,
} from '../../../Utils/AccountUtils';

const ResourceOverview = () => {
    const {data: resources = {accounts: []}, isLoading: loadingResources} =
        useResourcesMetadata();
    const accountsFilter = resources.accounts.map(({accountId}) => ({
        accountId,
    }));

    const {data: importedAccounts, isLoading: isLoadingImportedAccounts} =
        useAccounts();
    const {data: accounts = [], isLoading: loadingAccounts} =
        useResourcesAccountMetadata(accountsFilter, {batchSize: 50});
    const {data: regions = [], isLoading: loadingRegions} =
        useResourcesRegionMetadata(accountsFilter, {batchSize: 50});

    const regionCount = R.reduce(
        (acc, val) => R.add(acc, R.length(val.regions)),
        0,
        regions
    );

    return (
        <Container
            data-testid="resources-metadata-overview"
            header={<Header>Overview</Header>}
        >
            {loadingAccounts || loadingRegions || loadingResources ? (
                <Spinner />
            ) : (
                <SpaceBetween size="m">
                    <ColumnLayout columns={4} variant="text-grid">
                        <ValueWithLabel label="Resources discovered">
                            <Box tagOverride={'p'} variant={'h1'}>
                                {resources.count ?? '-'}
                            </Box>
                        </ValueWithLabel>
                        <ValueWithLabel label="Resources types">
                            <Box tagOverride={'p'} variant={'h1'}>
                                {resources.resourceTypes?.length ?? '-'}
                            </Box>
                        </ValueWithLabel>
                        <ValueWithLabel label="Accounts">
                            <Box tagOverride={'p'} variant={'h1'}>
                                {R.length(accounts)}
                            </Box>
                        </ValueWithLabel>
                        <ValueWithLabel label="Regions">
                            <Box tagOverride={'p'} variant={'h1'}>
                                {regionCount}
                            </Box>
                        </ValueWithLabel>
                    </ColumnLayout>
                    {!isLoadingImportedAccounts &&
                        getWarningBanner(resources, importedAccounts)}
                </SpaceBetween>
            )}
        </Container>
    );
};

const getWarningBanner = (resources, importedAccounts) => {
    if (!isUsingOrganizations() && importedAccounts.length === 0) {
        return (
            <Alert
                header="No accounts imported"
                statusIconAriaLabel="Warning"
                type="warning"
                action={
                    <Button href="/accounts" variant="external-link">
                        Import an account
                    </Button>
                }
            >
                <TextContent>
                    Import an account to discover resources in that account.
                </TextContent>
                <Link
                    variant="secondary"
                    external
                    href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/import-a-region.html"
                >
                    Learn more about importing accounts
                </Link>
            </Alert>
        );
    }

    if (importedAccounts.some(({isIamRoleDeployed}) => !isIamRoleDeployed)) {
        return (
            <Alert
                header="Missing IAM Role(s)"
                statusIconAriaLabel="Warning"
                type="warning"
                action={
                    <Button href="/accounts" variant="external-link">
                        View account configuration
                    </Button>
                }
            >
                {!isUsingOrganizations() ? (
                    <TextContent>
                        At least one account is missing the Workload Discovery
                        IAM Role. Visit the Accounts page to see what accounts
                        are affected and verify that the AWS CloudFormation
                        StackSets stack instance in these accounts deployed
                        correctly.
                    </TextContent>
                ) : (
                    <TextContent>
                        At least one account is missing the Workload Discovery
                        IAM Role. Visit the Accounts page to see what accounts
                        are affected and deploy the global resources template in
                        those accounts
                    </TextContent>
                )}
                <Link
                    external
                    href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/import-a-region.html"
                >
                    Learn more about importing accounts
                </Link>
            </Alert>
        );
    }

    if (
        resources.count === 0 &&
        (importedAccounts.length > 0 || isUsingOrganizations())
    ) {
        return (
            <Alert
                header="No resources discovered"
                statusIconAriaLabel="Error"
                type="error"
            >
                <TextContent>
                    The resource discovery process was unable to locate any
                    resources. This may be due to an issue with the deployment
                    configuration.
                </TextContent>
                <br />
                <TextContent>Recommended actions:</TextContent>
                <ol>
                    <li>
                        <Link external href={getAppInsightsDashboardLink()}>
                            View the Application Insights dashboard for detailed
                            error information
                        </Link>
                    </li>
                    <li>
                        <Link
                            external
                            href="https://docs.aws.amazon.com/solutions/latest/workload-discovery-on-aws/troubleshooting.html#resources-not-discovered-after-account-imported"
                        >
                            Review the troubleshooting section of the
                            implementation guide
                        </Link>
                    </li>
                    <li>
                        <Link
                            external
                            href="https://aws-solutions.github.io/workload-discovery-on-aws/workload-discovery-on-aws/2.0/debugging-the-discovery-component.html"
                        >
                            Review the discovery process debugging guide
                        </Link>
                    </li>
                </ol>
            </Alert>
        );
    }

    return null;
};

export default ResourceOverview;
