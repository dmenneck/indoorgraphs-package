const { saveGraph } = require("./helpers");
const { getShortestPath } = require("./dijkstra");

const defaultRoutingOptions = {
    doorOptions: {}, 
    pathWidth: 0, 
    pathSlopeAngle: 0, 
    showPathWithoutStairs: false, 
    preferElevator: false
}

class IndoorGraphs {
    nodes;
    options;

    constructor(nodes, options = defaultRoutingOptions) {
        if (Object.entries(options).length === 0) {
            this.options = defaultRoutingOptions;
        } else {
            this.options = options;
        }

        if (!nodes) {
            return { invalid:true };
        }

        this.nodes = nodes;
    }

    getNodes() {
        return this.nodes;
    }

    getOptions() {
        return this.options;
    }

    setNodes(nodes) {
        this.nodes = nodes;
    }

    seOptions(options) {
        this.options = options;
    }

    getFilterAttributes() {
        
    }

    getRoute(start, dest) {
        if (!this.nodes) return false;
        if (!start || !dest) {
            return [undefined, undefined, undefined, "Please enter a start and destination"]
        }

        const graph = saveGraph(this.nodes, this.options);
        const shortestPath = getShortestPath(graph, `${start}`, `${dest}`)

        // remove "floorChangeWithStairsOrElevator" if only one floor
        if (shortestPath[2] && shortestPath[2].floors.length === 1) delete shortestPath[2].floorChangeWithStairsOrElevator;

        // wenn nichts gefunden, dann fahrstuhl dazu packen!
        // const graph = saveGraph(this.nodes, this.options);
        // const shortestPath = getShortestPath(graph, `${start}`, `${dest}`)

        return shortestPath;
    }
}

module.exports = { IndoorGraphs }