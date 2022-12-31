// todo: exclude tests from ts build
const { IndoorGraphs } = require("indoorgraphs");
// const { IndoorGraphs } = require("./dist/index");

const data2 = require("./tests/graphs/pathWidth20.json");

const routingOptions = {
    pathOptions: { pathWidth: ["5", "max"] },
    doorOptions: {},
    preferElevator: false
}

const filter = {
    pathWidth: true
}

const graph = new IndoorGraphs(data2, {})
console.log(graph.getRoutableOptions())

