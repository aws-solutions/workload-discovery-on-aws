// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    Form,
    SpaceBetween,
    FormField,
    Input,
    Button,
    Multiselect,
    Autosuggest,
} from '@cloudscape-design/components';
import {regionMap} from '../../../Utils/Dictionaries/RegionMap';
import {useAccounts} from '../../Hooks/useAccounts';
import * as R from 'ramda';

const isAccountIdValid = accountId => R.equals(12, R.length(accountId));
const isAccountNameValid = accountName =>
    R.and(R.gt(R.length(accountName), 0), R.lte(R.length(accountName), 64));
const areRegionsValid = regions => !R.isEmpty(regions);

const RegionForm = ({onChange}) => {
    const [selectedRegions, setSelectedRegions] = React.useState([]);
    const [accountId, setAccountId] = React.useState();
    const [accountName, setAccountName] = React.useState('');
    const [showValidationError, setShowValidationError] = React.useState(false);
    const {data: importedAccounts = [], status} = useAccounts();
    const importedRegions = R.reduce(
        (acc, e) =>
            R.concat(
                acc,
                R.chain(region => {
                    return {
                        accountId: e.accountId,
                        accountName: e.name,
                        region: region.name,
                    };
                }, e.regions)
            ),
        [],
        importedAccounts
    );

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
        onChange(
            R.map(
                region => buildRegion(accountId, accountName, region.region),
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
            region: region,
        };
    };

    const updateForm = account => {
        setAccountId(account.accountId);
        setAccountName(account.accountName);
    };

    const resetForm = id => {
        setAccountId(id);
        setAccountName();
    };

    const lookupAccount = id => {
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
                <SpaceBetween direction="horizontal" size="xs">
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (validateInputs()) handleClick();
                        }}
                    >
                        Add
                    </Button>
                </SpaceBetween>
            }
        >
            <SpaceBetween direction="horizontal" size="l">
                <FormField
                    label="Account Id"
                    description="The 12-digit AWS Account Id"
                    errorText={
                        R.and(showValidationError, !isAccountIdValid(accountId))
                            ? 'Account Id should be 12-digits'
                            : undefined
                    }
                >
                    <Autosuggest
                        onChange={({detail}) => lookupAccount(detail.value)}
                        value={R.isNil(accountId) ? '' : accountId}
                        status={status}
                        options={R.uniq(
                            R.map(account => {
                                return {value: account.accountId};
                            }, importedAccounts)
                        )}
                        enteredTextLabel={value =>
                            `Add new account: "${value}"`
                        }
                        ariaLabel="Enter a 12-digit AWS Account Id"
                        placeholder="Enter an Account Id"
                        empty="No Accounts found"
                    />
                </FormField>
                <FormField
                    label="Account name"
                    description="A friendly name to associate with this Account."
                    errorText={
                        R.and(
                            showValidationError,
                            !isAccountNameValid(accountName)
                        )
                            ? 'Account name should be provided and have fewer than 64 characters'
                            : undefined
                    }
                >
                    <Input
                        invalid={R.and(
                            showValidationError,
                            !isAccountNameValid(accountName)
                        )}
                        value={accountName}
                        placeholder="Enter a name"
                        onChange={({detail}) => setAccountName(detail.value)}
                    />
                </FormField>
                <FormField
                    description="Select the Regions to make discoverable."
                    label="Regions"
                    errorText={
                        R.and(
                            showValidationError,
                            !areRegionsValid(selectedRegions)
                        )
                            ? 'You need to select at least one Region'
                            : undefined
                    }
                >
                    <Multiselect
                        filteringType="auto"
                        tokenLimit={2}
                        selectedOptions={selectedRegions}
                        onChange={({detail}) =>
                            setSelectedRegions(detail.selectedOptions)
                        }
                        deselectAriaLabel={e => 'Remove ' + e.label}
                        options={regionMap
                            .filter(i => i.id !== 'global')
                            .map(region => {
                                return {
                                    label: region.name,
                                    id: region.id,
                                    region: region.id,
                                    value: region.name,
                                };
                            })}
                        placeholder="Select Regions"
                        selectedAriaLabel="Selected"
                    />
                </FormField>
            </SpaceBetween>
        </Form>
    );
};

export default RegionForm;
