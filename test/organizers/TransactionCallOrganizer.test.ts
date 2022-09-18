import { TransactionCallOrganizer } from "../../src/organizers/TransactionCallOrganizer";
import { INVOKE_TX_HASH_V0, INVOKE_TX_HASH_V1, provider, testTransactionCallOrganizer } from "../index.test";

testTransactionCallOrganizer && describe("TransactionCallOrganizer", function() {

    it("`organizeCalldataOfTx` - Organize calldata into readable object for every contract call made in the transaction v0", async function() {
        const txCallOrganizer = new TransactionCallOrganizer(provider);
        const tx = await provider.getTransaction(INVOKE_TX_HASH_V0);
        const organizedCalldata = await txCallOrganizer.organizeCalldataOfTx(tx);
        console.log("organizedCalldata", organizedCalldata);
    });

    it("`organizeCalldataOfTx` - Organize calldata into readable object for every contract call made in the transaction v1", async function() {
        const txCallOrganizer = new TransactionCallOrganizer(provider);
        const tx = await provider.getTransaction(INVOKE_TX_HASH_V1);
        const organizedCalldata = await txCallOrganizer.organizeCalldataOfTx(tx);
        console.log("organizedCalldata", organizedCalldata);
    });

});