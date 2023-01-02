// todo: exclude tests from ts build
// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");

const data2 = require("./graphs/os.json");

const routingOptions = {
    pathOptions: {},
    doorOptions: {},
    preferElevator: false
}

const filter = {}

const graph = new IndoorGraphs(data2, { routingOptions, filter })

const [coordinates, path, instructions, error] = graph.getRoute('EG_s1', 'EG_s5');

console.log(instructions)