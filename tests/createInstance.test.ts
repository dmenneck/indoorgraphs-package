export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/createInstance.json")

describe('Create Instance of IndoorGraphs', () => {
  const id =  "UG_t1";
  const currentCoordinates = [ 6.964595992508727, 50.94904578470164 ]
  const type = "Node"
  const level = "UG"
  const adjacentNodes = ["UG_t2", "UG_t3"]
 
  test('Valid instance', () => {
    const EG_t1 =  { id, currentCoordinates, type, level, adjacentNodes }
    const data = { nodes: { EG_t1 }, pathAttributes: {} }
    const graph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });
    expect(graph.options).not.toBe(undefined)
    expect(graph.filter).not.toBe(undefined)
    expect(graph.nodes).not.toBe(undefined)
    expect(graph).not.toBe(undefined)
  })

  test('Invalid options that get overwritten by default valid ones', () => {
    const EG_t1 =  { id, currentCoordinates, type, level, adjacentNodes }
    const data = { nodes: { EG_t1 }, pathAttributes: {} }
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
      expect(error.message).toBe("Please provide a valid indoor graph.");
    }
  })

  test('Should use default options if not given', () => {
    const EG_t1 =  { id, currentCoordinates, type, level, adjacentNodes }
    const data = { nodes: { EG_t1 }, pathAttributes: {} }
    const graph = new IndoorGraphs(data, {});
    expect(graph.options).not.toBe("default");
    expect(graph.filter).not.toBe("default")
  })

  test('Invalid graph: node id attribute missing', () => {
    try {
        // attribute "id" is missing
        const EG_t1 =  { currentCoordinates, type, level, adjacentNodes }
        const data = { nodes: { EG_t1 }, pathAttributes: {} }
        new IndoorGraphs(data, { routingOptions: {}, filter: {} })
      } catch (error) {
        expect(error.message).toBe('node EG_t1 is missing property "id"');
      }
  })

  test('Invalid graph: node type attribute missing', () => {
    try {
        // attribute "type" is missing
        const EG_t1 =  { currentCoordinates, id, level, adjacentNodes }
        const data = { nodes: { EG_t1 }, pathAttributes: {} }
        new IndoorGraphs(data, { routingOptions: {}, filter: {} })
      } catch (error) {
        expect(error.message).toBe('node EG_t1 is missing property "type"');
      }
  })

  test('Invalid graph: node level attribute missing', () => {
    try {
        // attribute "level" is missing
        const EG_t1 =  { currentCoordinates, id, type, adjacentNodes }
        const data = { nodes: { EG_t1 }, pathAttributes: {} }
        new IndoorGraphs(data, { routingOptions: {}, filter: {} })
      } catch (error) {
        expect(error.message).toBe('node EG_t1 is missing property "level"');
      }
  })

  test('Invalid graph: node currentCoordinates attribute missing', () => {
    try {
        // attribute "currentCoordinates" is missing
        const EG_t1 =  { level, id, type, adjacentNodes }
        const data = { nodes: { EG_t1 }, pathAttributes: {} }
        new IndoorGraphs(data, { routingOptions: {}, filter: {} })
      } catch (error) {
        expect(error.message).toBe('node EG_t1 is missing property "currentCoordinates"');
      }
  })

  test('Invalid graph, no object', () => {
    try {
        new IndoorGraphs("2", {})
      } catch (error) {
        expect(error.message).toBe("Please provide a valid indoor graph.");
      }
  })

  test('Invalid graph: false attributes', () => {
    try {
        new IndoorGraphs({test: "invalid"}, {})
      } catch (error) {
        expect(error.message).toBe("Graph is not of type {nodes: {}, pathAttributes: {}}. Please provide a valid indoor graph.");
      }
  })

  test('Invalid graph: no nodes', () => {
    try {
        new IndoorGraphs({nodes: {}, pathAttributes: {}}, {})
      } catch (error) {
        expect(error.message).toBe("Please provide nodes.");
      }
  })
})
