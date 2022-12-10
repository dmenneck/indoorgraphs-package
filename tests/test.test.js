const { IndoorGraphs } = require("../index");
const data = require("../exampleGraph.json");

const routingOptions = {
    doorOptions: {}, 
    pathWidth: 0, 
    pathSlopeAngle: 0, 
    showPathWithoutStairs: false, 
    preferElevator: true
}

describe("Create Instance of IndoorGraphs", () => {
    test('Test for undefined', () => {
        const graph = new IndoorGraphs(data, {});
        expect(graph).not.toBe(undefined);
    });

    test('undefined nodes and options', () => {
        const graph = new IndoorGraphs();
        expect(graph.nodes).toBe(undefined);
        expect(graph.options).toBe(undefined);
    });
})

describe("Get routing nodes", () => {
    test('Test for undefined', () => {
        const graph = new IndoorGraphs(data, {});
        const nodes = graph.getNodes()
        expect(nodes).not.toBe(undefined);
    });

    test('Test nodes length', () => {
        const graph = new IndoorGraphs(data, {});
        const nodes = graph.getNodes()
        expect(Object.keys(nodes).length).toBe(14)
    });
})

describe("Get routing options", () => {
    test('Test for undefined', () => {
        const graph = new IndoorGraphs(data, {});
        const options = graph.getOptions()
        expect(!options).toBe(false);
    });

    test('Return routing nodes', () => {
        const graph = new IndoorGraphs(data, routingOptions);
        const options = graph.getOptions();
        expect(Object.keys(options).length).toBe(5);
    });
})

describe("Path tests", () => {
    test('Start node missing', () => {
        const graph = new IndoorGraphs(data, {});
        const [coordinates, path, nodes, error] = graph.getRoute("", "OG4_t8");

        expect(error).toBe("Please enter a start and destination");
        expect(coordinates).toBe(undefined);
        expect(path).toBe(undefined);
        expect(nodes).toBe(undefined);
    });

    test('Dest node missing', () => {
        const graph = new IndoorGraphs(data, {});
        const [coordinates, path, nodes, error] = graph.getRoute("UG_t1", "");

        expect(error).toBe("Please enter a start and destination");
        expect(coordinates).toBe(undefined);
        expect(path).toBe(undefined);
        expect(nodes).toBe(undefined);
    });

    test('Valid path', () => {
        const graph = new IndoorGraphs(data, {});
        const [coordinates, path, nodes, error] = graph.getRoute("UG_t1", "OG4_t8");
        expect(error).toBe(undefined);
        expect(path.length).toBe(13);
        expect(nodes.finalTextInstructions.length).toBe(17);
    });

})
