const { saveGraph } = require("./helpers");
const { getShortestPath } = require("./dijkstra");

class IndoorGraphs {
    nodes;
    options;
    constructor(nodes, options) {
        this.nodes = nodes;
        this.options = options;
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

    getPathInstructions(pathNodes) {}

    getRoute(start, dest) {
        if (!this.nodes) return false;
        if (!start || !dest) {
            return [undefined, undefined, undefined, "Please enter a start and destination"]
        }

        const graph = saveGraph(this.nodes, this.options);
        return getShortestPath(graph, `${start}`, `${dest}`)
    }
}

module.exports = { IndoorGraphs }