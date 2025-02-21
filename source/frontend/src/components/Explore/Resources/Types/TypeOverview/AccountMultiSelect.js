// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {Button, FormField, Multiselect} from '@cloudscape-design/components';
import * as R from 'ramda';
import {
    useResourcesMetadata,
    useResourcesRegionMetadata,
} from '../../../../Hooks/useResourcesMetadata';
import {useDeepCompareEffect} from 'react-use';
import {useAccounts} from '../../../../Hooks/useAccounts';

const AccountMultiSelect = ({
    selected = [],
    onChange = () => ({}),
    onOptionsChange = () => ({}),
    disabled = false,
}) => {
    const {data: accounts = []} = useAccounts();

    const accountsFilter = accounts.map(({accountId}) => ({
        accountId,
    }));

    const accountNameToIdMap = new Map(accounts.map(x => [x.accountId, x.name]));

    const {data: accountsRegionMetadata = []} = useResourcesRegionMetadata(
        accountsFilter,
        {
            batchSize: 50,
        }
    );

    useDeepCompareEffect(() => {
        onOptionsChange(accountsRegionMetadata.map(i => i.accountId));
    }, [accountsRegionMetadata, onOptionsChange]);

    const options = accountsRegionMetadata.map((i, index) => {
        const name = accountNameToIdMap.get(i.accountId );

        return {
            label: name == null ? i.accountId : `${name} (${i.accountId})`,
            value: i.accountId,
            tags: [`${R.length(i.regions)} regions`, `${i.count} resources`],
        }
    });

    const handleSelectAll = () => {
        onChange(R.uniq(R.map(i => i.value, options)));
    };

    return (
        <>
            <FormField
                label={'Accounts'}
                secondaryControl={
                    <Button onClick={handleSelectAll}>Choose All</Button>
                }
            >
                <Multiselect
                    filteringType="auto"
                    disabled={disabled}
                    options={options}
                    selectedOptions={options.filter(
                        i => selected.indexOf(i.value) !== -1
                    )}
                    onChange={e =>
                        onChange(e.detail.selectedOptions.map(i => i.value))
                    }
                    placeholder="Choose accounts to filter by"
                    tokenLimit={5}
                    i18nStrings={{
                        tokenLimitShowMore: 'Show more chosen options',
                        tokenLimitShowFewer: 'Show fewer chosen options',
                    }}
                />
            </FormField>
        </>
    );
};

export default AccountMultiSelect;
