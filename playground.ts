// todo: exclude tests from ts build
// update tests

// const { IndoorGraphs } = require("indoorgraphs");
const { IndoorGraphs } = require("./dist/index");

const data2 = require("./tests/graphs/routingOne.json");

const routingOptions = {
    pathOptions: { hasStairs: true },
    doorOptions: { doorWidth: ["20", "max"] },
    preferElevator: false
}

const EG_t1 =  {
    currentCoordinates: [
        6.964595992508727,
        50.94904578470164
    ],
    id: "UG_t1",
    type: "Node",
    level: "UG",
    adjacentNodes: [
        "UG_t2",
        "UG_t3"
    ]
}

const filter = {}

const graph = new IndoorGraphs(data2,  { routingOptions, filter })

const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t4');

console.log(path)
