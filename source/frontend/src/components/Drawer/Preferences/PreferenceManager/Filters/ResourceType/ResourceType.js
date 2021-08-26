import React from 'react';
import Toggle from '@awsui/components-react/toggle';

import { fetchImage } from '../../../../../../Utils/ImageSelector';

import { useGraphState } from '../../../../../Contexts/GraphContext';
import { useResourceState } from '../../../../../Contexts/ResourceContext';
import ResourceTypeTable from './ResourceTypeTable';
import { uploadObject } from '../../../../../../API/Storage/S3Store';
import { filterOnAccountAndRegion } from '../../../../../Actions/ResourceActions';
import Flashbar from '../../../../../../Utils/Flashbar/Flashbar';
import { handleResponse } from '../../../../../../API/Handlers/SettingsGraphQLHandler';
import { Grid, HelpPanel } from '@awsui/components-react';
const R = require('ramda');

const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

const columns = [
  {
    id: 'icon',
    header: 'Icon',
    cell: (e) => e.icon,
    width: 75,
    minWidth: 75,
  },
  {
    id: 'type',
    header: 'Resource Type',
    cell: (e) => e.name,
    width: 300,
    minWidth: 300,
  },
  {
    id: 'count',
    header: 'Count',
    cell: (e) => e.count,
    width: 100,
    minWidth: 100,
    sortingField: 'count',
  },
  {
    id: 'included',
    header: 'Show',
    cell: (e) => e.status,
    width: 150,
    minWidth: 150,
    sortingField: 'statusSort',
  },
];

const ResourceType = () => {
  const [types, setTypes] = React.useState([]);
  const [{ filters, resources }, dispatch] = useResourceState();
  const [{ graphFilters }, updateFilters] = useGraphState();
  const [error, setError] = React.useState();
  const mapIndexed = R.addIndex(R.map);
  const diff = function(a, b) {
    return b.excluded - a.excluded;
  };

  React.useEffect(() => {
    applyFilteredResourceTypes();
  }, []);

  const isMatch = (node) =>
    !R.includes(node.resourceType, graphFilters.typeFilters);

  const removeFilteredNodes = () =>
    Promise.resolve(filterOnAccountAndRegion(filters))
      .then(handleResponse)
      .then(R.pathOr([], ['body']))
      .then((e) => {
        dispatch({
          type: 'updateResources',
          resources: {
            nodes: R.filter((x) => isMatch(x), e.nodes),
            metaData: e.metaData,
          },
        });
      })
      .then(() => setError(false))
      .catch(err => setError(true));

  const applyFilteredResourceTypes = () =>
    Promise.resolve(filterOnAccountAndRegion(filters))
      .then(handleResponse)
      .then(R.pathOr([], ['body', 'metaData', 'resourceTypes']))
      .then((e) =>
        mapIndexed((type, index) => {
          return {
            id: index,
            name: type,
            count: e[`${type}`],
            excluded:
              R.hasPath(['typeFilters'], graphFilters) &&
              R.includes(type, graphFilters.typeFilters),
          };
        }, R.keys(e))
      )
      .then(R.sort(diff))
      .then(setTypes)
      .then(() => setError(false))
      .catch(err => setError(true));

  const submitFilters = () => {
    graphFilters.typeFilters = types
      .filter((e) => e.excluded)
      .map((e) => e.name);
    uploadObject(
      'filters/resources/filters',
      JSON.stringify(graphFilters),
      'private',
      'application/json'
    )
      .then(
        updateFilters({
          type: 'updateFilters',
          graphFilters: graphFilters,
        })
      )
      .then(() => removeFilteredNodes())
      .then(() => applyFilteredResourceTypes())
      .then(setError())
      .catch((err) => setError(err));
  };

  const getStatusIndicator = (type) => {
    return (
      <Toggle
        onChange={({ detail }) => {
          const updatedType = R.find(R.propEq('name', type.name), types);
          updatedType.excluded = !detail.checked;
          setTypes(R.uniq([...types, updatedType]));
        }}
        checked={!type.excluded}></Toggle>
    );
  };

  const getRow = (type) => {
    return {
      id: type.id,
      name: type.name,
      icon: getResourceIcon(type.name),
      status: getStatusIndicator(type),
      count: type.count,
      statusSort: type.excluded ? '0' : '1',
    };
  };

  const getResourceIcon = (type) => {
    return (
      <img
        alt={`${type} icon`}
        src={fetchImage(type)}
        style={{
          background: 'white',
          width: '20px',
          height: '20px',
          marginLeft: '5%',
        }}
      />
    );
  };

  const setExcluded = (e) => R.mergeLeft({ excluded: e });

  return (
    <>
      {error && (
        <Flashbar
          type='error'
          message='We could not update your filters. It could be a temporary issue. Please try again.'
        />
      )}
      <Grid gridDefinition={[{ colspan: 3 }, { colspan: 9 }]}>
        <HelpPanel>
          <h5>Resource Type Filters</h5>
          <p>
            Filter the resources Perspective will display by toggling the
            visibility of the different resource types discovered
          </p>
          <dl>
            <dt>Make resources of a particular type visible</dt>
            <dd>
              <ol>
              <li>
                  Click <strong>Exclude all</strong>
                </li>  
                <li>
                  Locate the resource type in the <strong>Resource Types</strong> table.
                </li>                
                <li>
                  Toggle <strong>Show</strong> and it will appear in the{' '}
                  <strong>Resources</strong> menu in the side panel.
                </li>                
              </ol>
            </dd>
            <dt>Make all resource types visible</dt>
            <dd>
              <ol>
              <li>
                  Click <strong>Include all</strong>
                </li>  
                <li>
                  All resources will appear in the <strong>Resources</strong> menu in the side panel.
                </li>              
              </ol>
            </dd>
          </dl>
        </HelpPanel>
        <ResourceTypeTable
          trackBy='id'
          rows={types.map((e) => getRow(e))}
          columns={columns}
          sortColumn={'count'}
          pageSize={10}
          textFilter={true}
          setExcluded={setExcluded}
          setTypes={setTypes}
          types={types}
          submitFilters={submitFilters}
        />
      </Grid>
    </>
  );
};

export default ResourceType;
