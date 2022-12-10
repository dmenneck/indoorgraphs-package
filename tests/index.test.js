const { IndoorGraphs } = require("../index");
const data = require("../graphs/exampleGraph.json");
const stairsData = require("../graphs/stairs.json");

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

    test('No data', () => {
        const graph = new IndoorGraphs();
        expect(graph.invalid).toBe(true);
    });

    test('Should use default options if not given', () => {
        const graph = new IndoorGraphs(data);
        // expect(graph.options).toBe("default")
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

    test('Return routing options', () => {
        const graph = new IndoorGraphs(data, {});
        const options = graph.getOptions();
        expect(Object.keys(options).length).toBe(5);
    });
})

describe("Path tests", () => {
    test('Start node missing', () => {
        const graph = new IndoorGraphs(data, {});
        const [coordinates, path, instructions, error] = graph.getRoute("", "OG4_t8");

        expect(error).toBe("Please enter a start and destination");
        expect(coordinates).toBe(undefined);
        expect(path).toBe(undefined);
        expect(instructions).toBe(undefined);
    });

    test('Dest node missing', () => {
        const graph = new IndoorGraphs(data, {});
        const [coordinates, path, instructions, error] = graph.getRoute("UG_t1", "");

        expect(error).toBe("Please enter a start and destination");
        expect(coordinates).toBe(undefined);
        expect(path).toBe(undefined);
        expect(instructions).toBe(undefined);
    });

    test('Valid path', () => {
        const graph = new IndoorGraphs(data, {});
        const [coordinates, path, instructions, error] = graph.getRoute("UG_t1", "OG4_t8");
        expect(error).toBe(undefined);
        expect(path.length).toBe(8);
        expect(instructions.finalTextInstructions.length).toBe(15);
    });
})

describe("Different options", () => {
    test("should use stairs if not elevator selected", () => {
        const graph = new IndoorGraphs(data, {});
        const [coordinates, path, instructions, error] = graph.getRoute("UG_t1", "OG4_t8");

        expect(error).toBe(undefined);
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    })

    test("should use elevators", () => {
        const routingData = {
            preferElevator: true
        }
        const graph = new IndoorGraphs(data, routingData);
        const [coordinates, path, instructions, error] = graph.getRoute("UG_t1", "OG4_t8");

        expect(error).toBe(undefined);
        expect(instructions.floorChangeWithStairsOrElevator).toBe("elevator")
    })
})

describe("Stairs", () => {
    test("should prefer longer path because the other paths include stairs", () => {
        const graph = new IndoorGraphs(stairsData, {
            showPathWithoutStairs: true
        });

        const [coordinates, path, instructions, error] = graph.getRoute("UG_t1", "UG_t3");

        expect(error).toBeUndefined();
        expect(path).toHaveLength(3)
        expect(path).toContain("UG_t1");
        expect(path).toContain("UG_t4");
        expect(path).toContain("UG_t3");
    })

    test("should prefer shorter path because stairs are included", () => {
        const graph = new IndoorGraphs(stairsData, {
            showPathWithoutStairs: false
        });

        const [coordinates, path, instructions, error] = graph.getRoute("UG_t1", "UG_t3");

        expect(error).toBeUndefined();
        expect(path).toHaveLength(3)
        expect(path).toContain("UG_t1");
        expect(path).toContain("UG_t2");
        expect(path).toContain("UG_t3");
    })
})