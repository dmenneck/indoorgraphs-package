const { saveGraph, exportForProductionBuild } = require('./helpers')
const { getShortestPath } = require('./dijkstra');

interface NodeInterface {
  currentCoordinates: number[] | null;
  id: string;
  type: string;
  level: string;
  adjacentNodes?: object;
  attributes?: object;
}

interface DefaultRoutingOptions {
  attributes: object;
  pathOptions: object;
  preferElevator: boolean;
  [key: string]: any
}

interface Nodes {
  [key: string]: NodeInterface
}

const defaultRoutingOptions: DefaultRoutingOptions = {
  attributes: {},
  pathOptions: {},
  preferElevator: false
}

const defaultActiveFilter = {};

const validateNodes = (graph: any) => {
  // check if user passed nothing or no object
  if (!graph || typeof graph !== "object") return { invalid: true, message: "Please provide a valid indoor graph." };

  // check if structure of passed graph is not {graph: {}, pathAttributes: {}}
  if (!graph.hasOwnProperty("nodes") || !graph.hasOwnProperty("pathAttributes")) return { invalid: true, message: "Graph is not of type {nodes: {}, pathAttributes: {}}. Please provide a valid indoor graph." };

  // check if user passed no nodes
  if (Object.keys(graph.nodes).length === 0) return { invalid: true, message: "Please provide nodes." };

  // check for valid properties
  let invalidProperties: any = null;
  Object.entries(graph.nodes).map(([id, properties]) => {
    const keys = ["currentCoordinates", "id",  "type", "level", "adjacentNodes"]
    // check for valid keys
    keys.map(key => {
      if (!properties.hasOwnProperty(key)) {
        invalidProperties= { invalid: true, message: `node ${id} is missing property "${key}"` };
      }
    })

    // check for valid value types
    
  })
 

  // todo: validate path attributes
  return invalidProperties ? invalidProperties : { invalid: false, message: null };
}

interface SecondArgument {
  routingOptions: DefaultRoutingOptions;
  filter: any
}

module.exports = class IndoorGraphs {
  nodes: Nodes;
  options?
  filter?: any;

  constructor(nodes: Nodes, options: SecondArgument) {
    
    const { invalid, message } = validateNodes(nodes);

    if (invalid) {
      throw new TypeError(message);
    }

    const { routingOptions = defaultRoutingOptions, filter = defaultActiveFilter }: SecondArgument = options ;
    
    // user passed something else than an object
    if (typeof routingOptions !== "object" || typeof filter !== "object") {
      throw new TypeError("routingObjects and/or filter has to be of type object.");
    }

    // add default object if user didn't provide the objects
    if (!routingOptions.hasOwnProperty("attributes")) routingOptions.attributes = {};
    if (!routingOptions.hasOwnProperty("pathOptions")) routingOptions.pathOptions = {}
    if (!routingOptions.hasOwnProperty("preferElevator")) routingOptions.preferElevator = true;
    
    this.options = routingOptions
    this.filter = filter
    this.nodes = nodes;
  }

  getNodes () {
    return this.nodes
  }

  setNodes (nodes: Nodes) {
    this.nodes = nodes
  }

  getOptions () {
    return this.options
  }

  setOptions (options: any) {
    this.options = options
  }

  // returns all the attributes present in the graph
  // these can be utilized to request accessible paths
  getRoutableOptions () {
    const attributes: any = {};
    let pathOptions: any = {};
    const preferElevator = false;

    // extract attributes
    Object.entries(this.nodes).map(([_, nodes]) => {
      Object.entries(nodes).map(([id, attributes]) => {
        for (let key in attributes.attributes) {
          if (!attributes.hasOwnProperty(key)) {
            attributes[key] = typeof attributes.attributes[key] === "boolean" ? "boolean" : "string";
          }
        }  
      })
   
      // extract pathOptions
      Object.entries(this.nodes.pathAttributes).map(([_, pathAttributes]) => {
        Object.entries(pathAttributes).map(([key, val]) => {
          if (key && !pathOptions.hasOwnProperty(key)) {
   
            // add key to obj
            pathOptions = {...pathOptions, [key]: typeof val === "boolean" ? "boolean" : "string"}
          }
        })
      })
    })
  
    return { attributes, pathOptions, preferElevator }
  }

  getFilter () {
    return this.filter;
  }

  setFilter (filter: any) {
    this.filter = filter;
  }

  isNodeValid (nodes: Nodes, node: string) {
    if (!nodes[node]) {
      return false;
    }

    return true;
  }

  constructErrorMessage (message: string) {
    return [undefined, undefined, undefined, message]
  }

  getRoute (start: string, dest: string) {
    if (!this.nodes) return false

    if (!start || !dest) {
      return this.constructErrorMessage("Please enter a start and destination");
    }

    // get production build
    const exportGraph = exportForProductionBuild(this.nodes);

    // save graph
    const graph = saveGraph(exportGraph, this.options, this.filter);

    if (!this.isNodeValid(graph, start)) {
      // console.log(`Node ${start} is not present in the graph.`);
      return this.constructErrorMessage(`Node ${start} is not present in the graph.`)
    }

    if (!this.isNodeValid(graph, dest)) {
      return this.constructErrorMessage(`Node ${dest} is not present in the graph.`)
    }

    // sollte auch positionen von abbiegungen zurückgeben: [{2: "left"}, {4: "sharp right"}]
    const shortestPath: [ [number], [string], object, string ] = getShortestPath(graph, `${start}`, `${dest}`);

    // remove "floorChangeWithStairsOrElevator" if only one floor
    if (shortestPath[2].hasOwnProperty("floors") && shortestPath[2].hasOwnProperty("floorChangeWithStairsOrElevator")) {
      // @ts-ignore
      if (shortestPath[2] && shortestPath[2]?.floors?.length === 1) delete shortestPath[2].floorChangeWithStairsOrElevator
    }

    // check if path has more than one node
    if (shortestPath[1].length === 1) {
      return this.constructErrorMessage(`No path found.`)
    }

    return shortestPath
  }

  // TODO
  matchToNearestPath() {
    
  }

  getProductionBuild() {
    const exportGraph = exportForProductionBuild(this.nodes);

    return exportGraph;
  }
}
