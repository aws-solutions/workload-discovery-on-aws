import apiResources from './data/resources.json';
import expectedResources from './data/expectedResourceMenu.json';
import { buildResources } from '../../../../components/Drawer/ResourceSelector/MenuBuilder';

test('when we pass the getAllResources API response to our menu builder it will generate the correct array of resources', () => {
  const builtResources = buildResources(apiResources);
  expect(builtResources).toEqual(expectedResources);
});

test('when we pass empty response to our menu builder it will generate an empty array', () => {
    const builtResources = buildResources([]);
    expect(builtResources.length).toEqual(0);
  });

  test('when we pass undefined response to our menu builder it will generate an empty array', () => {
    const builtResources = buildResources(undefined);
    expect(builtResources.length).toEqual(0);
  });
