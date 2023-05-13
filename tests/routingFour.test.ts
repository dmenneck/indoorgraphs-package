export {};

const { IndoorGraphs } = require('../dist/index');
const dataFour = require("./graphs/routingFour.json")

describe('Routing: Graph four', () => {
    test('correctly combined node attributes', () => {
        const newGraph = new IndoorGraphs(dataFour, { routingOptions: {}, filter: {} });
        const prodBuild = newGraph.getProductionBuild();
        const nodes = prodBuild.nodes;

        Object.values(prodBuild.nodes).map(({attributes}: any) => {
            expect(typeof attributes).toBe("string")
        })

        // get nodeAttributes keys
        let oneId;
        let twentyTwoId;
        let twoHundredId;

        Object.entries(prodBuild.nodeAttributes).map(([key, {doorWidth}]: any) => {
            if (doorWidth === "1") oneId = key;
            if (doorWidth === "22") twentyTwoId = key;
            if (doorWidth === "200") twoHundredId = key;
        })

        expect(nodes["UG_t1"].attributes).toBe(twentyTwoId)
        expect(nodes["UG_t2"].attributes).toBe(twentyTwoId)
        expect(nodes["UG_t3"].attributes).toBe(twentyTwoId)     
        expect(nodes["UG_t4"].attributes).toBe(oneId)
        expect(nodes["UG_t5"].attributes).toBe(oneId)
        expect(nodes["UG_t6"].attributes).toBe(twoHundredId)

        expect(Object.keys(prodBuild.nodeAttributes).length).toBe(3)
    })
})