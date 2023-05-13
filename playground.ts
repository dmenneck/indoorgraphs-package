// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");

const dataOne = require("./tests/graphs/routingOne.json")

const routingOptions = {
    pathOptions: {},
    attributes: { doorWidth: ["41", "min"] },
    // preferElevator: true
}

const filter = {} 

const newGraph = new IndoorGraphs(dataOne, { routingOptions, filter });
// const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
