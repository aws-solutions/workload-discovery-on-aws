// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, {useEffect} from 'react';
import {
    ColumnLayout,
    Container,
    Form,
    Header,
    SpaceBetween,
} from '@cloudscape-design/components';
import Breadcrumbs from '../../../../Utils/Breadcrumbs';
import {CREATE_VIEW, EDIT_VIEW, VIEW, VIEWS} from '../../../../routes';
import ViewOverview from '../Shared/ViewOverview';
import {useHistory, useParams} from 'react-router-dom';
import ViewFormDetailsSection from './ViewFormDetailsSection';
import {
    privateLevel,
    useObject,
    usePutObject,
    viewsPrefix,
} from '../../../Hooks/useS3Objects';
import * as R from 'ramda';
import AccountMultiSelect from '../../Resources/Types/TypeOverview/AccountMultiSelect';
import RegionMultiSelect from '../../Resources/Types/TypeOverview/RegionMultiSelect';
import ResourcesTypes from '../../Resources/Types/TypeOverview/ResourcesTypes';

const ViewFormPage = () => {
    const [selectedResourceTypes, setSelectedResourceTypes] = React.useState(
        []
    );
    const {name} = useParams();
    const isEdit = !R.isNil(name);
    const {data: selectedView} = useObject(name, viewsPrefix, privateLevel, {
        enabled: isEdit,
    });
    const [selectedAccounts, setSelectedAccounts] = React.useState([]);
    const [selectedRegions, setSelectedRegions] = React.useState([]);
    const {putAsync} = usePutObject(viewsPrefix);
    const history = useHistory();

    useEffect(() => {
        if (selectedView) {
            setSelectedAccounts(
                R.pluck('accountId', R.pathOr([], ['accounts'], selectedView))
            );
            const viewRegions = R.compose(
                R.pluck('name'),
                R.chain(x => x.regions ?? []),
                R.propOr([], ['accounts'])
            );
            setSelectedRegions(viewRegions(selectedView));
        }
    }, [selectedView]);

    const regionsToQueryParam =
        selectedRegions.length > 0
            ? {regions: R.uniq(R.map(i => ({name: i}), selectedRegions))}
            : {};

    const onSubmit = viewName => {
        putAsync({
            key: viewName,
            level: privateLevel,
            type: 'application/json',
            content: JSON.stringify({
                accounts: R.map(e => {
                    return {
                        accountId: e,
                        ...(selectedRegions.length > 0
                            ? {
                                  regions: R.map(e => {
                                      return {name: e};
                                  }, selectedRegions),
                              }
                            : {}),
                    };
                }, selectedAccounts),
                resourceTypes: R.map(e => {
                    return {type: e.type};
                }, selectedResourceTypes),
            }),
        }).then(() => history.push(VIEW.replace(':name', viewName)));
    };

    return (
        <SpaceBetween size="l">
            <Breadcrumbs
                items={[
                    {text: 'Views', href: VIEWS},
                    isEdit
                        ? {text: 'Edit', href: EDIT_VIEW}
                        : {text: 'Create', href: CREATE_VIEW},
                ]}
            />
            <Header variant="h1">{isEdit ? name : 'Create View'}</Header>
            <Form>
                <ColumnLayout columns={1}>
                    <Container
                        header={
                            <Header variant={'h2'}>Resource Filters</Header>
                        }
                    >
                        <SpaceBetween size={'s'}>
                            <AccountMultiSelect
                                selected={selectedAccounts}
                                onChange={setSelectedAccounts}
                            />
                            <RegionMultiSelect
                                accounts={selectedAccounts}
                                selected={selectedRegions}
                                onChange={setSelectedRegions}
                                disabled={selectedAccounts.length === 0}
                            />
                        </SpaceBetween>
                    </Container>
                    <ResourcesTypes
                        accounts={selectedAccounts.map(i => ({
                            accountId: i,
                            ...regionsToQueryParam,
                        }))}
                        onSelection={setSelectedResourceTypes}
                    />
                    <ViewOverview
                        accounts={selectedAccounts}
                        regions={selectedRegions}
                        resourceTypes={selectedResourceTypes}
                    />
                    <ViewFormDetailsSection
                        view={{
                            name: name,
                            selectedAccounts: selectedAccounts,
                            selectedRegions: selectedRegions,
                            selectedResourceTypes: selectedResourceTypes,
                        }}
                        onSubmit={onSubmit}
                    />
                </ColumnLayout>
            </Form>
        </SpaceBetween>
    );
};

export default ViewFormPage;
