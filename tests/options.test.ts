export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/createInstance.json")

describe('Get routing options', () => {
    test('Test for undefined', () => {
      const graph = new IndoorGraphs(data, {})
      const options = graph.getOptions()
      expect(!options).toBe(false)
    })
  
    test('No routing options passed, use default ones', () => {
      const graph = new IndoorGraphs(data, {})
      const options = graph.getOptions()
      expect(Object.keys(options).length).toBe(3)
    })
})

describe('Set routing options', () => {
  test('?', () => {
    
  })
})


describe('Get routable options', () => {
  test('?', () => {
    
  })
})