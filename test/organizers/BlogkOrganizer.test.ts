import { testBlockOrganizer, provider, blockOrganizer } from "../index.test";

testBlockOrganizer && describe("BlockOrganizer", async function() {

    it("Organize transactions in block", async function() {
        const blockNUmber = 338059;
        const block = await provider.getBlock(blockNUmber);
        console.log("block", block);

        const organizedTransactions = await blockOrganizer.organizeTransactions(block);
        console.log("organizedTransactions", organizedTransactions);
    });
    
});