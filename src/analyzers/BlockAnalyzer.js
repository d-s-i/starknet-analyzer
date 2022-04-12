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
exports.BlockAnalyzer = void 0;
const TransactionCallAnalyzer_1 = require("./TransactionCallAnalyzer");
const helpers_1 = require("../lib/helpers");
class BlockAnalyzer extends TransactionCallAnalyzer_1.TransactionCallAnalyzer {
    constructor(provider) {
        super(provider);
    }
    organizeTransactions(block) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = block.transactions;
            const receipts = block.transaction_receipts;
            let organizedTransactions = [];
            for (const receipt of receipts) {
                const tx = transactions[receipt.transaction_index];
                let events = [];
                let functionCalls;
                for (const event of receipt.events) {
                    // const eventCalldata = await this.getEventOutput(event);
                    const contractCallAnalyzer = yield this.getContractAnalyzer(event.from_address);
                    const eventCalldata = yield contractCallAnalyzer.organizeEvent(event);
                    if (eventCalldata) {
                        events.push(eventCalldata);
                    }
                    functionCalls = yield this.getCalldataPerCallFromTx(tx);
                    yield (0, helpers_1.sleep)(2000);
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
        });
    }
}
exports.BlockAnalyzer = BlockAnalyzer;
