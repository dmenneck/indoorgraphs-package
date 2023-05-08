// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");
const data = require("./tests/graphs/prodExportRouting.json")
const test2 = require("./test.json")

const graph = new IndoorGraphs(test2, { routingOptions: {}, filter: {} });

const productionGraph = graph.getProductionBuild();

const newGraph = new IndoorGraphs(productionGraph, { routingOptions: {}, filter: {} })


const [coordinates, path, instructions, error] = newGraph.getRoute('OD_1369', 'OD_1311');

console.log(error, path)

