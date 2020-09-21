const GremlinMock = require("./mockQueryConverter");
const sinon = require("sinon");
const { assert } = require("chai");
const rewire = require("rewire");
const index = rewire("../src");
const util = require("util");

describe("tests for index.js", () => {
  describe("linkedNodes", () => {
    const linkedNodes = index.__get__("linkedNodes");

    const mockG = {
      V: sinon.stub().returnsThis(),
      repeat: sinon.stub().returnsThis(),
      times: sinon.stub().returnsThis(),
      dedup: sinon.stub().returnsThis(),
      hasNot: sinon.stub().returnsThis(),
      valueMap: sinon.stub().returnsThis(),
      next: sinon.stub().returnsThis()
    };

    afterEach(function() {
      sinon.restore();
    });

    it("should handle query result with no vertices", async () => {
      const g = {
        ...mockG,
        toList: () => Promise.resolve([]),
        next: () =>
          Promise.resolve({
            value: {
              id: "3",
              label: "My_Label_3",
              title: ["title 2"],
              awsRegion: ["eu-west-3"],
              flat: "test"
            }
          })
      };
      const actual = await linkedNodes(g, {
        command: "linkedNodes",
        data: {
          id: "3"
        }
      });

      let expectedResult = [
        {
          id: "3",
          label: "My::Label::3",
          properties: {
            title: "title 2",
            awsRegion: "eu-west-3",
            flat: "test"
          },
          parent: true
        }
      ];

      assert.strictEqual(actual.statusCode, 200);
      assert.deepEqual(actual.headers, { "Access-Control-Allow-Origin": "*" });
      assert.deepEqual(JSON.parse(actual.body), expectedResult);
      sinon.assert.calledWith(g.V, "3");
    });

    it("should handle query result with multiple vertices", async () => {
      const dbReturn = [
        {
          id: "1",
          label: "My_Label_1",
          title: ["title 1"],
          awsRegion: ["eu-west-1"]
        },
        {
          id: "2",
          label: "My_Label_2",
          title: ["title 2"],
          awsRegion: ["eu-west-2"]
        }
      ];

      const g = {
        ...mockG,
        toList: () => Promise.resolve(dbReturn),
        next: () =>
          Promise.resolve({
            value: {
              id: "3",
              label: "My_Label_3",
              title: ["title 2"],
              awsRegion: ["eu-west-3"],
              flat: "test"
            }
          })
      };

      const expectedBody = [
        {
          id: "1",
          label: "My::Label::1",
          parent: false,
          properties: {
            title: "title 1",
            awsRegion: "eu-west-1"
          }
        },
        {
          id: "2",
          label: "My::Label::2",
          parent: false,
          properties: {
            title: "title 2",
            awsRegion: "eu-west-2"
          }
        },
        {
          id: "3",
          label: "My::Label::3",
          parent: true,
          properties: {
            title: "title 2",
            awsRegion: "eu-west-3",
            flat: "test"
          }
        }
      ];

      const actual = await linkedNodes(g, {
        command: "linkedNodes",
        data: {
          id: "3"
        }
      });

      assert.strictEqual(actual.statusCode, 200);
      assert.deepEqual(actual.headers, { "Access-Control-Allow-Origin": "*" });
      // need to parse because the order of the keys is not guaranteed by JSON.stringify
      assert.deepEqual(JSON.parse(actual.body), expectedBody);
      sinon.assert.calledWith(g.V, "3");
    });
  });

  describe("mapToObj", () => {
    const mapToObj = index.__get__("mapToObj");

    it("should handle objects with no arrays", () => {
      const actual = mapToObj({ a: 1, b: 2, c: false });
      assert.deepEqual(actual, { a: 1, b: 2, c: false });
    });

    it("should handle objects with arrays", () => {
      const actual = mapToObj({ a: 1, b: ["a", "b"], c: false });
      assert.deepEqual(actual, { a: 1, b: "a", c: false });
    });
  });

  describe("addProperties", () => {
    const addProperties = index.__get__("addProperties");
    const g = new GremlinMock();

    beforeEach(() => g.clear());

    it("should handle string properties", async () => {
      const actual = await addProperties(g, 1, { a: "1", b: "2" });
      assert.strictEqual(
        actual,
        `g.V(1).property("a", "1").property("b", "2").next()`
      );
    });

    it("should handle mixed primitive properties", async () => {
      const actual = await addProperties(g, 1, { a: 1, b: true, c: "str" });
      assert.strictEqual(
        actual,
        `g.V(1).property("a", "1").property("b", "true").property("c", "str").next()`
      );
    });

    it("should handle array properties", async () => {
      const actual = await addProperties(g, 1, { a: [1, 2, 3] });
      assert.strictEqual(actual, `g.V(1).property("a", "[1,2,3]").next()`);
    });

    it("should handle object properties", async () => {
      const actual = await addProperties(g, 1, { a: { b: 1, c: "a" } });
      assert.strictEqual(
        actual,
        `g.V(1).property("a", "{"b":1,"c":"a"}").next()`
      );
    });
  });

  describe("processMap", () => {
    const processMap = index.__get__("processMap");

    it("should handle primitive types", () => {
      const actual = processMap({ id: 1, b: 2, c: false });
      assert.deepEqual(actual, { id: 1, properties: { b: 2, c: false } });
    });

    it("should handle properties with arrays", () => {
      const actual = processMap({ id: 1, b: ["a", "b"], c: false });
      assert.deepEqual(actual, { id: 1, properties: { b: "a", c: false } });
    });

    it("should handle label properties", () => {
      const actual = processMap({ id: 1, label: "my_large_label", c: "a" });
      assert.deepEqual(actual, {
        id: 1,
        label: "my::large::label",
        properties: { c: "a" }
      });
    });
  });
});
