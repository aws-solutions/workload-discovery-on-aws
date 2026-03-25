// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    Box,
    Button,
    Container,
    ContentLayout,
    Grid,
    Header,
    SpaceBetween,
} from '@cloudscape-design/components';
import * as appProblemAlerts from '../Errors/DeploymentHealthcheck/Alerts';
import * as R from 'ramda';
import {useGetApplicationProblems} from '../Hooks/useGetApplicationProblems';
import {isUsingOrganizations, isUsingSSO} from '../../Utils/AccountUtils';
import {CREATE_DIAGRAM, IMPORT as IMPORT_ROUTE, RESOURCES} from '../../routes';

function renderAlerts(problems) {
    const alerts = problems.map(problem => {
        const AlertComponent =
            appProblemAlerts[`${problem.name}Alert`] ??
            appProblemAlerts.GenericErrorAlert;

        return <AlertComponent key={problem.name} {...problem} />;
    });

    return <SpaceBetween size="s">{alerts}</SpaceBetween>;
}

const Homepage = () => {
    const {data: appProblems = {}} = useGetApplicationProblems();
    const hasProblems = !R.isEmpty(appProblems.logProblems ?? []);

    const items = [
        {
            header: 'Import Accounts',
            body: 'Import regions for one or more AWS accounts',
            link: IMPORT_ROUTE,
            isHiddenInOrgMode: true,
        },
        {
            header: 'Add Users',
            body: 'Create users in Cognito to grant access to the application',
            isHiddenWhenUsingSSO: true,
        },
        {
            header: 'Create diagram',
            body: 'Create a diagram to visualise resources',
            link: CREATE_DIAGRAM,
        },
        {
            header: 'Search resources',
            body: 'Search for discovered resources in imported accounts',
            link: RESOURCES,
        },
    ];

    const homepageItems = items.filter(
        ({isHiddenInOrgMode, isHiddenWhenUsingSSO}) => {
            if (isHiddenInOrgMode && isUsingOrganizations()) return false;

            if (isHiddenWhenUsingSSO && isUsingSSO()) return false;

            return true;
        }
    );

    // Create grid definition
    const gridDefinition = [
        // Add a single full-width row for alerts if they exist
        ...(hasProblems ? [{colspan: 12}] : []),
        // Add a 3-column row for each item
        ...homepageItems.map(() => ({colspan: {default: 6}})),
    ];

    return (
        <ContentLayout
            defaultPadding
            disableOverlap
            headerVariant="high-contrast"
            maxContentWidth={1000}
            header={
                <>
                    <Box
                        variant="h1"
                        fontWeight="heavy"
                        padding={{top: 'xs'}}
                        fontSize="display-l"
                    >
                        Workload Discovery on AWS
                    </Box>
                    <Box
                        fontWeight="light"
                        padding={{bottom: 's'}}
                        fontSize="display-l"
                    >
                        Explore your AWS Workloads
                    </Box>
                    <Box variant="p" fontWeight="light">
                        Build, customize, and share detailed architecture
                        diagrams of your workloads based on live data from AWS.
                    </Box>
                </>
            }
        >
            <Box padding={{top: 'xxxl', horizontal: ''}}>
                <Grid gridDefinition={gridDefinition}>
                    {hasProblems && (
                        <Box padding={{bottom: 'l'}}>
                            {renderAlerts(appProblems.logProblems)}
                        </Box>
                    )}
                    {homepageItems.map(({header, body, link}) => (
                        <Item
                            key={header}
                            header={header}
                            body={body}
                            link={link}
                        />
                    ))}
                </Grid>
            </Box>
        </ContentLayout>
    );
};

const Item = ({header, body, link}) => (
    <Container
        header={
            <Header
                actions={
                    link ? (
                        <Button href={link} variant="primary">
                            {header}
                        </Button>
                    ) : null
                }
                description={body}
            >
                {header}
            </Header>
        }
    ></Container>
);

export default Homepage;
