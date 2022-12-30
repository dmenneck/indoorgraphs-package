// todo: exclude tests from ts build
const { IndoorGraphs } = require("indoorgraphs");

const data = require("./graphs/test.json");

const filter = {
    pathHasStairs: false
}

const routingOptions = {
    preferElevator: false 
}

const graph = new IndoorGraphs(data, { routingOptions, filter });

const [coordinates, visitedNodes, instructions, error] = graph.getRoute("UG_t1", "EG_t4");

if (!error) {
    console.log(instructions)
}
