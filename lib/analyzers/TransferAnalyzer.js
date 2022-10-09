"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferAnalyzer = void 0;
const ethers_1 = require("ethers");
const QueryHelper_1 = require("./QueryHelper");
class TransferAnalyzer extends QueryHelper_1.QueryHelper {
    constructor(provider) {
        super(provider);
        this._transfersPerBlock = {};
    }
    async analyzeTransfersInBlock(transactions) {
        let _transfers = {};
        for (const tx of transactions) {
            for (const event of tx.events) {
                if (event.name === "Transfer") {
                    const decodedTransfer = await this.analyzeTransfer(tx, event);
                    _transfers = this.populateTransfersObject(_transfers, decodedTransfer);
                }
            }
        }
        return _transfers;
    }
    async analyzeTransfer(transaction, event) {
        const from = event.calldata[0].value;
        const to = event.calldata[1].value;
        const value = ethers_1.BigNumber.from(event.calldata[2].value.low).add(event.calldata[2].value.high);
        const { symbol, decimals } = await this.getSymbolAndDecimalOfToken(event.transmitterContract);
        return { from, to, value, hash: transaction.hash, symbol, decimals };
    }
    async getSymbolAndDecimalOfToken(tokenAddress) {
        const [_symbol, _decimals] = await super.getSymbolsAndDecimalsOfTokens([tokenAddress]);
        const symbol = _symbol;
        const decimals = +_decimals;
        return { symbol, decimals };
    }
    populateTransfersPerBlock(blockNumber, transfersObj) {
        this._transfersPerBlock[blockNumber] = transfersObj;
    }
    populateTransfersObject(transfers, { from, to, value, hash, symbol, decimals }) {
        let _transfers = transfers;
        _transfers[from] = this._populateSentTransfers(transfers[from], { from, to, value, hash, symbol, decimals });
        _transfers[to] = this._populateReceivedTransfers(transfers[to], { from, to, value, hash, symbol, decimals });
        return _transfers;
    }
    _populateSentTransfers(transfersObj, value) {
        if (!transfersObj || !transfersObj.sent) {
            if (!transfersObj)
                transfersObj = { received: undefined, sent: undefined };
            transfersObj = {
                sent: [value],
                received: transfersObj.received
            };
        }
        else {
            transfersObj.sent.push(value);
        }
        return transfersObj;
    }
    _populateReceivedTransfers(transfersObj, value) {
        if (!transfersObj || !transfersObj.received) {
            if (!transfersObj)
                transfersObj = { received: undefined, sent: undefined };
            transfersObj = {
                received: [value],
                sent: transfersObj.sent
            };
        }
        else {
            transfersObj.received.push(value);
        }
        return transfersObj;
    }
    get transfersPerBlock() {
        return this._transfersPerBlock;
    }
}
exports.TransferAnalyzer = TransferAnalyzer;
//# sourceMappingURL=TransferAnalyzer.js.map