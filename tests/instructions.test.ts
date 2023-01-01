export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/elevatorInstruction.json")
const NWGraph = require("./graphs/textInstructions/NW.json")

describe('Correct elevator instructions', () => {
  test('Uses elevator', () => {
    const graph = new IndoorGraphs(data, { routingOptions: { preferElevator: true }, filter: {} })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'OG1_t3')

    const finalTextInstructions = instructions.finalTextInstructions;
    let usesElevator = false;

    finalTextInstructions.map((text: string) => {
      if (text.includes("elevator")) usesElevator = true;
    })

    expect(usesElevator).toBe(true)
  })

  test('Uses stairs over elevator', () => {
    const routingOptions = {
      pathOptions: {},
      doorOptions: {},
      preferElevator: false
    }

    const filter = {} 

    const graph = new IndoorGraphs(data, { routingOptions, filter })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'OG1_t3');

    const finalTextInstructions = instructions.finalTextInstructions;
    expect(error).toBe(undefined)
    expect(instructions.floorChangeWithStairsOrElevator).toBe("stairs")
  })

  test('Uses elevator over stairs', () => {
    const routingOptions = {
      pathOptions: {},
      doorOptions: {},
      preferElevator: true
    }

    const filter = {} 

    const graph = new IndoorGraphs(data, { routingOptions, filter })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'OG1_t3')

    const finalTextInstructions = instructions.finalTextInstructions;
    let usesElevator = false;

    finalTextInstructions.map((text: string) => {
      if (text.includes("elevator")) usesElevator = true;
    })

    expect(usesElevator).toBe(true)
    expect(instructions.floorChangeWithStairsOrElevator).toBe("elevator")

    expect(error).toBe(undefined)
  })
})


describe('Correct routing direction instructions', () => {
  const checkIfMatch = (array: string[], substring: string) => {
    const match = array.find(element => {
      if (element.includes(substring)) {
        return true;
      }
    });

    return match;
  }
 
  const routingOptions = {
    pathOptions: {},
    doorOptions: {},
    preferElevator: true
  }

  const filter = {} 

  // FROM N

  // FROM NE

  // FROM E

  // FROM SE
  test("From SE to S", () => {
    const graph = new IndoorGraphs(NWGraph, { routingOptions, filter })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_1', 'UG_3');

    const finalTextInstructions = instructions.finalTextInstructions;

    const isMatch = checkIfMatch(finalTextInstructions, "sharp left");

    expect(isMatch).toBe("Turn sharp left");
  })

  test("From SE to SW", () => {
    const graph = new IndoorGraphs(NWGraph, { routingOptions, filter })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_1', 'UG_4');

    const finalTextInstructions = instructions.finalTextInstructions;

    const isMatch = checkIfMatch(finalTextInstructions, "left");
    expect(isMatch).toBe("Turn left");
  })

  test("From SE to W", () => {
    const graph = new IndoorGraphs(NWGraph, { routingOptions, filter })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_1', 'UG_5');

    const finalTextInstructions = instructions.finalTextInstructions;

    const isMatch = checkIfMatch(finalTextInstructions, "slight left");
    expect(isMatch).toBe("Turn slight left");
  })

  test("From SE to N", () => {
    const graph = new IndoorGraphs(NWGraph, { routingOptions, filter })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_1', 'UG_7');

    const finalTextInstructions = instructions.finalTextInstructions;

    const isMatch = checkIfMatch(finalTextInstructions, "slight right");
    expect(isMatch).toBe("Turn slight right");
  })

  test("From SE to NE", () => {
    const graph = new IndoorGraphs(NWGraph, { routingOptions, filter })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_1', 'UG_8');

    const finalTextInstructions = instructions.finalTextInstructions;

    const isMatch = checkIfMatch(finalTextInstructions, "right");
    expect(isMatch).toBe("Turn right");
  })

  test("From SE to NE", () => {
    const graph = new IndoorGraphs(NWGraph, { routingOptions, filter })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_1', 'UG_9');

    const finalTextInstructions = instructions.finalTextInstructions;

    const isMatch = checkIfMatch(finalTextInstructions, "sharp right");
    expect(isMatch).toBe("Turn sharp right");
  })

  // FROM S

  // FROM SW

  // FROM W

  // FROM NW
})