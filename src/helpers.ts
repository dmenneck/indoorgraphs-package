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
    // @ts-ignore
    filteredNodes = removeEdges(nodes, options, activeFilter)
  }

  // no nodes left after filter
  if (Object.entries(filteredNodes.nodes).length < 2) {
    return false
  }

  for (const nodeID in filteredNodes.nodes) {

    const adjacentLinks: any = {}

    const node = nodeID?.includes(":") ? filteredNodes.nodes[nodeID.split(":")[0]] : filteredNodes.nodes[nodeID]

    if (node.adjacentNodes) {
      Object.entries(node.adjacentNodes).map((adjacentNode: any) => {

        const dest = adjacentNode[1]?.includes(":") ? filteredNodes.nodes[adjacentNode[1].split(":")[0]] : filteredNodes.nodes[adjacentNode[1]]
        if (!dest) return false
       
        const from = turf.point(node.currentCoordinates)
        const to = turf.point(dest.currentCoordinates)

        const distance = turf.distance(from, to, { units: 'meters' })

        adjacentLinks[adjacentNode[1]?.includes(":") ? adjacentNode[1].split(":")[0] : adjacentNode[1]] = {
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

  // console.log(nodesArray)
  
  return nodesArray
}

const removeKey = (key: string, {[key]: _, ...rest}: any) => rest;

const deletePathAttributesWhereId = (id: string, copiedNodes: any) => {
  // delete all the pathAttributes that are associated with Elevator nodes
  Object.keys(copiedNodes.pathAttributes).map((key) => {
    if (key.includes(id)) delete copiedNodes.pathAttributes[key]
  })

  return copiedNodes
}

const removeEdges = (nodes: any, { attributes, pathOptions, preferElevator }: any, activeFilter: any) => {
  let copiedNodes = JSON.parse(JSON.stringify(nodes))
  const attributesFiltered = attributes && Object.entries(attributes)
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
  if (attributes && Object.keys(attributes).length > 0) {
    Object.entries(copiedNodes.nodes).map(([id, node]: any) => {

      const attributes = node.attributes
      if (!attributes) return

      attributes && attributesFiltered.map((filterOption: any) => {
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
            if (+attributes[filterOption[0]] > +filterOption[1][0]) {
              delete copiedNodes.nodes[id]
              // delete node from pathAttributes
              copiedNodes = deletePathAttributesWhereId(id, copiedNodes);
            }
          }
          if (filterOption[1][1] === 'min') {
            if (+attributes[filterOption[0]] < +filterOption[1][0]) {
              delete copiedNodes.nodes[id]
              // delete node from pathAttributes
              copiedNodes = deletePathAttributesWhereId(id, copiedNodes);
            }
          }
          // filterOption is a boolean
        } else if (attributes[filterOption[0]] !== filterOption[1]) {
          delete copiedNodes.nodes[id]
          // delete node from pathAttributes
          copiedNodes = deletePathAttributesWhereId(id, copiedNodes);
        }
      })           
    })
  }

  const pathAttributesLength = Object.keys(copiedNodes.pathAttributes).length;
  if (pathAttributesLength > 0 && pathOptions) {

    Object.entries(copiedNodes.nodes).map(([id, attributes]: any) => {
 
      attributes.adjacentNodes.map((adjacentNode: string) => {
        const nodesPathAttributes = adjacentNode.includes(":") ? getNodesPathAttribute(adjacentNode.split(":")[1], copiedNodes) : {}

        // if (!nodesPathAttributes || Object.keys(nodesPathAttributes).length === 0) return;
        pathOptionsFiltered.map((option: any) => {
          if (!nodesPathAttributes[option[0]]) return;
          
          // skip attribute if user selected false;
          if (activeFilter[option[0]] === false) return;
         
          // skip all nodes where the attribute is not set (= "undefined")
          if (typeof nodesPathAttributes[option[0]] === "undefined") return;
       
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

const getNodesPathAttribute = (pathAttributesId: string, copiedNodes: any) => {
  const pathAttributes = copiedNodes.pathAttributes;
  let pathAttributesForBothIds:any = pathAttributes[pathAttributesId];

  // console.log(pathAttributesId, pathAttributes)

  return pathAttributesForBothIds
}

function combinePathAttributes(graph: any) {
  const nodes: any = graph.nodes;
  const pathAttributes: any = graph.pathAttributes;
  const combined: any = {};
  const pathIds: any = {};

  for (const [pathKey, pathAttr] of Object.entries(pathAttributes)) {
    const pathAttrStr = JSON.stringify(pathAttr);

    if (pathAttrStr in pathIds) {
      combined[pathIds[pathAttrStr]].push(pathKey);
    } else {
      const randomId = generateId(pathAttributes)
      pathIds[pathAttrStr] = randomId;
      combined[randomId] = [pathKey];
    }
  }

  const newPathAttributes: any = {};

  for (const [randomId, pathKeys] of Object.entries(combined)) {
    // @ts-ignore
    const pathAttr = JSON.parse(JSON.stringify(pathAttributes[pathKeys[0]]));
    newPathAttributes[randomId] = pathAttr;
    // @ts-ignore
    for (const pathKey of pathKeys) {
      delete pathAttributes[pathKey];
      const [node1Id, node2Id] = pathKey.split('-');

      nodes[node1Id].adjacentNodes = nodes[node1Id].adjacentNodes.filter((nodeId: string) => nodeId !== node2Id)
      nodes[node2Id].adjacentNodes = nodes[node2Id].adjacentNodes.filter((nodeId: string) => nodeId !== node1Id)

      nodes[node1Id].adjacentNodes.push(`${node2Id}:${randomId}`)
      nodes[node2Id].adjacentNodes.push(`${node1Id}:${randomId}`)
    }
  }

  return { nodes, pathAttributes: newPathAttributes };
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
  const graphWithCombinedPathAttributes = combinePathAttributes(graph)
  const combinedNodeAttributes = combineNodeAttributes(graphWithCombinedPathAttributes);
  // @ts-ignore
  graphWithCombinedPathAttributes["nodeAttributes"] = combinedNodeAttributes;

  // export for production
  return graphWithCombinedPathAttributes
}

const combineNodeAttributes = (graph: any) => {
  const nodes: any = graph.nodes;
  const combined: any = {};

  // create combined Attributes object
  for (const [nodeId, attr] of Object.entries(nodes)) {
    const attributes: any = attr;
    const nodeAttributes: any = attributes.attributes;

    if (!nodeAttributes) continue;

    if (Object.keys(combined).length === 0) combined[generateId(nodeAttributes)] = nodeAttributes; 
  
    let isThereAnEqualAttributes = false;

    Object.entries(combined).map(([id, attributes]) => {
      if (equal(attributes, nodeAttributes)) {
        isThereAnEqualAttributes = true;
      }
    })

    if (!isThereAnEqualAttributes) {
      combined[generateId(nodeAttributes)] = nodeAttributes;      
    }
  }

  // add combineAttributes id to attributes of node
  for (const [nodeId, attr] of Object.entries(nodes)) {
    const attributes: any = attr;
    const nodeAttributes: any = attributes.attributes;

    Object.entries(combined).map(([id, attributes]) => {
      if (equal(attributes, nodeAttributes)) {
        nodes[nodeId].attributes = id
      }
    })
  }

  return combined;

  // loop over attributes and combine equal ones
  ///////////
  // HIER WEITER MACHEN! Danach GIS-to-graph + dann mit den erstellen Graphen test schreiben!
  //////////

}

module.exports = { saveGraph, removeEdges, exportForProductionBuild }
