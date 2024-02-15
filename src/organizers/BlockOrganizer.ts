import { 
    ProviderInterface,
    GetBlockResponse,
    InvokeTransactionReceiptResponse
} from "starknet";

import {
    OrganizedEvent,
    FunctionCall,
    OrganizedTransaction,
    ContractCallOrganizerMap
} from "../types/organizedStarknet";
import { TransactionCallOrganizer } from "./TransactionCallOrganizer";
import { sleep } from "../helpers";

export class BlockOrganizer extends TransactionCallOrganizer {

    private _msBetweenCallQueries: number;
    
    constructor(provider: ProviderInterface, msBetweenCallQueries?: number, contractCallOrganizer?: ContractCallOrganizerMap) {
        super(provider, contractCallOrganizer);
        this._msBetweenCallQueries = msBetweenCallQueries || 0;
    }

    async organizeTransactions(block: GetBlockResponse) {
        const tsHashes = block.transactions;

        let transactions = [];
        let receipts = [];
        for(const hash of tsHashes) {
            const tx = await this.provider.getTransaction(hash);
            const receipt = await this.provider.getTransactionReceipt(hash);
            transactions.push(tx);
            receipts.push(receipt);
            await sleep(this._msBetweenCallQueries)
        }

        let organizedTransactions: OrganizedTransaction[] = [];
        for(let i = 0; i < transactions.length; i++) {
            const tx = transactions[i];
            const receipt = receipts[i];
            
            let events: OrganizedEvent[] = [];
            let functionCalls: FunctionCall[] = [];

            // === tx is not of type INVOKE_FUNCTION
            if(!tx.calldata) continue;

            try {
                events = await super.getEventsFromReceipt(receipt as InvokeTransactionReceiptResponse);
            } catch(error) {
                // console.log("----------- ERROR -----------");
                // console.log(`EVENT ERROR on tx ${receipt.transaction_hash}`, error);

                // console.log("----------- EVENTS -----------");
                // console.log(receipt.events);
            }
            try {
                functionCalls = await super.organizeCalldataOfTx(tx);
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
                origin: tx.contract_address || "",
                entrypointSelector: tx.entry_point_selector || "0x15d40a3d6ca2ac30f4031e42be28da9b056fef9bb7357ac5e85627ee876e5ad",
                type: "ORGANIZED_INVOKE_FUNCTION"
            });
        }
        return organizedTransactions;
    }
}