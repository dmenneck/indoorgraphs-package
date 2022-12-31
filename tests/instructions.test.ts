export {};

const {IndoorGraphs} = require('../dist/index');
const data = require("./graphs/elevatorInstruction.json")

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
