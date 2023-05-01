export {};

var equal = require('fast-deep-equal');
const turf = require('@turf/turf')

const saveGraph = (nodes: any, options: any, activeFilter: any) => {
  const graph = buildGraph(nodes, options, activeFilter);

  const finishedGraph: any = {}

  if (!graph || graph.length < 2) return false

  graph.map((node: { id: string | number; }) => {
    finishedGraph[node.id] = node
  })

  return finishedGraph
}

const buildGraph = (nodes: any, options: any, activeFilter: any) => {
  const nodesArray: any = []
  let filteredNodes = nodes;

  if (Object.keys(options).length > 0) {
    filteredNodes = removeEdges(nodes, options, activeFilter)
  }

  // no nodes left after filter
  if (Object.entries(filteredNodes.nodes).length < 2) {
    return false
  }

  for (const nodeID in filteredNodes.nodes) {
    const adjacentLinks: any = {}
    const node = filteredNodes.nodes[nodeID]
    
    if (node.adjacentNodes) {
      Object.entries(node.adjacentNodes).map((adjacentNode: any) => {
        const dest = filteredNodes.nodes[adjacentNode[1]]
 
        if (!dest) return false

        const from = turf.point(node.currentCoordinates)
        const to = turf.point(dest.currentCoordinates)

        const distance = turf.distance(from, to, { units: 'meters' })

        adjacentLinks[adjacentNode[1]] = {
          distance,
          // direction: "east",
          // semantics: "go straight",
          // width: adjacentNode[1].attributes ? adjacentNode[1].attributes.width : 0,
          // slope: adjacentNode[1].attributes ? adjacentNode[1].attributes.slope : 0,
          // wheelChair: adjacentNode[1].attributes ? adjacentNode[1].attributes.wheelChair : false
        }       
      })
    }

    nodesArray.push({
      id: node.id,
      type: node.type,
      coords: node.currentCoordinates,
      adjacentLinks
    })
  }

  return nodesArray

}
const removeKey = (key: string, {[key]: _, ...rest}: any) => rest;


// das ist eigentlich richtig, wirft aber nen fehler
const deletePathAttributesWhereBothIds = (id: string, adjacentId: string, copiedNodes: any) => {

  Object.keys(copiedNodes.pathAttributes).map((key) => {
    if (key.includes(id) && key.includes(adjacentId) && copiedNodes.pathAttributes[key]) {

      copiedNodes.pathAttributes = removeKey(key, copiedNodes.pathAttributes)
    }
  })

  return copiedNodes
}

const deletePathAttributesWhereId = (id: string, copiedNodes: any) => {
  // delete all the pathAttributes that are associated with Elevator nodes
  Object.keys(copiedNodes.pathAttributes).map((key) => {
    if (key.includes(id)) delete copiedNodes.pathAttributes[key]
  })

  return copiedNodes
}

const removeEdges = (nodes: any, { doorOptions, pathOptions, preferElevator }: any, activeFilter: any) => {
  let copiedNodes = JSON.parse(JSON.stringify(nodes))
  const doorOptionsFiltered = doorOptions && Object.entries(doorOptions)
  const pathOptionsFiltered = pathOptions && Object.entries(pathOptions)

  const idsToRemoveFromPathAttributes: string[] = []
  // remove elevator nodes if user preferred stairs over elevator
  !preferElevator && Object.entries(copiedNodes.nodes).map(([id, node]: any) => {
    if (node.type === 'Elevator') {
      delete copiedNodes.nodes[id];
      idsToRemoveFromPathAttributes.push(id)
      
      copiedNodes = deletePathAttributesWhereId(id, copiedNodes)
    }
  })

  // remove nodes based on door filters
  if (doorOptions && Object.keys(doorOptions).length > 0) {
    Object.entries(copiedNodes.nodes).map(([id, node]: any) => {

      const doorOptions = node.doorOptions
      if (!doorOptions) return

      doorOptions && doorOptionsFiltered.map((filterOption: any) => {
        // skip attribute if user selected false;
        // "this attribute should not be included in the querying"
        if (activeFilter[filterOption[0]] === false) {
          // console.log('ignore: ', filterOption[0])
          return false
        }

        // filterOption is of type ['value', 'min/max']
        if (filterOption[1].length === 2) {
          if (filterOption[1][1] === 'max') {
            // console.log(copiedNodes)
            if (+doorOptions[filterOption[0]] > +filterOption[1][0]) {
              delete copiedNodes.nodes[id]
              // delete node from pathAttributes
              copiedNodes = deletePathAttributesWhereId(id, copiedNodes);
            }
          }
          if (filterOption[1][1] === 'min') {
            if (+doorOptions[filterOption[0]] < +filterOption[1][0]) {
              delete copiedNodes.nodes[id]
              // delete node from pathAttributes
              copiedNodes = deletePathAttributesWhereId(id, copiedNodes);
            }
          }
          // filterOption is a boolean
        } else if (doorOptions[filterOption[0]] !== filterOption[1]) {
          delete copiedNodes.nodes[id]
          // delete node from pathAttributes
          copiedNodes = deletePathAttributesWhereId(id, copiedNodes);
        }
      })           
    })
  }

  const pathAttributesLength = Object.keys(copiedNodes.pathAttributes).length
  if (pathAttributesLength > 0 && pathOptions) {
    Object.entries(copiedNodes.nodes).map(([id, attributes]: any) => {
 
      attributes.adjacentNodes.map((adjacentNode: string) => {

        const nodesPathAttributes = getNodesPathAttribute(id, adjacentNode, copiedNodes);

        if (Object.keys(nodesPathAttributes).length === 0 || !nodesPathAttributes) return;

        pathOptionsFiltered.map((option: any) => {
          if (!nodesPathAttributes[option[0]]) return false

          // skip attribute if user selected false;
          if (activeFilter[option[0]] === false) {
            return false
          }


          // skip all nodes where the attribute is not set (= "undefined")
          if (typeof nodesPathAttributes[option[0]] === "undefined") return false;
       
          if (option[1].length === 2) {
            if (option[1][1] === 'max') {
              if (+nodesPathAttributes[option[0]] > +option[1][0]) {
                // remove node from adjacentNodes
                const filteredAdjacentNodes = copiedNodes.nodes[id].adjacentNodes.filter((nodeId: string) => nodeId !== adjacentNode);
                copiedNodes.nodes[id].adjacentNodes = filteredAdjacentNodes;

                // delete pathAttributes where both ids are present
                // copiedNodes = deletePathAttributesWhereBothIds(id, adjacentNode, copiedNodes);
              }
            }
            if (option[1][1] === 'min') {
              if (+nodesPathAttributes[option[0]] < +option[1][0]) {
                // remove node from adjacentNodes
                const filteredAdjacentNodes = copiedNodes.nodes[id].adjacentNodes.filter((nodeId: string) => nodeId !== adjacentNode);
                copiedNodes.nodes[id].adjacentNodes = filteredAdjacentNodes;

                // delete pathAttributes where both ids are present
                // copiedNodes = deletePathAttributesWhereBothIds(id, adjacentNode, copiedNodes);
              }
            }
          }
          
          // remove all adjacencies where value is true
          if (option[1] === false && (nodesPathAttributes[option[0]] === true)) {            
            // remove node from adjacentNodes
            const filteredAdjacentNodes = copiedNodes.nodes[id].adjacentNodes.filter((nodeId: string) => nodeId !== adjacentNode);
            copiedNodes.nodes[id].adjacentNodes = filteredAdjacentNodes;

            // delete pathAttributes where both ids are present
            // copiedNodes = deletePathAttributesWhereBothIds(id, adjacentNode, copiedNodes);
          }


          // remove all adjacencies where value is false
          if (option[1] === true && (nodesPathAttributes[option[0]] === false)) {
            // remove node from adjacentNodes
            const filteredAdjacentNodes = copiedNodes.nodes[id].adjacentNodes.filter((nodeId: string) => nodeId !== adjacentNode);
            copiedNodes.nodes[id].adjacentNodes = filteredAdjacentNodes;

            // delete pathAttributes where both ids are present
            // copiedNodes = deletePathAttributesWhereBothIds(id, adjacentNode, copiedNodes);
          }
 
        })
      })
    })
  }


  return copiedNodes
}

const getNodesPathAttribute = (nodeId: string, adjacentNodeId: string, copiedNodes: any) => {
  const pathAttributes = copiedNodes.pathAttributes;
  let pathAttributesForBothIds:any = {};

  pathAttributes && Object.keys(pathAttributes).map((key) => {
    if (key.includes(nodeId) && key.includes(adjacentNodeId)) {
      pathAttributesForBothIds = pathAttributes[key]
    }
  })

  return pathAttributesForBothIds
}

const combinePathAttributes = (graph: any) => {
  // loop over path attributes and check if there a duplicates
  const pathAttributes = graph.pathAttributes;
  const nodes = graph.nodes;

  Object.entries(pathAttributes).map(([pathId, attributesCurrent]) => {
    // if pathId is already a valid pathAttributesId without a -
    if (!pathId.includes("-")) return false;
    const [nodeIdOne, nodeIdTwo] = pathId.split("-");

    // hier jetzt für jede pathAttribtues nochmal über alle Pathattributes loopen 
    Object.entries(pathAttributes).map(([pathIdNext, attributesNext]) => {
      if (!pathIdNext.includes("-")) return false;
      const [nodeIdOneNext, nodeIdTwoNext] = pathIdNext.split("-");

      // skip if same path ids
      if (pathId === pathIdNext) return false;
  
      if (equal(attributesCurrent, attributesNext)) {
        const pathAttributesId = generateId(pathAttributes)
  
        // create arrays
        if (!Object(nodes[nodeIdOne]).hasOwnProperty("pathAttributesIds")) nodes[nodeIdOne]["pathAttributesIds"] = []
        if (!Object(nodes[nodeIdTwo]).hasOwnProperty("pathAttributesIds")) nodes[nodeIdTwo]["pathAttributesIds"] = []
        if (!Object(nodes[nodeIdOneNext]).hasOwnProperty("pathAttributesIds")) nodes[nodeIdOneNext]["pathAttributesIds"] = []
        if (!Object(nodes[nodeIdTwoNext]).hasOwnProperty("pathAttributesIds")) nodes[nodeIdTwoNext]["pathAttributesIds"] = []
   
        // add new pathAttributesId if its not already present 
        if (Object(nodes[nodeIdOne]).hasOwnProperty("pathAttributesIds")) { !nodes[nodeIdOne].pathAttributesIds.includes(pathAttributesId) && nodes[nodeIdOne].pathAttributesIds?.push(pathAttributesId) }
        if (Object(nodes[nodeIdTwo]).hasOwnProperty("pathAttributesIds")) { !nodes[nodeIdTwo].pathAttributesIds.includes(pathAttributesId) && nodes[nodeIdTwo].pathAttributesIds?.push(pathAttributesId) }
        if (Object(nodes[nodeIdOneNext]).hasOwnProperty("pathAttributesIds")) { !nodes[nodeIdOneNext].pathAttributesIds.includes(pathAttributesId) && nodes[nodeIdOneNext].pathAttributesIds?.push(pathAttributesId) }
        if (Object(nodes[nodeIdTwoNext]).hasOwnProperty("pathAttributesIds")) { !nodes[nodeIdTwoNext].pathAttributesIds.includes(pathAttributesId) && nodes[nodeIdTwoNext].pathAttributesIds?.push(pathAttributesId) }
  
        // add new pathAttributesId
        pathAttributes[pathAttributesId] = attributesCurrent;

        // delete individual pathAttributes to save data
        delete pathAttributes[pathId]
        delete pathAttributes[pathIdNext]
        
      }
    })
  })

  return graph
}

const generateId = (pathAttributes: any) => {
  const id = Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

  // check if id is not already used
  const pathAttributeIds = Object.keys(pathAttributes);
  // does this really work?
  while (pathAttributeIds.includes(id)) {
    generateId(pathAttributes)
  }


  return id;
}

/*
 * Export routing graph for production use
 * combines all the same pathAttributes into one, to reduce graph size
 */
const exportForProductionBuild = (graph: any) => {
  const finalGraph = combinePathAttributes(graph)
  // export for production
  return finalGraph
}

module.exports = { saveGraph, removeEdges, exportForProductionBuild }
