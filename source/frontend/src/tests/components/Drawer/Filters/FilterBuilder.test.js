import accounts from './data/accounts.json';
import { getFilterMenuTree } from '../../../../components/Drawer/Preferences/PreferenceManager/Filters/FilterBuilder';

test('when we pass the getAllResources API response to our menu builder it will generate the correct array of resources', () => {
  const accountConfig = [];
  accountConfig.push({accountId:'XXXXXXXXXXX1', regions:[
    { name: 'global' },
    { name: 'eu-west-1'}
  ]});
  accountConfig.push({accountId: 'XXXXXXXXXXX2', regions:[
    { name: 'us-east-1'},
    { name: 'us-east-2'},
    { name: 'global'},
    { name: 'eu-west-1'}
  ]});
  accountConfig.push({ accountId: 'XXXXXXXXXXX3', regions:[
    { name: 'eu-west-1'},
    { name: 'global' }
  ]});
  accountConfig.push({accountId:'global', regions:[{ name: 'global' }]});

  const builtAccountfilters = getFilterMenuTree(accountConfig);
  expect(builtAccountfilters).toEqual(accounts);
});

test('when we pass empty response to our menu builder it will generate an empty array', () => {
  const builtAccountfilters = getFilterMenuTree([]);
  expect(builtAccountfilters.length).toEqual(0);
});

test('when we pass undefined response to our menu builder it will generate an empty array', () => {
  const builtAccountfilters = getFilterMenuTree(undefined);
  expect(builtAccountfilters.length).toEqual(0);
});
