export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/createInstance.json")

describe('Get routing nodes', () => {
    test('Test for undefined', () => {
      const graph = new IndoorGraphs(data, {})
      const nodes = graph.getNodes()
      expect(nodes).not.toBe(undefined);
      expect(Object.keys(nodes).length).toBe(2)
    })
  
    test('Test nodes length', () => {
      const graph = new IndoorGraphs(data, {})
      const nodes = graph.getNodes()
      expect(Object.keys(nodes).length).toBe(2)
    })
})