export {};

const { IndoorGraphs } = require('../dist/index');

describe('Routing: Graph two', () => {
    test('Finds path between two nodes', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingTwo.json"), { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t2');
        expect(error).toBeFalsy()
        expect(path.length).toBe(2)
    })

    test('Should find no valid nodes', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingTwo.json"), { routingOptions: {
            attributes: { isWellLit: true }
        }, filter: {}  });

        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t2');
        expect(error).toBeDefined()
        expect(error).toBe("Node EG_t1 is not present in the graph.")
    })

    test('Should find shortest path', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingTwo.json"), { routingOptions: {}, filter: {}  });

        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t2")
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    })

    test('Should find shortest path but avoid stairs', () => {
        const json = {
            "nodes": {
                "EG_t1": {
                    "currentCoordinates": [
                        6.93957671090673,
                        50.939350753943216
                    ],
                    "attributes": {
                        "isWellLit": false
                    },
                    "id": "EG_t1",
                    "type": "Room entrance",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t3"
                    ]
                },
                "EG_t2": {
                    "currentCoordinates": [
                        6.946505543180664,
                        50.941262250870466
                    ],
                    "attributes": {
                        "isWellLit": false
                    },
                    "id": "EG_t2",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "EG_t3",
                        "EG_t4"
                    ]
                },
                "EG_t3": {
                    "currentCoordinates": [
                        6.946244900941135,
                        50.938247080639684
                    ],
                    "attributes": {
                        "isWellLit": false
                    },
                    "id": "EG_t3",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "EG_t2",
                        "EG_t4"
                    ]
                },
                "EG_t4": {
                    "currentCoordinates": [
                        6.94962923947096,
                        50.940506023209394
                    ],
                    "attributes": {
                        "isWellLit": false
                    },
                    "id": "EG_t4",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t3"
                    ]
                }
            },
            "pathAttributes": {
                "EG_t2-EG_t1": {
                    "hasStairs": true
                },
                "EG_t3-EG_t2": {
                    "hasStairs": false
                },
                "EG_t3-EG_t1": {
                    "hasStairs": false
                },
                "EG_t4-EG_t2": {
                    "hasStairs": false
                },
                "EG_t4-EG_t3": {
                    "hasStairs": true
                }
            }
        }

        const newGraph = new IndoorGraphs(json, { routingOptions: {
            pathOptions: { hasStairs: false }
        }, filter: {} });

        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(4)
        expect(path[1]).toBe("EG_t3")
    })

    test('Should find shortest path: stairs enabled', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingTwo.json"), { routingOptions: {
            pathOptions: { hasStairs: true }
        }, filter: {}   });

        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t2")
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    })

    test('Should find shortest path: stairs disabled but filter off', () => {
        const newGraph = new IndoorGraphs(require("./graphs/routingTwo.json"), { routingOptions: {
            pathOptions: { hasStairs: false }
        }, filter: {
            hasStairs: false
        } });

        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(3)
        expect(path[1]).toBe("EG_t2")
        expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
    })

    test('Should find shortest path: stairs disabled but filter on', () => {
        const json = {
            "nodes": {
                "EG_t1": {
                    "currentCoordinates": [
                        6.93957671090673,
                        50.939350753943216
                    ],
                    "attributes": {
                        "isWellLit": false
                    },
                    "id": "EG_t1",
                    "type": "Room entrance",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t3"
                    ]
                },
                "EG_t2": {
                    "currentCoordinates": [
                        6.946505543180664,
                        50.941262250870466
                    ],
                    "attributes": {
                        "isWellLit": false
                    },
                    "id": "EG_t2",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "EG_t3",
                        "EG_t4"
                    ]
                },
                "EG_t3": {
                    "currentCoordinates": [
                        6.946244900941135,
                        50.938247080639684
                    ],
                    "attributes": {
                        "isWellLit": false
                    },
                    "id": "EG_t3",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t1",
                        "EG_t2",
                        "EG_t4"
                    ]
                },
                "EG_t4": {
                    "currentCoordinates": [
                        6.94962923947096,
                        50.940506023209394
                    ],
                    "attributes": {
                        "isWellLit": false
                    },
                    "id": "EG_t4",
                    "type": "Node",
                    "level": "EG",
                    "adjacentNodes": [
                        "EG_t2",
                        "EG_t3"
                    ]
                }
            },
            "pathAttributes": {
                "EG_t2-EG_t1": {
                    "hasStairs": true
                },
                "EG_t3-EG_t2": {
                    "hasStairs": false
                },
                "EG_t3-EG_t1": {
                    "hasStairs": false
                },
                "EG_t4-EG_t2": {
                    "hasStairs": false
                },
                "EG_t4-EG_t3": {
                    "hasStairs": true
                }
            }
        }

        const newGraph = new IndoorGraphs(json, {  routingOptions: {
            pathOptions: { hasStairs: false }
        }, filter: {
            hasStairs: true
        } });

        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t4');
        expect(error).toBeFalsy()
        expect(path.length).toBe(4)
        expect(path[1]).toBe("EG_t3")
    })
})
