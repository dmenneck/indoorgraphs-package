export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/createInstance.json");
const data2 = require("./graphs/pathWidth20.json")

const routingOptions = {
  pathOptions: {},
  doorOptions: {},
  preferElevator: false
}

const filter = {
    pathWidth: true
}

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
  test('Set routing options', () => {
    const graph = new IndoorGraphs(data2, { routingOptions, filter})
    let options = graph.getOptions()
    expect(options.pathOptions).not.toBe(undefined);
    expect(options.doorOptions).not.toBe(undefined)
    expect(options.preferElevator).not.toBe(undefined)

    // update options
    const newRoutingOptions = {
      pathOptions: { pathWidth: ["10", "max"]},
      doorOptions: {},
      preferElevator: false
    }
    graph.setOptions(newRoutingOptions);
    options = graph.getOptions();

    const pathWidth = options.pathOptions.pathWidth
    expect(pathWidth).not.toBe(undefined);
    expect(pathWidth[0]).toBe("10");
    expect(pathWidth[1]).toBe("max")
  })
})

describe('Get routable options', () => {
  test('Get routable options', () => {
    const graph = new IndoorGraphs(data2, { routingOptions, filter})
    let routableOptions = graph.getRoutableOptions();

    expect(routableOptions.pathOptions.pathWidth).toBe("string");
  })
})