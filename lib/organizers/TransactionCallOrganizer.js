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
exports.TransactionCallOrganizer = void 0;
const ethers_1 = require("ethers");
const constants_1 = require("../helpers/constants");
const ReceiptOrganizer_1 = require("./ReceiptOrganizer");
class TransactionCallOrganizer extends ReceiptOrganizer_1.ReceiptOrganizer {
    constructor(provider) {
        super(provider);
    }
    getCalldataPerCallFromTx(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const { callArray, rawFnCalldata } = TransactionCallOrganizer.destructureFunctionCalldata(transaction);
            const functionCalls = yield this.getCalldataPerCall(callArray, rawFnCalldata);
            return functionCalls;
        });
    }
    getCalldataPerCall(callArray, fullTxCalldata) {
        const _super = Object.create(null, {
            getContractOrganizer: { get: () => super.getContractOrganizer }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let rawCalldataIndex = 0;
            let functionCalls = [];
            for (const call of callArray) {
                const contractCallOrganizer = yield _super.getContractOrganizer.call(this, call.to.toHexString());
                const { subcalldata, endIndex } = contractCallOrganizer.organizeFunctionInput(call.selector.toHexString(), fullTxCalldata, rawCalldataIndex);
                if (!endIndex && endIndex !== 0) {
                    throw new Error(`BlockAnalyzer::getCalldataPerCall - No endIndex returned (endIndex: ${endIndex})`);
                }
                rawCalldataIndex = endIndex;
                functionCalls.push({
                    name: contractCallOrganizer.getFunctionAbiFromSelector(call.selector.toHexString()).name,
                    to: call.to,
                    calldata: subcalldata
                });
            }
            return functionCalls;
        });
    }
    /**
     * @dev - Transactions have:
     * 1) An array of contracts to call
     * 2) The arguments of each contract call
     * @returns an organized object of a transaction calldata
     */
    static destructureFunctionCalldata(tx) {
        console.log("tx.calldata", tx.calldata);
        if (!tx.calldata) {
            console.log("TransactionAnalyzer::destructureFunctionCalldata - Calldata of tx is undefined, tx: ", tx);
            throw new Error(`TransactionAnalyzer::destructureFunctionCalldata - Calldata of tx is undefined (calldata: ${tx.calldata})`);
        }
        ;
        const callArray = this._getCallArrayFromTx(tx);
        const offset = (callArray.length * constants_1.callArrayStructLength) + 1;
        const rawFnCalldata = this._getRawFunctionCalldataFromTx(tx, offset);
        const nonce = tx.calldata[tx.calldata.length - 1];
        return { callArray, rawFnCalldata, nonce };
    }
    static _getCallArrayFromTx(tx) {
        let callArrayLength = ethers_1.BigNumber.from(tx.calldata[0]).toNumber();
        let callArray = [];
        // offset i by 1 so that it start at the `call_array` first value, and not at `call_array_len`
        // see the `__execute__` function's args at https://github.com/OpenZeppelin/cairo-contracts/blob/main/src/openzeppelin/account/Account.cairo
        for (let i = 1; i < callArrayLength * constants_1.callArrayStructLength; i = i + constants_1.callArrayStructLength) {
            callArray.push({
                to: ethers_1.BigNumber.from(tx.calldata[i]),
                selector: ethers_1.BigNumber.from(tx.calldata[i + 1]),
                dataOffset: ethers_1.BigNumber.from(tx.calldata[i + 2]),
                dataLen: ethers_1.BigNumber.from(tx.calldata[i + 3]),
            });
        }
        return callArray;
    }
    static _getRawFunctionCalldataFromTx(tx, offset) {
        const calldataLength = ethers_1.BigNumber.from(tx.calldata[offset]).toNumber();
        let fnCalldata = [];
        for (let j = offset + 1; j <= calldataLength + offset; j++) {
            fnCalldata.push(ethers_1.BigNumber.from(tx.calldata[j]));
        }
        return fnCalldata;
    }
}
exports.TransactionCallOrganizer = TransactionCallOrganizer;
//# sourceMappingURL=TransactionCallOrganizer.js.map