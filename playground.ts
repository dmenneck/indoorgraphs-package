// todo: exclude tests from ts build
const { IndoorGraphs } = require("indoorgraphs");
// const { IndoorGraphs } = require("./dist/index");

const data = require("./graphs/test.json");

const filter = {
    pathHasStairs: true
}

const routingOptions = {
    preferElevator: true 
}

const graph = new IndoorGraphs(data, { routingOptions, filter });
const routableOptions = graph.getRoutableOptions()

const [coordinates, visitedNodes, instructions, error] = graph.getRoute("UG_t1", "EG_t4");

if (!error) {
    console.log(instructions);
    console.log(routableOptions)
}
