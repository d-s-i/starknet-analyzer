"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockOrganizer = void 0;
const TransactionCallOrganizer_1 = require("./TransactionCallOrganizer");
const helpers_1 = require("../helpers/helpers");
class BlockOrganizer extends TransactionCallOrganizer_1.TransactionCallOrganizer {
    constructor(provider, msBetweenCallQueries, contractCallOrganizer) {
        super(provider, contractCallOrganizer);
        this._msBetweenCallQueries = msBetweenCallQueries || 0;
    }
    organizeTransactions(block) {
        const _super = Object.create(null, {
            getEventsFromReceipt: { get: () => super.getEventsFromReceipt },
            organizeCalldataOfTx: { get: () => super.organizeCalldataOfTx }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const tsHashes = block.transactions;
            let transactions = [];
            let receipts = [];
            for (const hash of tsHashes) {
                const tx = yield this.provider.getTransaction(hash);
                const receipt = yield this.provider.getTransactionReceipt(hash);
                transactions.push(tx);
                receipts.push(receipt);
                yield (0, helpers_1.sleep)(this._msBetweenCallQueries);
            }
            let organizedTransactions = [];
            for (let i = 0; i < transactions.length; i++) {
                const tx = transactions[i];
                const receipt = receipts[i];
                let events = [];
                let functionCalls = [];
                // === tx is not of type INVOKE_FUNCTION
                if (!tx.calldata)
                    continue;
                try {
                    events = yield _super.getEventsFromReceipt.call(this, receipt);
                }
                catch (error) {
                    // console.log("----------- ERROR -----------");
                    // console.log(`EVENT ERROR on tx ${receipt.transaction_hash}`, error);
                    // console.log("----------- EVENTS -----------");
                    // console.log(receipt.events);
                }
                try {
                    functionCalls = yield _super.organizeCalldataOfTx.call(this, tx);
                }
                catch (error) {
                    // console.log("----------- ERROR -----------");
                    // console.log(`FUNCTION ERROR on tx ${receipt.transaction_hash}`, error);
                    // console.log("----------- CALLDATA -----------");
                    // console.log(tx.calldata);
                }
                this._msBetweenCallQueries && (yield (0, helpers_1.sleep)(this._msBetweenCallQueries));
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
        });
    }
}
exports.BlockOrganizer = BlockOrganizer;
//# sourceMappingURL=BlockOrganizer.js.map