import { 
    Provider, 
    InvokeFunctionTransaction,
    defaultProvider
} from "starknet";

import { 
    GetBlockResponse,
    TransactionReceipt
} from "../types/rawStarknet";
import {
    OrganizedEvent,
    FunctionCall,
    OrganizedTransaction
} from "../types/organizedStarknet";
import { TransactionCallOrganizer } from "./TransactionCallOrganizer";
import { sleep } from "../helpers/helpers";

export class BlockOrganizer extends TransactionCallOrganizer {

    private _msBetweenCallQueries: number;
    
    constructor(provider: Provider, msBetweenCallQueries?: number) {
        super(provider);
        this._msBetweenCallQueries = msBetweenCallQueries || 0;
    }

    async organizeTransactions(block: GetBlockResponse) {
        const transactions = block.transactions;
        const receipts = block.transaction_receipts as TransactionReceipt[];

        let organizedTransactions: OrganizedTransaction[] = [];
        for(const receipt of receipts) {
            if(transactions[receipt.transaction_index].type !== "INVOKE_FUNCTION") continue;
            const tx = transactions[receipt.transaction_index] as InvokeFunctionTransaction;
            
            let events: OrganizedEvent[] = [];
            let functionCalls: FunctionCall[] | undefined;
            // for(const event of receipt.events) {
            //     const contractAnalyzer = await super.getContractOrganizer(event.from_address);
            //     try {
            //         const eventCalldata = contractAnalyzer.organizeEvent(event);
            //         if(eventCalldata) {
            //             events.push(eventCalldata);
            //         }
            //     } catch(error) {}

            // }
            try {
                events = await super.getEventsFromReceipt(receipt);
            } catch(error) {
                console.log("----------- ERROR -----------");
                console.log(`EVENT ERROR on tx ${receipt.transaction_hash}`, error);

                console.log("----------- EVENTS -----------");
                console.log(receipt.events);

                // console.log("----------- RAW ABI -----------");
                // console.log(await defaultProvider.getCode())
            }
            try {
                functionCalls = await super.getCalldataPerCallFromTx(tx);
            } catch(error) {
                // console.log(`FUNCTION ERROR on tx ${receipt.transaction_hash}`, error);
            }
            this._msBetweenCallQueries && await sleep(this._msBetweenCallQueries);

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