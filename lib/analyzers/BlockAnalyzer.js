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
const ContractCallAnalyzer_1 = require("./ContractCallAnalyzer");
const helpers_1 = require("../helpers/helpers");
class BlockAnalyzer extends TransactionCallAnalyzer_1.TransactionCallAnalyzer {
    constructor(provider) {
        super(provider);
    }
    organizeTransactions(block) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = block.transactions;
            const receipts = block.transaction_receipts;
            let organizedTransactions = [];
            let contracts = {};
            for (const receipt of receipts) {
                const tx = transactions[receipt.transaction_index];
                let events = [];
                let functionCalls;
                for (const event of receipt.events) {
                    // const contractCallAnalyzer = await new ContractCallAnalyzer(event.from_address).initialize(this.provider);
                    if (!contracts[event.from_address]) {
                        contracts[event.from_address] = yield new ContractCallAnalyzer_1.ContractCallAnalyzer(event.from_address).initialize(this.provider);
                    }
                    try {
                        const eventCalldata = contracts[event.from_address].organizeEvent(event);
                        if (eventCalldata) {
                            events.push(eventCalldata);
                        }
                    }
                    catch (error) { }
                    try {
                        functionCalls = yield this.getCalldataPerCallFromTx(tx);
                    }
                    catch (error) { }
                    yield (0, helpers_1.sleep)(1000);
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
//# sourceMappingURL=BlockAnalyzer.js.map