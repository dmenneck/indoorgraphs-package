const { saveGraph } = require('./helpers')
const { getShortestPath } = require('./dijkstra');

interface NodeInterface {
  currentCoordinates: number[] | null;
  id: string;
  type: string;
  level: string;
  adjacentNodes?: object;
}

interface DefaultRoutingOptions {
  doorOptions: object;
  pathOptions: object;
  preferElevator: boolean;
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
  if (!nodes || Object.keys(nodes).length === 0) return false;

  const [id, obj]: [string, NodeInterface | unknown] = Object.entries(nodes)[0];

  if (typeof nodes !== "object" || !id.includes("_") || !obj.hasOwnProperty("currentCoordinates")) {
    return false;
  }

  return true;
}

module.exports = class IndoorGraphs {
  nodes: Nodes;
  options?
  activeFilter: any;
  filter?: any;

  constructor (nodes: Nodes, options: DefaultRoutingOptions = defaultRoutingOptions, filter = defaultActiveFilter) {
    const validNodes = validateNodes(nodes)
    if (!validNodes) {
      throw new TypeError("Please provide valid nodes.");
    }

    this.options = options
    this.filter = filter
    this.nodes = nodes
  }

  getNodes () {
    return this.nodes
  }

  getOptions () {
    return this.options
  }

  setNodes (nodes: Nodes) {
    this.nodes = nodes
  }

  seOptions (options: any) {
    this.options = options
  }

  getFilterAttributes () {}

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
      return this.constructErrorMessage("Please enter a start and destination")
    }

    const graph = saveGraph(this.nodes, this.options, this.activeFilter);

    if (!this.isNodeValid(graph, start)) {
      console.log(`Node ${start} is not present in the graph.`);
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

    // wenn nichts gefunden, dann fahrstuhl dazu packen!
    // const graph = saveGraph(this.nodes, this.options);
    // const shortestPath = getShortestPath(graph, `${start}`, `${dest}`)

    return shortestPath
  }
}
