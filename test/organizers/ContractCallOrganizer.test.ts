import { InvokeTransactionReceiptResponse } from "starknet";
import { ContractCallOrganizer } from "../../src/organizers/ContractCallOrganizer";
import { TransactionCallOrganizer } from "../../src/organizers/TransactionCallOrganizer";
import { testContractCallOrganizer, provider, INVOKE_TX } from "../index.test";

testContractCallOrganizer && describe("ContractCallOrganizer", function() {

    // it("`organizeContractAbiFromAddress` - Fetch ABI from an address", async function() {
    //     const ADDR = "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
    //     const res = await ContractCallOrganizer.organizeContractAbiFromContractAddress(ADDR, provider);
    //     console.log("res", res);
    // });

    // it("`getFullContractAbi`- Fecth ABI for a proxy", async function() { // Doesn't work yet, need the `getClass` method
    //     const res = await ContractCallOrganizer.getFullContractAbi(BigInt("0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"), provider);

    //     console.log("res", res);
    // });

    it("`organizeCalldata` - Organize function input (= calldata) into readable calldata", async function() {

        const tx = await provider.getTransaction("0x18aed1624bbb0cd939b33f311b2461efbb87fa98a54ae0ea1597579c42e845a");

        const contractCalls = TransactionCallOrganizer.destructureFunctionCalldata(tx);

        for(let i = 0; i < contractCalls.callArray.length; i++) {
            const contractCallOrganizer = await new ContractCallOrganizer(contractCalls.callArray[i].to).initialize(provider);

            const functionInput = await contractCallOrganizer.organizeFunctionInput(contractCalls.callArray[i].selector, contractCalls.rawFnCalldata);
    
            console.log("functionInput", functionInput);
        }
        
    });

    // it("`organizeCalldata` - Organize function output into readable calldata", async function() {

    //     const tx = await provider.getTransaction(INVOKE_TX);

    //     const contractCalls = TransactionCallOrganizer.destructureFunctionCalldata(tx);
    //     console.log("contractCalls", contractCalls);

    //     for(let i = 0; i < contractCalls.callArray.length; i++) {
    //         const contractCallOrganizer = await new ContractCallOrganizer(contractCalls.callArray[i].to).initialize(provider);

    //         const functionInput = await contractCallOrganizer.organizeFunctionOutput(contractCalls.callArray[i].selector, contractCalls.rawFnCalldata);
    
    //         console.log("functionInput", functionInput);
    //     }
        
    // });

    // it("`organizeEvent` - Organize event into readable calldata", async function() {
    //     const receipt = await provider.getTransactionReceipt("0x18aed1624bbb0cd939b33f311b2461efbb87fa98a54ae0ea1597579c42e845a") as InvokeTransactionReceiptResponse; // v0 and v1 receipts are the same
    //     const contractCallOrganizer = await new ContractCallOrganizer(receipt.events![0].from_address).initialize(provider);

    //     const organizedEvents = await contractCallOrganizer.organizeEvent(receipt.events![0]);

    //     console.log("organizedEvents", organizedEvents);
    // });
    
});