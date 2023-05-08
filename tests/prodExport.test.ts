export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/prodExport.json")
const data2 = require("./graphs/prodExportRouting.json")

describe('Test prod export', () => {
  test('Should combine equal pathAttributes', () => {
    const graph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });
    const productionGraph = graph.getProductionBuild()

    const nodes = productionGraph.nodes;
    const pathAttributes = productionGraph.pathAttributes;

    const one = Object.entries(pathAttributes).map(([key, attributes]: any) => { if (attributes.isLit) return key})
    const two = Object.entries(pathAttributes).map(([key, attributes]: any) => { if (!attributes.isLit) return key})
    
    const [isLit] = one.filter(item => item);
    const [isNotLit] = two.filter(item => item);

    expect(Object.keys(pathAttributes).length).toBe(2)
    expect(nodes["UG_t1"].adjacentNodes.length).toBe(3)
    expect(nodes["UG_t2"].adjacentNodes.length).toBe(1)
    expect(nodes["UG_t3"].adjacentNodes.length).toBe(1)
    expect(nodes["UG_t4"].adjacentNodes.length).toBe(1)

    expect(nodes["UG_t4"].adjacentNodes[0].includes(isNotLit)).toBe(true)
    expect(nodes["UG_t3"].adjacentNodes[0].includes(isLit)).toBe(true)

    let isLitCount = 0;
    let isNotLitCount = 0;

    nodes["UG_t1"].adjacentNodes.map((id: string) => {
      id.includes(isLit) && isLitCount++;
      id.includes(isNotLit) && isNotLitCount++;
    })
  
    expect(isLitCount).toBe(2)
    expect(isNotLitCount).toBe(1)
  })

  test('Should find a valid path', () => {
    const graph = new IndoorGraphs(data2, { routingOptions: {}, filter: {} });
    const productionGraph = graph.getProductionBuild();

    const newGraph = new IndoorGraphs(productionGraph, { routingOptions: {}, filter: {} })
    const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t5');

    expect(path.length).toBe(3)
  })
})


