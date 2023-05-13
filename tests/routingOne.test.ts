export {};

const { IndoorGraphs } = require('../dist/index');

describe('Routing', () => {
    test('Finds path between two nodes', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingOne.json"), { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t3');

        expect(coordinates.length).toBe(2)
        expect(path.length).toBe(2)
        expect(path[0]).toBe("EG_t1")
        expect(path[1]).toBe("EG_t3")
        expect(error).toBe(undefined)
    })

    test('Correct instructions between two nodes', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingOne.json"), { routingOptions: {}, filter: {} });
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
        const newGraph = new IndoorGraphs(require("./graphs/routingOne.json"), { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'INVALID_NODE_ID');

        expect(coordinates).toBeUndefined()
        expect(path).toBeUndefined()
        expect(instructions).toBeUndefined()

        expect(error).toBe("Node INVALID_NODE_ID is not present in the graph.")
    })

    test('Invalid Nodes: no path found', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingOne.json"), { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('INVALID_NODE_ID_ONE', 'INVALID_NODE_ID_TWO');

        expect(error).toBe("Node INVALID_NODE_ID_ONE is not present in the graph.")
    })
 

    test('Path without attributes/filter: over stairs', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingOne.json"), { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeUndefined()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t3")
    })

    test('Prefer Elevator path', () => {})

    test('Door: max 2', () => {
        const data = {
            "nodes": {
                "EG_t1": {
                    "currentCoordinates": [
                        6.941962423193652,
                        50.94713474825744
                    ],
                    "attributes": {},
                    "id": "EG_t1",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t3"
                    ]
                },
                "EG_t2": {
                    "currentCoordinates": [
                        6.95561996432432,
                        50.947109852057906
                    ],
                    "attributes": {},
                    "id": "EG_t2",
                    "type": "Elevator",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "OG1_t2"
                    ]
                },
                "OG1_t2": {
                    "currentCoordinates": [
                        6.95561996432432,
                        50.947109852057906
                    ],
                    "id": "OG1_t2",
                    "type": "Elevator",
                    "dest": "OG1",
                    "level": "OG1",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t4"
                    ]
                },
                "EG_t3": {
                    "currentCoordinates": [
                        6.942328652117318,
                        50.944791628390846
                    ],
                    "attributes": {
                        "doorWidth": "40"
                    },
                    "id": "EG_t3",
                    "type": "Room entrance",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "EG_t4"
                    ]
                },
                "EG_t4": {
                    "currentCoordinates": [
                        6.942816227424807,
                        50.94232167852843
                    ],
                    "attributes": {},
                    "id": "EG_t4",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t3",
                        "OG1_t2"
                    ]
                }
            },
            "pathAttributes": {}
        }   

        const routingOptions = {
            pathOptions: {},
            attributes: { doorWidth: ["50", "max"] },
        }
        
        const filter = {} 
        const newGraph = new IndoorGraphs(data, { routingOptions, filter  });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeUndefined()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t3");
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    }) 

    test('Door: min', () => {
        const data = {
            "nodes": {
                "EG_t1": {
                    "currentCoordinates": [
                        6.941962423193652,
                        50.94713474825744
                    ],
                    "attributes": {},
                    "id": "EG_t1",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t3"
                    ]
                },
                "EG_t2": {
                    "currentCoordinates": [
                        6.95561996432432,
                        50.947109852057906
                    ],
                    "attributes": {},
                    "id": "EG_t2",
                    "type": "Elevator",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "OG1_t2"
                    ]
                },
                "OG1_t2": {
                    "currentCoordinates": [
                        6.95561996432432,
                        50.947109852057906
                    ],
                    "id": "OG1_t2",
                    "type": "Elevator",
                    "dest": "OG1",
                    "level": "OG1",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t4"
                    ]
                },
                "EG_t3": {
                    "currentCoordinates": [
                        6.942328652117318,
                        50.944791628390846
                    ],
                    "attributes": {
                        "doorWidth": "40"
                    },
                    "id": "EG_t3",
                    "type": "Room entrance",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "EG_t4"
                    ]
                },
                "EG_t4": {
                    "currentCoordinates": [
                        6.942816227424807,
                        50.94232167852843
                    ],
                    "attributes": {},
                    "id": "EG_t4",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t3",
                        "OG1_t2"
                    ]
                }
            },
            "pathAttributes": {}
        }
        
        const routingOptions = {
            pathOptions: {},
            attributes: { doorWidth: ["30", "min"] },
        }
        
        const filter = {} 

        const newGraph = new IndoorGraphs(data, { routingOptions, filter  });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeUndefined()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t3");
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    }) 

    test('Door: min -> use elevator', () => {
        const data = {
            "nodes": {
                "EG_t1": {
                    "currentCoordinates": [
                        6.941962423193652,
                        50.94713474825744
                    ],
                    "attributes": {},
                    "id": "EG_t1",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t3"
                    ]
                },
                "EG_t2": {
                    "currentCoordinates": [
                        6.95561996432432,
                        50.947109852057906
                    ],
                    "attributes": {},
                    "id": "EG_t2",
                    "type": "Elevator",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "OG1_t2"
                    ]
                },
                "OG1_t2": {
                    "currentCoordinates": [
                        6.95561996432432,
                        50.947109852057906
                    ],
                    "id": "OG1_t2",
                    "type": "Elevator",
                    "dest": "OG1",
                    "level": "OG1",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t4"
                    ]
                },
                "EG_t3": {
                    "currentCoordinates": [
                        6.942328652117318,
                        50.944791628390846
                    ],
                    "attributes": {
                        "doorWidth": "40"
                    },
                    "id": "EG_t3",
                    "type": "Room entrance",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "EG_t4"
                    ]
                },
                "EG_t4": {
                    "currentCoordinates": [
                        6.942816227424807,
                        50.94232167852843
                    ],
                    "attributes": {},
                    "id": "EG_t4",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t3",
                        "OG1_t2"
                    ]
                }
            },
            "pathAttributes": {}
        }
        
        const routingOptions = {
            pathOptions: {},
            attributes: { doorWidth: ["41", "min"] },
            // preferElevator: true
        }
        
        const filter = {} 

        const newGraph = new IndoorGraphs(data, { routingOptions, filter });
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
            attributes: { doorWidth: ["39", "min"] },
        }
        
        const filter = {} 

        const newGraph = new IndoorGraphs(require("./graphs/routingOne.json"), { routingOptions, filter });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');

        expect(error).toBeUndefined()
        expect(path.length).toBe(3)
        const { floorChangeWithStairsOrElevator } = instructions;
        expect(floorChangeWithStairsOrElevator).toBe("stairs")
    }) 
})
