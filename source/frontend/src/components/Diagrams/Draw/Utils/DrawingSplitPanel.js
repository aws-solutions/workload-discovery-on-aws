import React from 'react';
import { SplitPanel } from '@awsui/components-react';
import DiagramSplitPanelContents from '../SplitPanel/DiagramSplitPanelContents';
import { useDiagramSettingsState } from '../../../Contexts/DiagramSettingsContext';

import * as R  from 'ramda';

const DrawingSplitPanel = () => {
  const [{ selectedResources }] = useDiagramSettingsState();

  const getDetailsPanel = () => {
    return {
      header: `Selected resources (${R.length(
        R.uniq(
          R.filter(
            (n) =>
              R.equals(n.group(), 'nodes') &&
              R.equals(n.data('type'), 'resource'),
            R.chain(
              (r) => r.isParent() ? r.descendants() : r,
              selectedResources ?? []
            )
          )
        )
      )})`,
      body: <DiagramSplitPanelContents />,
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

export default DrawingSplitPanel;
