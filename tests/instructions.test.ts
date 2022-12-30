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

  test('Uses stairs', () => {
    const graph = new IndoorGraphs(data, { routingOptions: { preferElevator: false }, filter: {} })
    const [coordinates, path, instructions, error] = graph.getRoute('UG_t1', 'OG1_t3')

    const finalTextInstructions = instructions.finalTextInstructions;
    let usesElevator = false;

    finalTextInstructions.map((text: string) => {
      if (text.includes("elevator")) usesElevator = true;
    })

    expect(usesElevator).toBe(false)
  })
})

