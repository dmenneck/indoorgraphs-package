// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");
const data = require("./tests/graphs/prodExportRouting.json")

const graph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });

const productionGraph = graph.getProductionBuild();

const newGraph = new IndoorGraphs(productionGraph, { routingOptions: {
    pathOptions: { pathWidth: ["9", "max"] }
}, filter: {} })

const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t5');
