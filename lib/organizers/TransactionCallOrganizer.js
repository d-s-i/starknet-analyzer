"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCallOrganizer = void 0;
const starknet_1 = require("starknet");
const constants_1 = require("../helpers/constants");
const ReceiptOrganizer_1 = require("./ReceiptOrganizer");
class TransactionCallOrganizer extends ReceiptOrganizer_1.ReceiptOrganizer {
    constructor(provider, contractCallOrganizer) {
        super(provider, contractCallOrganizer);
    }
    async organizeCalldataOfTx(transaction) {
        const { callArray, rawFnCalldata } = TransactionCallOrganizer.destructureFunctionCalldata(transaction);
        const functionCalls = await this.organizeFunctionCalls(callArray, rawFnCalldata);
        return functionCalls;
    }
    async organizeFunctionCalls(callArray, fullTxCalldata) {
        let rawCalldataIndex = 0;
        let functionCalls = [];
        for (const call of callArray) {
            const contractCallOrganizer = await super.getContractOrganizer((0, starknet_1.addAddressPadding)(call.to.toString()));
            const { subcalldata, endIndex } = contractCallOrganizer.organizeFunctionInput(call.selector.toString(16), fullTxCalldata, rawCalldataIndex);
            if (!endIndex && endIndex !== 0) {
                throw new Error(`TransactionCallOrganizer::organizeFunctionCalls - No endIndex returned (endIndex: ${endIndex})`);
            }
            rawCalldataIndex = endIndex;
            functionCalls.push({
                name: contractCallOrganizer.getFunctionAbiFromSelector(call.selector.toString(16)).name,
                to: call.to,
                calldata: subcalldata
            });
        }
        return functionCalls;
    }
    /**
     * @dev - Transactions have:
     * 1) An array of contracts to call
     * 2) The arguments of each contract call
     * @returns an organized object of a transaction calldata
     */
    static destructureFunctionCalldata(tx) {
        if (!tx.calldata) {
            console.log("TransactionAnalyzer::destructureFunctionCalldata - Calldata of tx is undefined, tx: ", tx);
            throw new Error(`TransactionAnalyzer::destructureFunctionCalldata - Calldata of tx is undefined (calldata: ${tx.calldata})`);
        }
        ;
        const callArray = this._getCallArrayFromTx(tx);
        const offset = (callArray.length * constants_1.callArrayStructLength) + 1;
        const rawFnCalldata = this._getRawFunctionCalldataFromTx(tx, offset);
        const nonce = BigInt(tx.calldata[tx.calldata.length - 1]);
        return { callArray, rawFnCalldata, nonce };
    }
    /**
     * @notice The call array is an array containing information about the call being made
     * @param tx: An invoke function transaction as you get when you query a tx from the starknetjs defaultProvider
     * @returns The Call array (being { to, selector, dataOffset, dataLen })
     */
    static _getCallArrayFromTx(tx) {
        let callArrayLength = +BigInt(tx.calldata[0]).toString();
        let callArray = [];
        // offset i by 1 so that it start at the `call_array` first value, and not at `call_array_len`
        // see the `__execute__` function's args at https://github.com/OpenZeppelin/cairo-contracts/blob/main/src/openzeppelin/account/Account.cairo
        for (let i = 1; i < callArrayLength * constants_1.callArrayStructLength; i = i + constants_1.callArrayStructLength) {
            callArray.push({
                to: BigInt(tx.calldata[i]),
                selector: BigInt(tx.calldata[i + 1]),
                dataOffset: BigInt(tx.calldata[i + 2]),
                dataLen: BigInt(tx.calldata[i + 3]),
            });
        }
        return callArray;
    }
    /**
     * @notice A starknet transaction calldata is made of ([CallArray, Calldata]) with the CallArray containing data about the call and the Calldata being the calldata of the call
     * @param tx: An invoke function transaction as you get when you query a tx from the starknetjs defaultProvider
     * @param offset: A number telling where we should start reading the calldata (in case there are many calls and many calldata for example)
     * @returns The calldata of the given call
     */
    static _getRawFunctionCalldataFromTx(tx, offset) {
        const calldataLength = +BigInt(tx.calldata[offset]).toString();
        let fnCalldata = [];
        for (let j = offset + 1; j <= calldataLength + offset; j++) {
            fnCalldata.push(BigInt(tx.calldata[j]));
        }
        return fnCalldata;
    }
    static getSpecificArgFromFunctionCall(argName, { calldata }) {
        for (const organizedCalldata of calldata) {
            if (organizedCalldata.name === argName) {
                return organizedCalldata.value;
            }
        }
        throw new Error(`PlayerAnalyzer::_getCalldataFromFunctionName - No calldata found for this function name in calldata (functionName: ${argName})`);
    }
}
exports.TransactionCallOrganizer = TransactionCallOrganizer;
//# sourceMappingURL=TransactionCallOrganizer.js.map