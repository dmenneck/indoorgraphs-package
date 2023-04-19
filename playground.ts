// todo: exclude tests from ts build
// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");

const data2 = require("./graphs/newGraph.json");


const routingOptions = {
    pathOptions: { hasStairs: false },
    doorOptions: { doorWidth: ["15", "max"] },
    preferElevator: false
}

const filter = {}

const graph = new IndoorGraphs(data2, { routingOptions, filter })

const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t4');

// console.log(instructions.turningNodes)