export {};

const { IndoorGraphs } = require('../dist/index');
const dataThree = require("./graphs/routingThree.json")

describe('Routing: Graph three', () => {
    test('Finds path between two nodes', () => {

        const newGraph = new IndoorGraphs(dataThree, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeFalsy()
        expect(path.length).toBe(2)
    })
    
    test('doorWidth min -> path', () => {
        const newGraph = new IndoorGraphs(dataThree, { routingOptions: {
            doorOptions: {
                doorWidth: ["19", "min"]
            }
        }, filter: {} });

        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeFalsy()
        expect(path.length).toBe(2)
    })

    test('doorWidth min -> path', () => {
        const newGraph = new IndoorGraphs(dataThree, { routingOptions: {
            doorOptions: {
                doorWidth: ["21", "min"]
            }
        }, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeDefined()
        expect(error).toBe("Node UG_t1 is not present in the graph.")
    })

    test('doorWidth max -> path', () => {
        const newGraph = new IndoorGraphs(dataThree, { routingOptions: {
            doorOptions: {
                doorWidth: ["21", "max"]
            }
        }, filter: {} });

        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeFalsy()
        expect(path.length).toBe(2)
    })

    test('doorWidth max -> path', () => {
        const newGraph = new IndoorGraphs(dataThree, { routingOptions: {
            doorOptions: {
                doorWidth: ["19", "max"]
            }
        }, filter: {} });

        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeDefined()
        expect(error).toBe("Node UG_t1 is not present in the graph.")
    })

    test('doorWidth max + filter off', () => {
        const newGraph = new IndoorGraphs(dataThree, { routingOptions: {
            doorOptions: {
                doorWidth: ["19", "max"]
            }
        }, filter: {
            doorWidth: false
        } });

        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeUndefined()
        expect(path.length).toBe(2)
    })

    test('doorWidth min + filter off', () => {
        const newGraph = new IndoorGraphs(dataThree, { routingOptions: {
            doorOptions: {
                doorWidth: ["21", "min"]
            }
        }, filter: {
            doorWidth: false
        } });

        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeUndefined()
        expect(path.length).toBe(2)
    })
})

