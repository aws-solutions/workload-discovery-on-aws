// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import AttributeEditor from '@awsui/components-react/attribute-editor';

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
      additionalInfo={
        limit
          ? items.length === limit
            ? `You have reached the limit of ${limit} item(s)`
            : `You can add up to ${limit} item(s)`
          : undefined
      }
      empty={limit ? `Add upto ${limit} items` : undefined}
    />
  );
};

export default AttributeCreator;
