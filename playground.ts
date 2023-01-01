// todo: exclude tests from ts build
// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");

const data2 = require("./tests/graphs/textInstructions/NW.json");

const routingOptions = {
    pathOptions: {},
    doorOptions: {},
    preferElevator: false
}

const filter = {}

const graph = new IndoorGraphs(data2, { routingOptions, filter })

const [coordinates, path, instructions, error] = graph.getRoute('UG_1', 'UG_2');
