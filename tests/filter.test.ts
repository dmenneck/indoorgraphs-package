export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/createInstance.json")

describe('get filter tests', () => {
    test('Should return default filter', () => {
      const graph = new IndoorGraphs(data, {})
      expect(graph.getFilter()).not.toBe(undefined)
    })

    test('Should return defined filter', () => {
        const graph = new IndoorGraphs(data, { filter: { test: 2 } });
        expect(graph.getFilter()).not.toBe(undefined)
        expect(graph.getFilter().test).toBe(2)
    })

    test('Should successfully update filter', () => {
        const graph = new IndoorGraphs(data, {});
        expect(graph.getFilter()).not.toBe(undefined)

        // update filter
        graph.setFilter({test: 2});
        expect(graph.getFilter()).not.toBe(undefined)
        expect(graph.getFilter().test).toBe(2)
    })
})
