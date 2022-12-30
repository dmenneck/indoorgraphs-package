export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/createInstance.json")

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