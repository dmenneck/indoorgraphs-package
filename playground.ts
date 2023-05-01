// todo: exclude tests from ts build
// update tests

// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");
const data = require("./tests/graphs/prodExport.json")

const graph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });
graph.getProductionBuild()

// const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'UG_t2');

