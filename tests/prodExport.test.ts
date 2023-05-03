export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/prodExport.json")
const data2 = require("./graphs/prodExportRouting.json")

describe('Test prod export', () => {
  test('Should combine equal pathAttributes', () => {
    const graph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });
    const productionGraph = graph.getProductionBuild()

    // get pathAttributesId
    const [pathAttributesId] = Object.keys(productionGraph.pathAttributes).filter((id) => id.length === 4)
    expect(pathAttributesId).toBeDefined()

    const nodes = productionGraph.nodes;
    Object.entries(nodes).map(([nodeId, attributes]: any) => {
      if (nodeId === "UG_t1") expect(attributes.pathAttributesIds.includes(pathAttributesId))
      if (nodeId === "UG_t2") expect(attributes.pathAttributesIds.includes(pathAttributesId))
      if (nodeId === "UG_t3") expect(attributes.pathAttributesIds.includes(pathAttributesId))

      if (nodeId === "UG_t4") expect(attributes.pathAttributesIds).toBeUndefined()
    })
  })

  test('Should find a valid path', () => {
    const graph = new IndoorGraphs(data2, { routingOptions: {}, filter: {} });
    const productionGraph = graph.getProductionBuild();

    const newGraph = new IndoorGraphs(productionGraph, { routingOptions: {}, filter: {} })
    console.log(newGraph)
    const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t5');

    console.log(path)
  })
})


