// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {getValue} from './ObjectUtils';

export function createTableAriaLabels(
    singular,
    plural,
    {keys, fallback},
    tableLabel
) {
    return {
        allItemsSelectionLabel: ({selectedItems}) => {
            const itemType = selectedItems.length === 1 ? singular : plural;
            return `${selectedItems.length} ${itemType} selected`;
        },
        itemSelectionLabel: ({selectedItems}, item) => {
            const itemValue = getValue(fallback, keys, item.properties ?? item);
            const isItemSelected = selectedItems.filter(
                i => getValue(fallback, keys, i.properties ?? i) === itemValue
            ).length;
            return `${itemValue} is ${isItemSelected ? '' : 'not'} selected`;
        },
        tableLabel,
    };
}
