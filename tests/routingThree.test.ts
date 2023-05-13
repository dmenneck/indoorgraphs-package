export {};

const { IndoorGraphs } = require('../dist/index');

describe('Routing: Graph three', () => {
    test('Finds path between two nodes', () => {
        const data = {
            "nodes": {
                "UG_t1": {
                    "currentCoordinates": [
                        6.939840163291116,
                        50.94164339911828
                    ],
                    "attributes": {
                        "doorWidth": "20"
                    },
                    "id": "UG_t1",
                    "type": "Room entrance",
                    "level": "UG",
                    "adjacentNodes": [
                        "UG_t2"
                    ]
                },
                "UG_t2": {
                    "currentCoordinates": [
                        6.950077535625931,
                        50.94255832352593
                    ],
                    "id": "UG_t2",
                    "type": "Node",
                    "level": "UG",
                    "adjacentNodes": [
                        "UG_t1"
                    ]
                }
            },
            "pathAttributes": {}
        }
        const newGraph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeFalsy()
        expect(path.length).toBe(2)
    })
    
    test('doorWidth min -> path', () => {
        const data = {
            "nodes": {
                "UG_t1": {
                    "currentCoordinates": [
                        6.939840163291116,
                        50.94164339911828
                    ],
                    "attributes": {
                        "doorWidth": "20"
                    },
                    "id": "UG_t1",
                    "type": "Room entrance",
                    "level": "UG",
                    "adjacentNodes": [
                        "UG_t2"
                    ]
                },
                "UG_t2": {
                    "currentCoordinates": [
                        6.950077535625931,
                        50.94255832352593
                    ],
                    "id": "UG_t2",
                    "type": "Node",
                    "level": "UG",
                    "adjacentNodes": [
                        "UG_t1"
                    ]
                }
            },
            "pathAttributes": {}
        }
        const newGraph = new IndoorGraphs(data, { routingOptions: {
            attributes: {
                doorWidth: ["19", "min"]
            }
        }, filter: {} });

        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeFalsy()
        expect(path.length).toBe(2)
    })

    test('doorWidth min -> path', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingThree.json"), { routingOptions: {
            attributes: {
                doorWidth: ["21", "min"]
            }
        }, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeDefined()
        expect(error).toBe("Node UG_t1 is not present in the graph.")
    })        

    test('doorWidth max -> path', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingThree.json"), { routingOptions: {
            attributes: {
                doorWidth: ["21", "max"]
            }
        }, filter: {} });

        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBeFalsy()
        expect(path.length).toBe(2)
    })

    test('doorWidth max -> path 2', () => {
        const data = {
            "nodes": {
                "UG_t1": {
                    "currentCoordinates": [
                        6.939840163291116,
                        50.94164339911828
                    ],
                    "attributes": {
                        "doorWidth": "20"
                    },
                    "id": "UG_t1",
                    "type": "Room entrance",
                    "level": "UG",
                    "adjacentNodes": [
                        "UG_t2"
                    ]
                },
                "UG_t2": {
                    "currentCoordinates": [
                        6.950077535625931,
                        50.94255832352593
                    ],
                    "id": "UG_t2",
                    "type": "Node",
                    "level": "UG",
                    "adjacentNodes": [
                        "UG_t1"
                    ]
                }
            },
            "pathAttributes": {}
        }
        const newGraph = new IndoorGraphs(data, { routingOptions: {
            attributes: {
                doorWidth: ["19", "max"]
            }
        }, filter: {} });

        const [coordinates, path, instructions, error] = newGraph.getRoute('UG_t1', 'UG_t2');
        expect(error).toBe("Node UG_t1 is not present in the graph.")
    })

    test('doorWidth max + filter off', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingThree.json"), { routingOptions: {
            attributes: {
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
        const newGraph = new IndoorGraphs(require("./graphs/routingThree.json"), { routingOptions: {
            attributes: {
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

