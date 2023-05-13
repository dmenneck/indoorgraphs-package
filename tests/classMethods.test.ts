export {};

const { IndoorGraphs } = require('../dist/index');
const dataOne = require("./graphs/routingOne.json")

describe('Class instanciating', () => {
    test('Finds path between two nodes', () => {
        const newGraph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });
        const [coordinates, path, instructions, error] = newGraph.getRoute('EG_t1', 'EG_t3');

        expect(newGraph).toBeDefined()
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
        const { attributes, pathOptions, preferElevator } = graph.getOptions()

        expect(Object.keys(attributes).length).toBe(0)
        expect(Object.keys(pathOptions).length).toBe(0)
        expect(preferElevator).toBeTruthy()
    })

    test("getOptions: no options provided", () => {
        const graph = new IndoorGraphs(dataOne, { routingOptions: {}, filter: {} });

        graph.setOptions({
            routingOptions: {
                attributes: { doorWidth: 40, isWellLit: true },
                pathOptions: { pathWidth: 80, pathSlope: 4 }
            },
            preferElevator: false
        })

        const { routingOptions, preferElevator } = graph.getOptions()
        expect(routingOptions.attributes.doorWidth).toBe(40)
        expect(routingOptions.attributes.isWellLit).toBeTruthy()
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

    test("getRoutableOptions() attributes", () => {
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
        
        const graph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });

        const { nodeAttributesOptions, pathAttributesOptions, preferElevator } = graph.getRoutableOptions()
        expect(preferElevator).toBeFalsy()
        expect(nodeAttributesOptions.doorWidth).toBe("string")
    })

    test("getRoutableOptions() path Attributes", () => {
        const data = {
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
     
        const graph = new IndoorGraphs(data, { routingOptions: {}, filter: {} });

        const { nodeAttributesOptions, pathAttributesOptions, preferElevator } = graph.getRoutableOptions()
        expect(pathAttributesOptions).toBeDefined()
        expect(pathAttributesOptions.hasStairs).toBe("boolean")
    })
})
