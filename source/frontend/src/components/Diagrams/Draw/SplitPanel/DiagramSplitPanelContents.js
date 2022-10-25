import React, {useEffect} from 'react';
import { ColumnLayout } from '@awsui/components-react';
import ResourcesTable from './ResourcesTable';
import ResourceDetails from './ResourceDetails';
import { useDiagramSettingsState } from '../../../Contexts/DiagramSettingsContext';
import * as R  from 'ramda';
const DiagramSplitPanelContents = () => {
  const [{ selectedResources }] = useDiagramSettingsState();
  const [selectedResource, setSelectedResource] = React.useState([]);
  const [processedResources, setProcessedResources] = React.useState([]);

  useEffect(() => {
    const getResources = () =>
      R.uniq(
        R.filter(
          (n) =>
            R.equals(n.group(), 'nodes') && R.equals(n.data('type'), 'resource'),
          R.chain(
            (r) => (r.isParent() ? r.descendants() : r),
            selectedResources ?? []
          )
        )
      );

    setProcessedResources(
      R.map((e) => {
        return {
          id: e.data('id'),
          name: e.data('title'),
          data: e.data(),
        };
      }, getResources())
    );
  }, [selectedResources]);

  useEffect(() => {
    setSelectedResource([]);
  }, [selectedResources]);

  return (
    <ColumnLayout columns={2}>
      <ResourcesTable
        resources={processedResources}
        selectedResource={selectedResource}
        setSelectedResource={setSelectedResource}
      />
      {!R.isEmpty(selectedResource) && (
        <ResourceDetails selectedResource={R.head(selectedResource)} />
      )}
    </ColumnLayout>
  );
};

export default DiagramSplitPanelContents;
