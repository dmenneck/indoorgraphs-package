export {};

const turf = require('@turf/turf')

const saveGraph = (nodes: any, options: any) => {
  const graph = buildGraph(nodes, options)

  const finishedGraph: any = {}

  if (!graph || graph.length < 2) return false

  graph.map((node) => {
    finishedGraph[node.id] = node
  })

  return finishedGraph
}

const buildGraph = (nodes: any, options: any) => {
  const nodesArray = []
  let filteredNodes = nodes

  if (Object.keys(options).length > 0) {
    filteredNodes = removeEdges(nodes, options)
  }

  // no nodes left after filter
  if (Object.entries(filteredNodes).length < 2) {
    return false
  }

  for (const nodeID in filteredNodes) {
    const adjacentLinks: any = {}
    const node = filteredNodes[nodeID]

    if (node.adjacentNodes) {
      Object.entries(node.adjacentNodes).map((adjacentNode: any) => {
        const dest = filteredNodes[adjacentNode[0]]

        if (!dest) return false

        const from = turf.point(node.currentCoordinates)
        const to = turf.point(dest.currentCoordinates)

        const distance = turf.distance(from, to, { units: 'meters' })

        adjacentLinks[adjacentNode[0]] = {
          distance,
          // direction: "east",
          // semantics: "go straight",
          width: adjacentNode[1].attributes ? adjacentNode[1].attributes.width : 0,
          slope: adjacentNode[1].attributes ? adjacentNode[1].attributes.slope : 0,
          wheelChair: adjacentNode[1].attributes ? adjacentNode[1].attributes.wheelChair : false
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

const removeEdges = (nodes: any, { doorOptions, pathOptions, preferElevator }: any) => {
  const copiedNodes = JSON.parse(JSON.stringify(nodes))
  const doorOptionsFiltered = doorOptions && Object.entries(doorOptions)
  const pathOptionsFiltered = pathOptions && Object.entries(pathOptions)

  // remove elevator nodes if user preferred stairs over elevator
  !preferElevator && Object.entries(copiedNodes).map(([id, node]: any) => {
    if (node.type === 'Elevator') delete copiedNodes[id]
  })

  // remove nodes based on door filters
  if (doorOptions) {
    Object.entries(copiedNodes).map(([id, node]: any) => {
      const doorOptions = node.doorOptions
      if (!doorOptions) return

      doorOptions && doorOptionsFiltered.map((filterOption: any) => {
        // skip attribute if user selected false;
        // ist in web app richtig drinne!
        /*
          if (activeFilter[filterOption[0]] === false) {
            console.log('ignore: ', filterOption[0])
            return false
          }
        */

        if (filterOption[1].length === 2) {
          if (filterOption[1][1] === 'max') {
            if (+doorOptions[filterOption[0]] > +filterOption[1][0]) delete copiedNodes[id]
          }
          if (filterOption[1][1] === 'min') {
            if (+doorOptions[filterOption[0]] < +filterOption[1][0]) delete copiedNodes[id]
          }
        } else if (doorOptions[filterOption[0]] !== filterOption[1]) {
          delete copiedNodes[id]
        }
      })
    })
  }

  if (pathOptions) {
    Object.entries(copiedNodes).map(([id, attributes]: any) => {
      Object.entries(attributes.adjacentNodes).map(([adjacentNodeID, adjacentNodeAttributes]: any) => {
        const attributes = adjacentNodeAttributes.attributes

        pathOptionsFiltered.map((option: any) => {
          if (!attributes[option[0]]) return false

          // skip attribute if user selected false;
          /*
          if (activeFilter[option[0]] === false) {
            console.log('ignore: ', option[0])
            return false
          }
          */

          // skip all nodes where the attribute is not set (= "undefined")
          // if (typeof attributes[option] === "undefined") return false;

          if (option[1].length === 2) {
            if (option[1][1] === 'max') {
              if (+attributes[option[0]] > +option[1][0]) {
                delete copiedNodes[id].adjacentNodes[adjacentNodeID]
              }
            }
            if (option[1][1] === 'min') {
              if (+attributes[option[0]] < +option[1][0]) {
                delete copiedNodes[id].adjacentNodes[adjacentNodeID]
              }
            }
          }

          // remove all adjacencies where value is true
          if (option[1] === false && (attributes[option[0]] === true)) {
            delete copiedNodes[id].adjacentNodes[adjacentNodeID]
          }

          // remove all adjacencies where value is false
          if (option[1] === true && (attributes[option[0]] === false)) {
            delete copiedNodes[id].adjacentNodes[adjacentNodeID]
          }
        })
      })
    })
  }

  return copiedNodes
}

module.exports = { saveGraph, removeEdges }