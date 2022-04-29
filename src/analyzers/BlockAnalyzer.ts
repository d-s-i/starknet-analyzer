import { 
    Provider, 
    InvokeFunctionTransaction
} from "starknet";

import { 
    Event,
    GetBlockResponse,
    TransactionReceipt
} from "../types/rawStarknet";
import {
    OrganizedEvent,
    FunctionCall,
    OrganizedTransaction
} from "../types/organizedStarknet";
import { TransactionCallAnalyzer } from "./TransactionCallAnalyzer";
import { ContractCallAnalyzer } from "./ContractCallAnalyzer";
import { sleep } from "../helpers/helpers";

export class BlockAnalyzer extends TransactionCallAnalyzer {

    constructor(provider: Provider) {
        super(provider);
    }

    async organizeTransactions(block: GetBlockResponse) {
        const transactions = block.transactions;
        const receipts = block.transaction_receipts as TransactionReceipt[];

        let organizedTransactions: OrganizedTransaction[] = [];
        let contracts: { [key: string]: ContractCallAnalyzer } = {};
        for(const receipt of receipts) {
            const tx = transactions[receipt.transaction_index] as InvokeFunctionTransaction;
            let events: OrganizedEvent[] = [];
            let functionCalls: FunctionCall[] | undefined;
            for(const event of receipt.events) {
                // const contractCallAnalyzer = await new ContractCallAnalyzer(event.from_address).initialize(this.provider);
                if(!contracts[event.from_address]) {
                    contracts[event.from_address] = await new ContractCallAnalyzer(event.from_address).initialize(this.provider);
                }
                try {
                    const eventCalldata = contracts[event.from_address].organizeEvent(event);
                    if(eventCalldata) {
                        events.push(eventCalldata);
                    }
                } catch(error) {}

                try {
                    functionCalls = await this.getCalldataPerCallFromTx(tx);
                } catch(error) {}
                await sleep(1000);
            }
            organizedTransactions.push({
                hash: receipt.transaction_hash,
                events,
                functionCalls,
                origin: tx.contract_address,
                entrypointSelector: tx.entry_point_selector,
                type: tx.type
            });
        }

        return organizedTransactions;
    
    }
}