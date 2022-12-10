const turf = require("@turf/turf")

const saveGraph = (nodes, options) => {
    const graph = buildGraph(nodes, options);
  
    const finishedGraph = {}
  
    if (!graph || graph.length < 2) return false;
  
    graph.map((node) => {
      finishedGraph[node.id] = node
    })
  
    return finishedGraph;
}

const buildGraph = (nodes, options) => {
    const nodesArray = []
    let filteredNodes = nodes;
  
    if (Object.keys(options).length > 0) {
      filteredNodes = removeEdges(nodes, options)
    }
  
    // no nodes left after filter
    if (Object.entries(filteredNodes).length < 2) {
      return false;
    }
  
    for (let nodeID in filteredNodes) {
      let adjacentLinks = {}
      const node = filteredNodes[nodeID]
  
      if (node.adjacentNodes) {
  
        Object.entries(node.adjacentNodes).map((adjacentNode) => {
          const dest = filteredNodes[adjacentNode[0]];
  
          if (!dest) return false;
  
          var from = turf.point(node.currentCoordinates);
          var to = turf.point(dest.currentCoordinates);
  
          var distance = turf.distance(from, to, {units: "meters"});
  
          adjacentLinks[adjacentNode[0]] = {
            distance,
            // direction: "east",
            // semantics: "go straight",
            width: adjacentNode[1].attributes ? adjacentNode[1].attributes.width : 0,
            slope: adjacentNode[1].attributes ? adjacentNode[1].attributes.slope : 0,
            wheelChair: adjacentNode[1].attributes ? adjacentNode[1].attributes.wheelChair : false,
          }
        })
      }
  
      nodesArray.push({
        id: node.id,
        type: node.attribute,
        coords: node.currentCoordinates,
        adjacentLinks
      })
    }
  
    return nodesArray;
}

const removeEdges = (nodes, {doorOptions, pathWidth, pathSlopeAngle, showPathWithoutStairs, preferElevator}) => {
    const copiedNodes = JSON.parse(JSON.stringify(nodes));
    const doorOptionsFilter = Object.entries(doorOptions);
  
    // extract relevant filter options
    const doorOptionsFiltered = doorOptionsFilter.filter((option) => {
      if (option[1]) return option;
    }) 

      // remove elevator nodes if user preferred stairs over elevator
    !preferElevator && Object.entries(copiedNodes).map(([id, node]) => {
      if (node.type === "Elevator") delete copiedNodes[id]
    })

  
    // remove nodes based on door filters
    Object.entries(copiedNodes).map(([id, node]) => {
      const doorOptions = node.doorOptions;
  
      if (!doorOptions) return;
  
      doorOptions && doorOptionsFiltered.map((option) => {
        if (option[1].length === 2) {
          if (option[1][1] === "max") {
            if (+doorOptions[option[0]] > +option[1][0]) delete copiedNodes[id];
          }
          if (option[1][1] === "min") {
            if (+doorOptions[option[0]] < +option[1][0]) delete copiedNodes[id];
          }
        } else if (doorOptions[option[0]] === false && option[1]) {
          delete copiedNodes[id];
        }
      })
    })
  
    // remove nodes based on path filter
    Object.entries(copiedNodes).map(([id, attributes]) => {
      Object.entries(attributes.adjacentNodes).map(([adjacentNodeID, adjacentNodeAttributes]) => {
        if (+adjacentNodeAttributes.attributes.pathWidth < +pathWidth && +pathWidth > 0) {
          // remove adjacency
          delete attributes.adjacentNodes[adjacentNodeID];
        }
  
        if (+adjacentNodeAttributes.attributes.pathSlopeAngle > +pathSlopeAngle && +pathSlopeAngle > 0) {
          // remove adjacency
          delete attributes.adjacentNodes[adjacentNodeID];
        }
  
        if (adjacentNodeAttributes.attributes.hasStairs === true && showPathWithoutStairs) {
          // remove adjacency
          delete attributes.adjacentNodes[adjacentNodeID];
        }
      })
    })
    
    return copiedNodes;
}

module.exports = {saveGraph, saveGraph, removeEdges};