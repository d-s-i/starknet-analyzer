"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventAnalyzer = void 0;
const SwapAnalyzer_1 = require("./SwapAnalyzer");
const BlockOrganizer_1 = require("../organizers/BlockOrganizer");
const helpers_1 = require("../helpers");
class EventAnalyzer extends SwapAnalyzer_1.SwapAnalyzer {
    constructor(provider, msBetweenCallQueries) {
        super(provider);
        this._msBetweenCallQueries = msBetweenCallQueries;
    }
    async analyzeEventsInBlock(blockNumber) {
        const blockAnalyzer = new BlockOrganizer_1.BlockOrganizer(this.provider, this._msBetweenCallQueries);
        const _block = await this.provider.getBlock(blockNumber);
        const block = (0, helpers_1.forceCast)(_block);
        const transactions = await blockAnalyzer.organizeTransactions(block);
        let _swappers = {};
        let _transfers = {};
        for (const tx of transactions) {
            for (const event of tx.events) {
                if (event.name === "Swap") {
                    const organizedSwap = await this.analyzeSwap(event);
                    _swappers = super.populateSwappersObject(_swappers, organizedSwap);
                }
                if (event.name === "Transfer") {
                    const organizedTransfer = await this.analyzeTransfer(tx, event);
                    _transfers = super.populateTransfersObject(_transfers, organizedTransfer);
                }
            }
        }
        super.populateSwappersPerBlock(blockNumber, _swappers);
        super.populateTransfersPerBlock(blockNumber, _transfers);
        return { swaps: super.swappersPerBlock[blockNumber], transfers: super.transfersPerBlock[blockNumber] };
    }
}
exports.EventAnalyzer = EventAnalyzer;
//# sourceMappingURL=EventAnalyzer.js.map