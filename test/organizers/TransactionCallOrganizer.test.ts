import { TransactionCallOrganizer } from "../../src/organizers/TransactionCallOrganizer";
import { INVOKE_TX, provider, testTransactionCallOrganizer } from "../index.test";

testTransactionCallOrganizer && describe("TransactionCallOrganizer", function() {

    it("`organizeCalldataOfTx` - Organize calldata into readable object for every contract call made in the transaction v0", async function() {
        const txCallOrganizer = new TransactionCallOrganizer(provider);
        const tx = await provider.getTransaction("0x321d1b1820cf867d42331239bfe80d2c577c73cbb27a4953c4062f3341ed830");
        console.log("tx", tx)
        const organizedCalldata = await txCallOrganizer.organizeCalldataOfTx(tx);
        console.log("organizedCalldata", organizedCalldata);
    });

    // it("`organizeCalldataOfTx` - Organize calldata into readable object for every contract call made in the transaction v1", async function() {
    //     const txCallOrganizer = new TransactionCallOrganizer(provider);
    //     const tx = await provider.getTransaction(INVOKE_TX_HASH_V1);
    //     const organizedCalldata = await txCallOrganizer.organizeCalldataOfTx(tx);
    //     console.log("organizedCalldata", organizedCalldata);
    // });

});