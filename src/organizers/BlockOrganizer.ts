import { 
    Provider, 
    InvokeFunctionTransaction
} from "starknet";

import { 
    GetBlockResponse,
    TransactionReceipt
} from "../types/rawStarknet";
import {
    OrganizedEvent,
    FunctionCall,
    OrganizedTransaction,
    ContractCallOrganizerMap
} from "../types/organizedStarknet";
import { StandardProvider } from "../types";
import { TransactionCallOrganizer } from "./TransactionCallOrganizer";
import { sleep } from "../helpers/helpers";

export class BlockOrganizer extends TransactionCallOrganizer {

    private _msBetweenCallQueries: number;
    
    constructor(provider: StandardProvider<Provider>, msBetweenCallQueries?: number, contractCallOrganizer?: ContractCallOrganizerMap) {
        super(provider, contractCallOrganizer);
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
            let functionCalls: FunctionCall[] | undefined = [];
            try {
                events = await super.getEventsFromReceipt(receipt);
            } catch(error) {
                // console.log("----------- ERROR -----------");
                // console.log(`EVENT ERROR on tx ${receipt.transaction_hash}`, error);

                // console.log("----------- EVENTS -----------");
                // console.log(receipt.events);
            }
            try {
                functionCalls = await super.getCalldataPerCallFromTx(tx);
            } catch(error) {
                // console.log("----------- ERROR -----------");
                // console.log(`FUNCTION ERROR on tx ${receipt.transaction_hash}`, error);

                // console.log("----------- CALLDATA -----------");
                // console.log(tx.calldata);
            }
            this._msBetweenCallQueries && await sleep(this._msBetweenCallQueries);

            organizedTransactions.push({
                hash: receipt.transaction_hash,
                events,
                functionCalls,
                origin: tx.contract_address,
                entrypointSelector: tx.entry_point_selector,
                type: "ORGANIZED_INVOKE_FUNCTION"
            });
        }

        return organizedTransactions;
    }
}