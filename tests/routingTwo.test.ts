export {};

const { IndoorGraphs } = require('../dist/index');
const dataTwo = require("./graphs/routingTwo.json")

describe('Routing: Graph two', () => {
    test('Finds path between two nodes', () => {
        const graph = new IndoorGraphs(dataTwo, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t2');
        expect(error).toBeFalsy()
        expect(path.length).toBe(2)
    })

    test('Should find no valid nodes', () => {
        const graph = new IndoorGraphs(dataTwo, { routingOptions: {
            doorOptions: { isWellLit: true }
        }, filter: {} });

        const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t2');
        expect(error).toBeDefined()
        expect(error).toBe("Node EG_t1 is not present in the graph.")
    })

    test('Should find shortest path', () => {
        const graph = new IndoorGraphs(dataTwo, { routingOptions: {}, filter: {} });

        const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t2")
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    })

    test('Should find shortest path but avoid stairs', () => {
        const graph = new IndoorGraphs(dataTwo, { routingOptions: {
            pathOptions: { hasStairs: false }
        }, filter: {} });

        const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(4)
        expect(path[1]).toBe("EG_t3")
    })

    test('Should find shortest path: stairs enabled', () => {
        const graph = new IndoorGraphs(dataTwo, { routingOptions: {
            pathOptions: { hasStairs: true }
        }, filter: {} });

        const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t2")
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    })


    test('Should find shortest path: stairs disabled but filter off', () => {
        const graph = new IndoorGraphs(dataTwo, { routingOptions: {
            pathOptions: { hasStairs: false }
        }, filter: {
            hasStairs: false
        } });

        const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t2")
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    })


    test('Should find shortest path: stairs disabled but filter on', () => {
        const graph = new IndoorGraphs(dataTwo, { routingOptions: {
            pathOptions: { hasStairs: false }
        }, filter: {
            hasStairs: true
        } });

        const [coordinates, path, instructions, error] = graph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(4)
        expect(path[1]).toBe("EG_t3")
    })
})
