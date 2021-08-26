import { requestWrapper, sendPostRequest } from '../../API/APIHandler';
const R = require('ramda');
export const filterOnAccountAndRegion = async (filters) => {
  const groupNames = (acc, { region }) =>
    R.isNil(region) ? acc : acc.concat(region);

  const filtersToApply = R.reduceBy(
    groupNames,
    [],
    (e) => e.accountId,
    filters
  );
  const query = {
    body: {
      command: 'getAllResources',
      data: {
        accountFilter: filtersToApply,
      },
    },
    processor: (data) => data.results,
  };
  
  return R.isEmpty(filtersToApply) ? {body: {nodes: [], metaData: {}}} : await requestWrapper(sendPostRequest, query);
};
