import React, { useMemo } from 'react';
import AttributeEditor from '@awsui/components-react/attribute-editor';
import Input from '@awsui/components-react/input';

export default ({
  item,
  items,
  limit,
  label,
  placeholder,
  itemAdded,
  itemRemoved,
  setItems,
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
