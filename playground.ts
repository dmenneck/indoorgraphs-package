// todo: exclude tests from ts build
// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");

const data2 = require("./graphs/test2.json");

const routingOptions = {
    pathOptions: {},
    doorOptions: {},
    preferElevator: false
}

const filter = {}

const graph = new IndoorGraphs(data2, {})
const [coordinates, path, instructions, error] = graph.getRoute('UG_1', 'UG_9');
console.log(instructions)
