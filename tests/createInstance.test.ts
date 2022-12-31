export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/createInstance.json")

describe('Create Instance of IndoorGraphs', () => {
  test('Valid instance', () => {
    const graph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });
    expect(graph.options).not.toBe(undefined)
    expect(graph.filter).not.toBe(undefined)
    expect(graph.nodes).not.toBe(undefined)
    expect(graph).not.toBe(undefined)
  })

  test('Invalid options that get overwritten by default valid ones', () => {
    const graph = new IndoorGraphs(data, { quatschOne: {}, quatschTwo: {} });
    expect(graph.options).not.toBe(undefined)
    expect(graph.filter).not.toBe(undefined)
    expect(graph.nodes).not.toBe(undefined)
    expect(graph).not.toBe(undefined)
  })

  test('No data provided', () => {
    try {
      new IndoorGraphs()
    } catch (error) {
      expect(error.message).toBe("Please provide valid nodes.");
    }
  })

  test('Should use default options if not given', () => {
    const graph = new IndoorGraphs(data, {});
    expect(graph.options).not.toBe("default");
    expect(graph.filter).not.toBe("default")
  })

  test('Invalid nodes - 1', () => {
    try {
        new IndoorGraphs("2", {})
      } catch (error) {
        expect(error.message).toBe("Please provide valid nodes.");
      }
  })

  test('Invalid nodes - 2', () => {
    try {
        new IndoorGraphs({test: "invalid"}, {})
      } catch (error) {
        expect(error.message).toBe("Please provide valid nodes.");
      }
  })
})
