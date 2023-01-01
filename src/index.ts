const { saveGraph } = require('./helpers')
const { getShortestPath } = require('./dijkstra');

interface NodeInterface {
  currentCoordinates: number[] | null;
  id: string;
  type: string;
  level: string;
  adjacentNodes?: object;
  doorOptions?: object;
}

interface DefaultRoutingOptions {
  doorOptions: object;
  pathOptions: object;
  preferElevator: boolean;
  [key: string]: any
}

interface Nodes {
  [key: string]: NodeInterface
}

const defaultRoutingOptions: DefaultRoutingOptions = {
  doorOptions: {},
  pathOptions: {},
  preferElevator: false
}

const defaultActiveFilter = {};

const validateNodes = (nodes: any) => {
  if (!nodes || Object.keys(nodes).length === 0) return false;

  const [id, obj]: [string, NodeInterface | unknown] = Object.entries(nodes)[0];

  if (typeof nodes !== "object" || !id.includes("_") || !obj.hasOwnProperty("currentCoordinates")) {
    return false;
  }

  return true;
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
    
    const validNodes = validateNodes(nodes)
    if (!validNodes) {
      throw new TypeError("Please provide valid nodes.");
    }

    const { routingOptions = defaultRoutingOptions, filter = defaultActiveFilter }: SecondArgument = options ;
    
    // user passed something else than an object
    if (typeof routingOptions !== "object" || typeof filter !== "object") {
      throw new TypeError("routingObjects and/or filter has to be of type object.");
    }

    // add default object if user didn't provide the objects
    if (!routingOptions.hasOwnProperty("doorOptions")) routingOptions.doorOptions = {};
    if (!routingOptions.hasOwnProperty("pathOptions")) routingOptions.pathOptions = {}
    if (!routingOptions.hasOwnProperty("preferElevator")) routingOptions.preferElevator = false;
    
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
    const doorOptions: any = {};
    let pathOptions: any = {};
    const preferElevator = false;

    Object.entries(this.nodes).map(([id, attributes]) => {
      if (attributes.doorOptions) {
        for (let key in attributes.doorOptions) {
          if (!doorOptions.hasOwnProperty(key)) {
            // @ts-ignore
            doorOptions[key] = typeof attributes.doorOptions[key] === "boolean" ? "boolean" : "string";
          }
        }  
      }

      if (attributes.adjacentNodes) {
        const [data] = Object.values(attributes.adjacentNodes);
        const [attr] = Object.values(data);

        Object.entries(attr).map(([key, val]) => {
          if (key && !pathOptions.hasOwnProperty(key)) {
   
            // add key to obj
            pathOptions = {...pathOptions, [key]: typeof val === "boolean" ? "boolean" : "string"}
          }
        })
      }
    })

    return { doorOptions, pathOptions, preferElevator }
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

    const graph = saveGraph(this.nodes, this.options, this.filter);

    if (!this.isNodeValid(graph, start)) {
      // console.log(`Node ${start} is not present in the graph.`);
      return this.constructErrorMessage(`Node ${start} is not present in the graph.`)
    }

    if (!this.isNodeValid(graph, dest)) {
      return this.constructErrorMessage(`Node ${dest} is not present in the graph.`)
    }

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

    // wenn nichts gefunden, dann fahrstuhl dazu packen!
    // const graph = saveGraph(this.nodes, this.options);
    // const shortestPath = getShortestPath(graph, `${start}`, `${dest}`)

    return shortestPath
  }

  // TODO
  matchToNearestPath() {
    
  }
}
