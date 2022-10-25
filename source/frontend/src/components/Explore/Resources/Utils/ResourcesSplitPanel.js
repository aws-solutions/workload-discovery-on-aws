import React from 'react';
import { SplitPanel } from '@awsui/components-react';
import ResourceDetailsPanel from './ResourceDetailsPanel';
import { useResourceState } from '../../../Contexts/ResourceContext';
import MultipleResourceDetailsPanel from './MultipleResourceDetailsPanel';

import * as R  from 'ramda';

const ResourcesSplitPanel = () => {
  const [{ resources }] = useResourceState({});

   const getDetailsPanel = () => {
    if (R.gt(R.length(resources), 1))
      return {
        header: `${resources.length} resources selected`,
        body: <MultipleResourceDetailsPanel resources={resources} />,
      };
    else if (R.isEmpty(resources))
      return {
        header: 'Select a resource',
        body: 'Select a resource to see its details.',
      };
    else
      return {
        header: R.head(resources).properties.title,
        body: <ResourceDetailsPanel resource={R.head(resources)} />,
      };
  };

  const { header: panelHeader, body: panelBody } = getDetailsPanel();

  return (
    <SplitPanel
      header={panelHeader}
      hidePreferencesButton
      i18nStrings={{
        preferencesTitle: 'Split panel preferences',
        preferencesPositionLabel: 'Split panel position',
        preferencesPositionDescription:
          'Choose the default split panel position for the service.',
        preferencesPositionSide: 'Side',
        preferencesPositionBottom: 'Bottom',
        preferencesConfirm: 'Confirm',
        preferencesCancel: 'Cancel',
        closeButtonAriaLabel: 'Close panel',
        openButtonAriaLabel: 'Open panel',
        resizeHandleAriaLabel: 'Resize split panel',
      }}>
      {panelBody}
    </SplitPanel>
  );
};

export default ResourcesSplitPanel;
