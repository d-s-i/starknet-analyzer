import { defaultProvider } from "starknet";
import { getSelectorFromName } from "starknet/dist/utils/hash";
import { InvokeTransactionReceiptResponse } from "starknet/types";
import { ContractCallOrganizer } from "../../src/organizers/ContractCallOrganizer";
import { testContractCallOrganizer, provider, INVOKE_TX_HASH_V0, INVOKE_TX_HASH_V1 } from "../index.test";

testContractCallOrganizer && describe("ContractCallOrganizer", function() {

    it("`organizeContractAbiFromAddress` - Fetch ABI from an address", async function() {
        const ADDR = "0xfa904eea70850fdd44e155dcc79a8d96515755ed43990ff4e7e7c096673e7";
        const res = await ContractCallOrganizer.organizeContractAbiFromContractAddress(ADDR, defaultProvider);
        console.log("res", res);
    });

    it("`getFullContractAbi`- Fecth ABI for a proxy", async function() { // Doesn't work yet, need the `getClass` method
        const res = await ContractCallOrganizer.getFullContractAbi("0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", provider);

        console.log("res", res);
    });

    // it("`organizeCalldata` - Organize function input (= calldata) into readable calldata for a tx version 0", async function() {

    //     const tx = await provider.getTransaction(INVOKE_TX_HASH_V0);
        
    //     const contractCallOrganizer = await new ContractCallOrganizer(tx.contract_address!).initialize(provider);

    //     const functionInput = await contractCallOrganizer.organizeCalldata(tx.entry_point_selector!, tx.calldata);

    //     console.log("functionInput", functionInput);
        
    // });

    // it("`organizeCalldata` - Organize function input into readable calldata for a tx version 1", async function() {

    //     const tx = await provider.getTransaction(INVOKE_TX_HASH_V1);
    //     console.log("tx", tx);
        
    //     const contractCallOrganizer = await new ContractCallOrganizer(tx.contract_address!).initialize(provider);

    //     const functionInput = await contractCallOrganizer.organizeCalldata(tx.entry_point_selector!, tx.calldata);

    //     console.log("functionInput", functionInput);
        
    // });

    // // it("`organizeFunctionOutput` - Organize function output into readable calldata", function() {
    // //     throw new Error(`Duplicate method from organizeCalldata, method removed for now`);
    // // });

    // it("`organizeEvent` - Organize event into readable calldata", async function() {
    //     const receipt = await provider.getTransactionReceipt(INVOKE_TX_HASH_V0) as InvokeTransactionReceiptResponse; // v0 and v1 receipts are the same
    //     const contractCallOrganizer = await new ContractCallOrganizer(receipt.events[0].from_address).initialize(provider);

    //     const organizedEvents = await contractCallOrganizer.organizeEvent(receipt.events[0]);

    //     console.log("organizedEvents", organizedEvents);
    // });
    
});