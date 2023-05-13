// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");
const data = require("./tests/graphs/routingTwo.json")
const test2 = require("./test.json")

const newGraph = new IndoorGraphs(data, { routingOptions: {}, filter: {} })
console.log(newGraph.getProductionBuild())
// const [coordinates, path, instructions, error] = newGraph.getRoute('OD_202', 'OD_2178');

// console.log(path)
