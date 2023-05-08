export {};

const { IndoorGraphs } = require('../dist/index');
const dataOne = require("./graphs/routingOne.json")

describe('Routing', () => {
    test('Finds path between two nodes', () => {
        const newGraph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t3');

        expect(coordinates.length).toBe(2)
        expect(path.length).toBe(2)
        expect(path[0]).toBe("EG_t1")
        expect(path[1]).toBe("EG_t3")
        expect(error).toBe(undefined)
    })

    test('Correct instructions between two nodes', () => {
        const newGraph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t3');
        
        const { finalTextInstructions, distancesSum, timeToTravel, floorChangeWithStairsOrElevator, turningNodes } = instructions;

        expect(finalTextInstructions.length).toBe(3)
        expect(finalTextInstructions[0]).toBe("Start at EG_t1")
        expect(finalTextInstructions[1]).toBe("Follow the path for 261.8 meters")
        expect(finalTextInstructions[2]).toBe("You arrived at EG_t3")
        expect(floorChangeWithStairsOrElevator).toBe("stairs")
        expect(Object.keys(turningNodes).length).toBe(0)
    })

    test('Invalid Node: no path found', () => {
        const newGraph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'INVALID_NODE_ID');

        expect(coordinates).toBeUndefined()
        expect(path).toBeUndefined()
        expect(instructions).toBeUndefined()

        expect(error).toBe("Node INVALID_NODE_ID is not present in the graph.")
    })

    test('Invalid Nodes: no path found', () => {
        const newGraph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('INVALID_NODE_ID_ONE', 'INVALID_NODE_ID_TWO');

        expect(error).toBe("Node INVALID_NODE_ID_ONE is not present in the graph.")
    })


    test('Path without attributes/filter: over stairs', () => {
        const newGraph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeUndefined()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t3")
    })

    test('Prefer Elevator path', () => {})
  
  
    test('Door: max', () => {
        const routingOptions = {
            pathOptions: {},
            doorOptions: { doorWidth: ["30", "max"] },
            preferElevator: true
        }
        
        const filter = {} 

        const newGraph = new IndoorGraphs(dataOne, { routingOptions, filter });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');

        expect(error).toBeUndefined()
        expect(path.length).toBe(4)
        expect(path[1]).toBe("EG_t2")
        
        const { finalTextInstructions, floorChangeWithStairsOrElevator } = instructions;
        expect(floorChangeWithStairsOrElevator).toBe("elevator")
        expect(finalTextInstructions[1].includes("elevator")).toBe(true)
    })  

  
    test('Door: max', () => {
        const routingOptions = {
            pathOptions: {},
            doorOptions: { doorWidth: ["50", "max"] },
        }
        
        const filter = {} 
        const newGraph = new IndoorGraphs(dataOne, { routingOptions, filter  });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeUndefined()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t3");
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    }) 

    test('Door: min', () => {
        const routingOptions = {
            pathOptions: {},
            doorOptions: { doorWidth: ["30", "min"] },
        }
        
        const filter = {} 

        const newGraph = new IndoorGraphs(dataOne, { routingOptions, filter  });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeUndefined()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t3");
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    }) 

    test('Door: min -> use elevator', () => {
        const routingOptions = {
            pathOptions: {},
            doorOptions: { doorWidth: ["41", "min"] },
            // preferElevator: true
        }
        
        const filter = {} 

        const newGraph = new IndoorGraphs(dataOne, { routingOptions, filter });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');

        expect(error).toBeUndefined()
        expect(path.length).toBe(4)

        const { finalTextInstructions, floorChangeWithStairsOrElevator } = instructions;
        expect(floorChangeWithStairsOrElevator).toBe("elevator")
        expect(finalTextInstructions[1].includes("elevator")).toBe(true)
    }) 

    test('Door: min -> use stairs', () => {
        const routingOptions = {
            pathOptions: {},
            doorOptions: { doorWidth: ["39", "min"] },
        }
        
        const filter = {} 

        const newGraph = new IndoorGraphs(dataOne, { routingOptions, filter });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');

        expect(error).toBeUndefined()
        expect(path.length).toBe(3)
        const { floorChangeWithStairsOrElevator } = instructions;
        expect(floorChangeWithStairsOrElevator).toBe("stairs")
    }) 
})
