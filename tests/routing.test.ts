export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/createInstance.json");
const data2 = require("./graphs/pathWidth20.json");

describe('Valid paths', () => {
  test('Valid simple path', () => {
    const graph = new IndoorGraphs(data, {})

    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'UG_t2')

    expect(coordinates).not.toBe(undefined);
    expect(path).not.toBe(undefined);
    expect(instructions).not.toBe(undefined);
    expect(error).toBe(undefined);
    expect(coordinates[0].length).toBe(2) 
  })

  test('Valid simple path - 1', () => {
    const graph = new IndoorGraphs(data2, {})

    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'UG_t2')

    expect(coordinates).not.toBe(undefined);
    expect(path).not.toBe(undefined);
    expect(instructions).not.toBe(undefined);
    expect(error).toBe(undefined);
    expect(coordinates[0].length).toBe(2) 
  })
})

describe("Different options", () => {
  test('Should return no path because pathWidth option doesnt match the nodes path attributes', () => {
    // user has to pass valid routing options
    const routingOptions = {
      pathOptions: { pathWidth: ["5", "max"] },
      doorOptions: {},
      preferElevator: false
    }

    const graph = new IndoorGraphs(data2, { routingOptions, filter: { pathWidth: true } })

    const { doorOptions, pathOptions, preferElevator } = graph.getRoutableOptions()
    expect(doorOptions).not.toBe(undefined);
    expect(preferElevator).toBe(false);
    expect(pathOptions.pathWidth).toBe("string");

    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'UG_t2');
    expect(path).toBe(undefined);
    expect(error).toBe("No path found.")
  })

  test('Should ignore path options because filter is set', () => {
    // user has to pass valid routing options
    const routingOptions = {
      pathOptions: { pathWidth: ["5", "max"] },
      doorOptions: {},
      preferElevator: false
    }

    const graph = new IndoorGraphs(data2, { routingOptions, filter: { pathWidth: false } })

    const { doorOptions, pathOptions, preferElevator } = graph.getRoutableOptions()
    expect(doorOptions).not.toBe(undefined);
    expect(preferElevator).toBe(false);
    expect(pathOptions.pathWidth).toBe("string");

    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'UG_t2');
    expect(error).toBe(undefined);
    expect(path.length).toBe(2)
  })

  test('Should return a path because pathWidth option matches the nodes path attributes', () => {
    // user has to pass valid routing options
    const routingOptions = {
      pathOptions: { pathWidth: ["5", "min"] },
      doorOptions: {},
      preferElevator: false
    }

    const graph = new IndoorGraphs(data2, { routingOptions, filter: { pathWidth: true } })

    const { doorOptions, pathOptions, preferElevator } = graph.getRoutableOptions()
    expect(doorOptions).not.toBe(undefined);
    expect(preferElevator).toBe(false);
    expect(pathOptions.pathWidth).toBe("string");

    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'UG_t2');
    expect(error).toBe(undefined);
    expect(path.length).toBe(2)
  })
})

describe('Invalid nodes', () => { 
    test('Start node missing', () => {
      const graph = new IndoorGraphs(data, {})
      const [coordinates, path, instructions, error] = graph.getRoute('', 'UG_t2')
  
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

    test('Node not present in graph', () => {
        const graph = new IndoorGraphs(data, {})
        const [coordinates, path, instructions, error] = graph.getRoute(2, 'UG_t2')
    
        expect(error).toBe('Node 2 is not present in the graph.')
        expect(coordinates).toBe(undefined)
        expect(path).toBe(undefined)
        expect(instructions).toBe(undefined)
    })

    test('Start and dest node missing', () => {
        const graph = new IndoorGraphs(data, {})
        const [coordinates, path, instructions, error] = graph.getRoute()
        
        expect(error).toBe('Please enter a start and destination')
        expect(coordinates).toBe(undefined)
        expect(path).toBe(undefined)
        expect(instructions).toBe(undefined)
    })
      
    test("Invalid node name", () => {
      const graph = new IndoorGraphs(data, {});
      const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'wdwdd');

      expect(coordinates).toBe(undefined);
      expect(path).toBe(undefined);
      expect(instructions).toBe(undefined);
      expect(error).toBe("Node wdwdd is not present in the graph.")
    })
})

describe("Different routing options", () => {
  test("", () => {
    
  })
})
