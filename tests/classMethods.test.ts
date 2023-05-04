export {};

const { IndoorGraphs } = require('../dist/index');
const dataOne = require("./graphs/routingOne.json")

describe('Class instanciating', () => {
    test('Finds path between two nodes', () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        const productionBuild = graph.getProductionBuild();
        const newGraph = new IndoorGraphs(productionBuild, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t3');

        expect(graph).toBeDefined()
        expect(error).toBeUndefined()
    })
  
    test("getNodes()", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        expect(Object.keys(graph.getNodes().nodes).length).toBe(5)
        expect(graph.getNodes()).toBeDefined()
    })

    test("setNodes()", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        expect(Object.keys(graph.getNodes().nodes).length).toBe(5)
        expect(graph.getNodes()).toBeDefined()

        const id =  "UG_t1";
        const currentCoordinates = [ 6.964595992508727, 50.94904578470164 ]
        const type = "Node"
        const level = "UG"
        const adjacentNodes = ["UG_t2", "UG_t3"]

        const EG_t1 =  { id, currentCoordinates, type, level, adjacentNodes }
        const data = { nodes: { EG_t1 }, pathAttributes: {} }

        graph.setNodes(data)

        expect(Object.keys(graph.getNodes().nodes).length).toBe(1)
    })

    test("setNodes() -> undefined", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });

        expect(graph.setNodes()).toBeUndefined()
    })

    test("getOptions: no options provided", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        const { doorOptions, pathOptions, preferElevator } = graph.getOptions()

        expect(Object.keys(doorOptions).length).toBe(0)
        expect(Object.keys(pathOptions).length).toBe(0)
        expect(preferElevator).toBeTruthy()
    })

    test("getOptions: no options provided", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });

        graph.setOptions({
            routingOptions: {
                doorOptions: { doorWidth: 40, isWellLit: true },
                pathOptions: { pathWidth: 80, pathSlope: 4 }
            },
            preferElevator: false
        })

        const { routingOptions, preferElevator } = graph.getOptions()
        expect(routingOptions.doorOptions.doorWidth).toBe(40)
        expect(routingOptions.doorOptions.isWellLit).toBeTruthy()
        expect(routingOptions.pathOptions.pathWidth).toBe(80)
        expect(routingOptions.pathOptions.pathSlope).toBe(4)
        expect(preferElevator).toBeFalsy()
    })

    test("getFilter(): no options provided", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        expect(Object.keys(graph.getFilter()).length).toBe(0)
    })


    test("setFilter()", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        expect(Object.keys(graph.getFilter()).length).toBe(0)

        graph.setFilter({ isWellLit: false })

        expect(graph.getFilter().isWellLit).toBeFalsy()
    })

    test("getRoutableOptions()", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });

        const { doorOptions, pathOptions, preferElevator} = graph.getRoutableOptions()
        expect(preferElevator).toBeFalsy()
        expect(doorOptions.doorWidth).toBe("string")
        // expect(pathOptions.pathWidth).toBe("string")
    })

})
