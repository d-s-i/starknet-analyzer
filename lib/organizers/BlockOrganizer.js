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
            getCalldataPerCallFromTx: { get: () => super.getCalldataPerCallFromTx }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = block.transactions;
            const receipts = block.transaction_receipts;
            let organizedTransactions = [];
            for (const receipt of receipts) {
                if (transactions[receipt.transaction_index].type !== "INVOKE_FUNCTION")
                    continue;
                const tx = transactions[receipt.transaction_index];
                let events = [];
                let functionCalls = [];
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
                    functionCalls = yield _super.getCalldataPerCallFromTx.call(this, tx);
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
                    origin: tx.contract_address,
                    entrypointSelector: tx.entry_point_selector,
                    type: "ORGANIZED_INVOKE_FUNCTION"
                });
            }
            return organizedTransactions;
        });
    }
}
exports.BlockOrganizer = BlockOrganizer;
//# sourceMappingURL=BlockOrganizer.js.map