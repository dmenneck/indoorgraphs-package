export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/prodExport.json")

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
})


