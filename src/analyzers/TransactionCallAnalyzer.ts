import { BigNumber } from "ethers";
import {
    InvokeFunctionTransaction,
    Provider
} from "starknet";

import { callArrayStructLength } from "../lib/constants";
import { 
    Event,
} from "../types/rawStarknet";
import {
    FunctionCall,
    CallArray,
} from "../types/organizedStarknet";
import { ContractCallAnalyzer } from "./ContractCallAnalyzer";

export class TransactionCallAnalyzer {

    private _provider: Provider
    
    constructor(provider: Provider) {
        this._provider = provider;
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

    // not sure if it is useful there, it's quite similar to `organizeEvent` at `ContractCallAnalyzer`
    async getEventOutput(event: Event) {
        const { structs, functions, events } = await ContractCallAnalyzer.getContractAbi(event.from_address, this.provider);
        const contractCallAnalyzer = new ContractCallAnalyzer(
            event.from_address,
            structs,
            functions,
            events
        );

        try {
            const structuredEvent = await contractCallAnalyzer.organizeEvent(event);
            return structuredEvent;
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
        let contractAnalyzers: { [key: string]: ContractCallAnalyzer } = {};
        for(const call of callArray) {
            const { contractAnalyzer, newContractAnalyzer } = await this.getContractAnalyzer(call.to.toHexString(), contractAnalyzers);
            contractAnalyzers = newContractAnalyzer; 
    
            const { subcalldata, endIndex } = contractAnalyzer.organizeFunctionInput(
                call.selector.toHexString(), 
                fullTxCalldata, 
                rawCalldataIndex, 
            );
            if(!endIndex && endIndex !== 0) {
                throw new Error(`BlockAnalyzer::getCalldataPerCall - No endIndex returned (endIndex: ${endIndex})`);
            }
            rawCalldataIndex = endIndex;
            functionCalls.push({
                name: contractAnalyzer.getFunctionAbiFromSelector(call.selector.toHexString()).name,
                to: call.to,
                calldata: subcalldata
            });
        }
        return functionCalls;
    }
    
    async getContractAnalyzer(
        address: string, 
        contractAnalyzers: { [key: string]: ContractCallAnalyzer }
    ) {
        // store contract to avoid fetching the same contract twice for the same function call
        if(!contractAnalyzers[address]) {
            const { functions, structs, events } = await ContractCallAnalyzer.getContractAbi(address, this.provider);
            let newContractAnalyzer = contractAnalyzers;
            newContractAnalyzer[address] = new ContractCallAnalyzer(address, structs, functions, events);
            return { contractAnalyzer: newContractAnalyzer[address], newContractAnalyzer };
        } else {
            return { contractAnalyzer: contractAnalyzers[address], newContractAnalyzer: contractAnalyzers };
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
            console.log(tx);
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
        const callArrayLength = BigNumber.from(tx.calldata![0]).toNumber();
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
}