const IndoorGraphs = require('../src/index')
const data = require('../graphs/exampleGraph.json')
const stairsData = require('../graphs/stairs.json')

const routingOptions = {
  doorOptions: {},
  pathWidth: 0,
  pathSlopeAngle: 0,
  showPathWithoutStairs: false,
  preferElevator: true
}

describe('Create Instance of IndoorGraphs', () => {
  test('Test for undefined', () => {
    const graph = new IndoorGraphs(data, {})
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
    const graph = new IndoorGraphs(data)
    // expect(graph.options).toBe("default")
  })
})

describe('Get routing nodes', () => {
  test('Test for undefined', () => {
    const graph = new IndoorGraphs(data, {})
    const nodes = graph.getNodes()
    expect(nodes).not.toBe(undefined)
  })

  test('Test nodes length', () => {
    const graph = new IndoorGraphs(data, {})
    const nodes = graph.getNodes()
    expect(Object.keys(nodes).length).toBe(14)
  })
})

describe('Get routing options', () => {
  test('Test for undefined', () => {
    const graph = new IndoorGraphs(data, {})
    const options = graph.getOptions()
    expect(!options).toBe(false)
  })

  test('no routing options passed, use default ones', () => {
    const graph = new IndoorGraphs(data)
    const options = graph.getOptions()
    expect(Object.keys(options).length).toBe(3)
  })
})

describe('Path tests', () => {
  test('Start node missing', () => {
    const graph = new IndoorGraphs(data, {})
    const [coordinates, path, instructions, error] = graph.getRoute('', 'OG4_t8')

    expect(error).toBe('Please enter a start and destination')
    expect(coordinates).toBe(undefined)
    expect(path).toBe(undefined)
    expect(instructions).toBe(undefined)
  })

  test('Dest node missing', () => {
    const graph = new IndoorGraphs(data, {})
    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', '')

    expect(error).toBe('Please enter a start and destination')
    expect(coordinates).toBe(undefined)
    expect(path).toBe(undefined)
    expect(instructions).toBe(undefined)
  })

  test("Invalid node name", () => {
    const graph = new IndoorGraphs(data);
    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'wdwdd');

    expect(coordinates).toBe(undefined);
    expect(path).toBe(undefined);
    expect(instructions).toBe(undefined);
    expect(error).toBe("Node wdwdd is not present in the graph.")
  })
})
