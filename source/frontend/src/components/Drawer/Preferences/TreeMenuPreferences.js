import React from 'react';
import TreeMenuFilterMenu from './PreferenceManager/Filters/TreeMenuFilterMenu';
import { ExpandableSection } from '@awsui/components-react';
import { useGraphState } from '../../Contexts/GraphContext';
import { useResourceState } from '../../Contexts/ResourceContext';

export default () => {
  const [{ filters }] = useResourceState();
  const [{ graphFilters }] = useGraphState();

  const getFilterCount = () => {
    return filters.length + graphFilters.typeFilters.length;
  };
  return (
    <ExpandableSection
      defaultExpanded={getFilterCount() > 0}
      className='first-level'
      variant='navigation'
      header='Preferences'>
      <TreeMenuFilterMenu />
    </ExpandableSection>
  );
};
