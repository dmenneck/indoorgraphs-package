export {};
const turf = require('@turf/turf')

// @ts-ignore
class Node {
  val: any
  priority: any;
  constructor (val: any, priority: any) {
    this.val = val
    this.priority = priority
  }
}

class PriorityQueue {
  values: any[];
  constructor () {
    this.values = []
  }

  enqueue (val: any, priority: any) {
    // @ts-ignore
    const newNode = new Node(val, priority)
    this.values.push(newNode)
    this.bubbleUp()
  }

  bubbleUp () {
    let idx = this.values.length - 1
    const element = this.values[idx]

    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2)
      const parent = this.values[parentIdx]
      if (element.priority >= parent.priority) break
      this.values[parentIdx] = element
      this.values[idx] = parent
      idx = parentIdx
    }
  }

  dequeue () {
    const min = this.values[0]
    const end = this.values.pop()
    if (this.values.length > 0) {
      this.values[0] = end
      this.sinkDown()
    }
    return min
  }

  sinkDown () {
    let idx = 0
    const length = this.values.length
    const element = this.values[0]
    while (true) {
      const leftChildIdx = 2 * idx + 1
      const rightChildIdx = 2 * idx + 2
      let leftChild, rightChild
      let swap = null

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx]
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx]
        if (
          (swap === null && rightChild.priority < element.priority) ||
                (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx
        }
      }
      if (swap === null) break
      this.values[idx] = this.values[swap]
      this.values[swap] = element
      idx = swap
    }
  }
}

// Dijkstra's algorithm only works on a weighted graph.
class WeightedGraph {
  adjacencyList: any;
  constructor () {
    this.adjacencyList = {}
  }

  addVertex (vertex: any) {
    const id = vertex.id
    if (!this.adjacencyList[id]) this.adjacencyList[id] = []
  }

  // weight = distance
  addEdge (vertex1: any, vertex2: any, weight: any) {
    this.adjacencyList[vertex1]?.push({ node: vertex2, weight })
    this.adjacencyList[vertex2]?.push({ node: vertex1, weight })
  }

  Dijkstra (start: any, finish: any) {
    const nodes = new PriorityQueue()
    const distances:any = {}
    const previous: any = {}
    const path = [] // to return at end
    let smallest

    // build up initial state
    for (const vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0
        nodes.enqueue(vertex, 0)
      } else {
        distances[vertex] = Infinity
        nodes.enqueue(vertex, Infinity)
      }

      previous[vertex] = null
    }

    // as long as there is something to visit
    while (nodes.values.length) {
      smallest = nodes.dequeue().val
      if (smallest === finish) {
        // WE ARE DONE
        // BUILD UP PATH TO RETURN AT END
        while (previous[smallest]) {
          path.push(smallest)
          smallest = previous[smallest]
        }
        break
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (const neighbor in this.adjacencyList[smallest]) {
          // find neighboring node
          const nextNode = this.adjacencyList[smallest][neighbor]
          // calculate new distance to neighboring node
          const candidate = distances[smallest] + nextNode.weight
          const nextNeighbor = nextNode.node
          if (candidate < distances[nextNeighbor]) {
            // updating new smallest distance to neighbor
            distances[nextNeighbor] = candidate
            // updating previous - How we got to neighbor
            previous[nextNeighbor] = smallest
            // enqueue in priority queue with new priority
            nodes.enqueue(nextNeighbor, candidate)
          }
        }
      }
    }
    return path.concat(smallest).reverse()
  }
}

const getDistance = (from: any, to: any) => {
  const options = { units: 'meters' }

  return turf.distance(from, to, options)
}

const getShortestPath = (data: any, start: any, finish: any) => {
  const graph = new WeightedGraph()

  const nodes = data

  // add vertices and edges to graph
  for (const node in nodes) {
    // add vertices to routing graph
    graph.addVertex({ id: nodes[node].id })

    // add edges to graph
    Object.entries(nodes[node].adjacentLinks).map((item: any) => {
      graph.addEdge(nodes[node].id, item[0], item[1].distance)
    })
  }

  const path = graph.Dijkstra(start, finish)
  const lineString: any = []

  const routingInstructions = getRoutingInstructions(path, data)

  // map over path to get semantics and stuff
  path.map((node, index) => {
    lineString.push(nodes[node].coords)
  })

  return [lineString, path, routingInstructions, undefined]
}

function getNewDirection (from:any, to: any) {
  let angle = turf.bearing(from, to)

  const directions = ['North', 'NorthEast', 'East', 'SouthEast', 'South', 'SouthWest', 'West', 'NorthWest']
  const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8
  return directions[index]
}

const getSum = (arr: any) => {
  const sum = arr.reduce((accumulator: any, value: any) => {
    return accumulator + value
  }, 0)

  return sum
}

const getInstructionsPerSegment = (nodes: any) => {
  const instructionsPerSegment: any = []

  nodes.map(({ id, type, coords, adjacentLinks }: any, index: any) => {
    const currentNode = { id, type, coords, adjacentLinks }
    const nextNode = nodes[index + 1] ? nodes[index + 1] : undefined

    // check if theres still a next node
    if (!nextNode) return false

    if (nextNode.type === 'Elevator') {
      instructionsPerSegment.push({ direction: 'Elevator', distance: 0, floor: id.split('_')[0] })
    } else {
      const direction = getNewDirection(currentNode.coords, nextNode.coords)
      const distance = getDistance(currentNode.coords, nextNode.coords)

      instructionsPerSegment.push({ direction, distance, floor: id.split('_')[0] })
    }
  })

  return instructionsPerSegment
}

const getCombinedRoutingInstructions = (instructionsPerSegment: any) => {
  const actualInstructions: any = []

  const turningNodesIndices: number[] = [];

  // combine distances if adjacent segments point in same direction
  instructionsPerSegment.map(({ direction, distance, floor }: any, index: any) => {
    // get last added instruction
    const lastAddedInstruction = actualInstructions[actualInstructions.length - 1];

    if (!lastAddedInstruction) {
      actualInstructions.push({ direction, distance })
      return
    }

    // if same direction, add up distances
    if (lastAddedInstruction.direction === direction) {
      lastAddedInstruction.distance = lastAddedInstruction.distance + distance
    } else {
      if (lastAddedInstruction.direction === 'Elevator') {
        actualInstructions.push({ direction, distance })
        lastAddedInstruction.endFloor = floor
      } else {
        turningNodesIndices.push(index + 1);
        actualInstructions.push({ direction, distance })
      }
    }
  })

  return [actualInstructions, turningNodesIndices]
}

const getTurnType = (from: any, to: any) => {
  let instruction

  if (from === 'East' && to === 'North') instruction = 'left'
  if (from === 'East' && to === 'West') instruction = 'Straight'
  if (from === 'East' && to === 'South') instruction = 'right'
  if (from === 'East' && to === 'NorthEast') instruction = 'slight left'
  if (from === 'East' && to === 'SouthEast') instruction = 'slight right'
  if (from === 'East' && to === 'NorthWest') instruction = 'sharp left'
  if (from === 'East' && to === 'SouthWest') instruction = 'sharp right'

  if (from === 'South' && to === 'North') instruction = 'Straight'
  if (from === 'South' && to === 'West') instruction = 'right'
  if (from === 'South' && to === 'East') instruction = 'left'
  if (from === 'South' && to === 'SouthWest') instruction = 'slight right'
  if (from === 'South' && to === 'SouthEast') instruction = 'slight left'
  if (from === 'South' && to === 'NorthEast') instruction = 'sharp left'
  if (from === 'South' && to === 'NorthWest') instruction = 'sharp right'

  if (from === 'West' && to === 'North') instruction = 'right'
  if (from === 'West' && to === 'East') instruction = 'Straight'
  if (from === 'West' && to === 'South') instruction = 'left'
  if (from === 'West' && to === 'SouthWest') instruction = 'slight left'
  if (from === 'West' && to === 'NorthWest') instruction = 'slight right'
  if (from === 'West' && to === 'SouthEast') instruction = 'sharp left'
  if (from === 'West' && to === 'NorthEast') instruction = 'sharp right'

  if (from === 'North' && to === 'NorthEast') instruction = 'slight right'
  if (from === 'North' && to === 'NorthWest') instruction = 'slight left'
  if (from === 'North' && to === 'SouthWest') instruction = 'sharp left'
  if (from === 'North' && to === 'SouthEast') instruction = 'sharp right'
  if (from === 'North' && to === 'East') instruction = 'right'
  if (from === 'North' && to === 'West') instruction = 'left'
  if (from === 'North' && to === 'South') instruction = 'Straight'

  if (from === 'SouthEast' && to === 'South') instruction = 'slight right'
  if (from === 'SouthEast' && to === 'North') instruction = 'sharp left'
  if (from === 'SouthEast' && to === 'East') instruction = 'slight left'
  if (from === 'SouthEast' && to === 'SouthWest') instruction = 'right'
  if (from === 'SouthEast' && to === 'South') instruction = 'slight right'
  if (from === 'SouthEast' && to === 'NorthEast') instruction = 'left'
  if (from === 'SouthEast' && to === 'West') instruction = 'sharp right'

  if (from === 'NorthEast' && to === 'SouthEast') instruction = 'right'
  if (from === 'NorthEast' && to === 'NorthWest') instruction = 'left'
  if (from === 'NorthEast' && to === 'North') instruction = 'slight left'
  if (from === 'NorthEast' && to === 'East') instruction = 'slight right'
  if (from === 'NorthEast' && to === 'West') instruction = 'sharp left'
  if (from === 'NorthEast' && to === 'South') instruction = 'sharp right'

  if (from === 'NorthWest' && to === 'North') instruction = 'slight right'
  if (from === 'NorthWest' && to === 'West') instruction = 'slight left'
  if (from === 'NorthWest' && to === 'South') instruction = 'sharp left'
  if (from === 'NorthWest' && to === 'East') instruction = 'sharp right'
  if (from === 'NorthWest' && to === 'NorthEast') instruction = 'right'
  if (from === 'NorthWest' && to === 'SouthWest') instruction = 'left'

  if (from === 'SouthWest' && to === 'South') instruction = 'slight left'
  if (from === 'SouthWest' && to === 'West') instruction = 'slight right'
  if (from === 'SouthWest' && to === 'SouthEast') instruction = 'left'
  if (from === 'SouthWest' && to === 'NorthWest') instruction = 'right'
  if (from === 'SouthWest' && to === 'North') instruction = 'sharp right'
  if (from === 'SouthWest' && to === 'East') instruction = 'sharp left'

  return instruction
}

const constructFinalRoutingInstructions = (distancesSum: any, timeToTravel: any, instructions: any, nodes: any, turningNodesIndices: number[]) => {
  const { id: startId } = nodes[0]
  const { id: endId } = nodes[nodes.length - 1]
  let elevator = false
  const floorChanges: any = [];
  const turningNodes: any = {}

  const finalTextInstructions = [`Start at ${startId}`]

  nodes.map(({ id }: any) => floorChanges.push(id.split('_')[0]))

  instructions.map(({ direction, distance, endFloor }: any, index: any) => {
    const nextInstruction = instructions[index + 1]

    if (direction === 'Elevator') {
      elevator = true
      finalTextInstructions.push(`Use the elevator to floor ${endFloor}`)
    } else {
      finalTextInstructions.push(`Follow the path for ${distance.toFixed(1)} meters`)
      const turnType = getTurnType(direction, nextInstruction?.direction)
      
      const currentTurnNode = turningNodesIndices.shift();
      if (currentTurnNode) turningNodes[currentTurnNode] = turnType;

      turnType && finalTextInstructions.push(`Turn ${turnType}`)
    }
  })

  finalTextInstructions.push(`You arrived at ${endId}`)

  // @ts-ignore
  const uniqueFloors = [...new Set(floorChanges)]

  const data = {
    finalTextInstructions,
    distancesSum,
    timeToTravel,
    floorChangeWithStairsOrElevator: elevator ? 'elevator' : 'stairs',
    turningNodes
  }

  if (uniqueFloors.length > 0) {
    // @ts-ignore
    data.floors = uniqueFloors
  }

  return data
}

const getRoutingInstructions = (path: any, data: any) => {
  const nodes: any = []

  // get actual graph nodes
  path.map((id: any) => nodes.push(data[id]))

  const instructionsPerSegment = getInstructionsPerSegment(nodes)
  const [actualInstructions, turningNodesIndices] = getCombinedRoutingInstructions(instructionsPerSegment)

  const distances = actualInstructions.map((i: any) => i.distance)
  const distancesSum = getSum(distances).toFixed(2)

  // converted to minutes
  const timeToTravel = (distancesSum / 1.3) / 60

  const finalInstructions = constructFinalRoutingInstructions(distancesSum, timeToTravel.toFixed(1), actualInstructions, nodes, turningNodesIndices)

  return finalInstructions
}

module.exports = { getShortestPath }

