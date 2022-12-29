const { IndoorGraphs } = require("./dist/indoorgraphs.js");
const data = require("./graphs/303.json");

const graph = new IndoorGraphs(data);
const [coordinates, visitedNodes, instructions, error] = graph.getRoute("OG1_1.06", "EG_0.11");

console.log(error)