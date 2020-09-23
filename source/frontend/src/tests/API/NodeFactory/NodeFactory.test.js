import nodeToBuild from './data/node-to-build.json';
import nodeThatWasBuilt from './data/node-that-was-built.json';
import nodeThatWasBuiltClicked from './data/node-that-was-built-clicked.json';
import boundingBoxNodeToBuild from './data/node-bounding-box-to-build.json';
import boundingBoxNodeThatWasBuilt from './data/node-bounding-box-that-was-built.json';
import boundingBoxNodeThatWasBuiltParent from './data/node-bounding-box-that-was-built-parent.json';
import boundingBoxNodeToBuildParent from './data/node-bounding-box-to-build-parent.json';
import { buildNode, buildBoundingBox } from '../../../API/NodeFactory/NodeFactory';

const PUBLIC_URL = process.env;

beforeEach(() => {
  jest.resetModules(); // this is important - it clears the cache
  process.env = { ...PUBLIC_URL };
});

afterEach(() => {
  delete process.env.PUBLIC_URL;
});

test('when passing a node from the API to our node factory it will build the correct object', () => {
  process.env.PUBLIC_URL = '';
  const builtNode = buildNode(nodeToBuild, 'parent', 0, false);
  expect(JSON.stringify(builtNode)).toMatch(JSON.stringify(nodeThatWasBuilt));
});

test('when passing a node that was clicked from the API to our node factory it will build the correct object', () => {
  process.env.PUBLIC_URL = '';
  const builtNode = buildNode(nodeToBuild, 'parent', 0, true);
  expect(JSON.stringify(builtNode)).toEqual(
    JSON.stringify(nodeThatWasBuiltClicked)
  );
});

test('when passing a node that represents an account to our factory it returns a bounding box node', () => {
  process.env.PUBLIC_URL = '';
  const builtBox = buildBoundingBox(boundingBoxNodeToBuild, undefined, 0);
  expect(JSON.stringify(builtBox)).toMatch(
    JSON.stringify(boundingBoxNodeThatWasBuilt)
  );
});

test('when passing a node that represents an child to our factory it returns a bounding box node', () => {
    process.env.PUBLIC_URL = '';
    const builtBox = buildBoundingBox(boundingBoxNodeToBuildParent, 'woah-this-is-my-parent', 1);
    expect(JSON.stringify(builtBox)).toMatch(
      JSON.stringify(boundingBoxNodeThatWasBuiltParent)
    );
  });

  test('when passing undefined to our factory it should return empty object', () => {
    process.env.PUBLIC_URL = '';
    const builtBox = buildBoundingBox(undefined, 'woah-this-is-my-parent', 1);
    expect(builtBox).toEqual({})    
  });

  test('when passing undefined to our factory it should return empty object', () => {
    process.env.PUBLIC_URL = '';
    const builtNode = buildNode(undefined, 'woah-this-is-my-parent', 1);
    expect(builtNode).toEqual({})    
  });
