import { TransactionCallOrganizer } from "../../src/organizers/TransactionCallOrganizer";
import { INVOKE_TX, provider, testTransactionCallOrganizer } from "../index.test";

testTransactionCallOrganizer && describe("TransactionCallOrganizer", function() {

    it("`organizeCalldataOfTx` - Organize calldata into readable object for every contract call made in the transaction v0", async function() {
        const txCallOrganizer = new TransactionCallOrganizer(provider);
        const tx = await provider.getTransaction("0x18aed1624bbb0cd939b33f311b2461efbb87fa98a54ae0ea1597579c42e845a");
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