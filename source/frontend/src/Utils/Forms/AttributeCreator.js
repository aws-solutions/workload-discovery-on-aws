// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import AttributeEditor from '@cloudscape-design/components/attribute-editor';

function getLimit(limit, items) {
  if (limit) {
    if (items.length === limit) {
      return `You have reached the limit of ${limit} item(s)`
    }
    else
      return `You can add up to ${limit} item(s)`
  }
  return undefined
}

export const AttributeCreator = ({
  item,
  items,
  limit,
  itemAdded,
  itemRemoved,
  definition,
}) => {
  return (
    <AttributeEditor
      onAddButtonClick={itemAdded}
      onRemoveButtonClick={({ detail: { itemIndex } }) =>
        itemRemoved(itemIndex)
      }
      items={items}
      definition={definition}
      addButtonText={`Add ${item}`}
      disableAddButton={items.length === limit}
      removeButtonText='Remove'
      additionalInfo={getLimit(limit, items)}
      empty={limit ? `Add upto ${limit} items` : undefined}
    />
  );
};

export default AttributeCreator;
