import { BigNumber } from "ethers";
import {
    InvokeFunctionTransaction,
    Provider,
    RawCalldata
} from "starknet";

import { callArrayStructLength } from "../helpers/constants";
import {
    FunctionCall,
    CallArray
} from "../types/organizedStarknet";
import { ContractCallAnalyzer } from "./ContractCallAnalyzer";

export class TransactionCallAnalyzer {

    private _provider: Provider;
    private _contractCallAnalyzers: { [address: string]: ContractCallAnalyzer };
    
    constructor(provider: Provider) {
        this._provider = provider;
        this._contractCallAnalyzers = {};
    }
    
    async getCalldataPerCallFromTx(transaction: InvokeFunctionTransaction) {
        const { callArray, rawFnCalldata } = TransactionCallAnalyzer.destructureFunctionCalldata(transaction);
        try {
            const functionCalls = await this.getCalldataPerCall(callArray, rawFnCalldata);
        
            return functionCalls as FunctionCall[];
        } catch(error) {
            return undefined;
        }
    }

    async getCalldataPerCall(
        callArray: CallArray[],
        fullTxCalldata: BigNumber[]
    ) {
        let rawCalldataIndex = 0;
        let functionCalls = [];
        for(const call of callArray) {
            const contractCallAnalyzer = await this.getContractAnalyzer(call.to.toHexString());
    
            const { subcalldata, endIndex } = contractCallAnalyzer.organizeFunctionInput(
                call.selector.toHexString(), 
                fullTxCalldata, 
                rawCalldataIndex, 
            );
            if(!endIndex && endIndex !== 0) {
                throw new Error(`BlockAnalyzer::getCalldataPerCall - No endIndex returned (endIndex: ${endIndex})`);
            }
            rawCalldataIndex = endIndex;
            functionCalls.push({
                name: contractCallAnalyzer.getFunctionAbiFromSelector(call.selector.toHexString()).name,
                to: call.to,
                calldata: subcalldata
            });
        }
        return functionCalls;
    }
    
    async getContractAnalyzer(
        address: string
    ) {
        // store contract to avoid fetching the same contract twice for the same function call
        if(!this.contractCallAnalyzers[address]) {
            this.contractCallAnalyzers[address] = await new ContractCallAnalyzer(address).initialize(this.provider);
            return this.contractCallAnalyzers[address];
        } else {
            return this.contractCallAnalyzers[address];
        }
    
    }
    
    /**
     * @dev - Transactions have:
     * 1) An array of contracts to call
     * 2) The arguments of each contract call
     * @returns an organized object of a transaction calldata
     */
    static destructureFunctionCalldata(tx: InvokeFunctionTransaction) {
        if(!tx.calldata) {
            console.log("TransactionAnalyzer::destructureFunctionCalldata - Calldata of tx is undefined, tx: ", tx);
            throw new Error(
                `TransactionAnalyzer::destructureFunctionCalldata - Calldata of tx is undefined (calldata: ${tx.calldata})`
            );
        };

        const callArray = this._getCallArrayFromTx(tx);

        const offset = (callArray.length * callArrayStructLength) + 1;
        const rawFnCalldata = this._getRawFunctionCalldataFromTx(tx, offset);

        const nonce = tx.calldata[tx.calldata.length - 1];

        return { callArray, rawFnCalldata, nonce };
    }

    static _getCallArrayFromTx(tx: InvokeFunctionTransaction) {
        let callArrayLength = BigNumber.from(tx.calldata![0]).toNumber();
        let callArray = [];
        // offset i by 1 so that is start at the `call_array` first value, and not at `call_array_len`
        // see the `__execute__` function's args at https://github.com/OpenZeppelin/cairo-contracts/blob/main/src/openzeppelin/account/Account.cairo
        for(let i = 1; i < callArrayLength * callArrayStructLength; i = i + callArrayStructLength) {
            callArray.push({
                to: BigNumber.from(tx.calldata![i]),
                selector: BigNumber.from(tx.calldata![i + 1]),
                dataOffset: BigNumber.from(tx.calldata![i + 2]),
                dataLen: BigNumber.from(tx.calldata![i + 3]),
            });
        }

        return callArray;
    }

    static _getRawFunctionCalldataFromTx(tx: InvokeFunctionTransaction, offset: number) {
        const calldataLength = BigNumber.from(tx.calldata![offset]).toNumber();
        let fnCalldata = [];
        for(let j = offset + 1; j <= calldataLength + offset; j++) {
            fnCalldata.push(BigNumber.from(tx.calldata![j]));
        }

        return fnCalldata;
    }

    get provider() {
        return this._provider;
    }

    get contractCallAnalyzers() {
        return this._contractCallAnalyzers;
    }
}