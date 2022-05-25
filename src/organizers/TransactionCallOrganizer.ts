import { BigNumber } from "ethers";
import {
    InvokeFunctionTransaction,
    Provider
} from "starknet";

import { callArrayStructLength } from "../helpers/constants";
import {
    FunctionCall,
    CallArray
} from "../types/organizedStarknet";
import { ContractCallOrganizer } from "./ContractCallOrganizer";

export class TransactionCallOrganizer {

    private _provider: Provider;
    private _contractCallOrganizers: { [address: string]: ContractCallOrganizer };
    
    constructor(provider: Provider) {
        this._provider = provider;
        this._contractCallOrganizers = {};
    }
    
    async getCalldataPerCallFromTx(transaction: InvokeFunctionTransaction) {
        try {
            const { callArray, rawFnCalldata } = TransactionCallOrganizer.destructureFunctionCalldata(transaction);
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
            const contractCallOrganizer = await this.getContractOrganizer(call.to.toHexString());
    
            const { subcalldata, endIndex } = contractCallOrganizer.organizeFunctionInput(
                call.selector.toHexString(), 
                fullTxCalldata, 
                rawCalldataIndex, 
            );
            if(!endIndex && endIndex !== 0) {
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
    }
    
    async getContractOrganizer(
        address: string
    ) {
        // store contract to avoid fetching the same contract twice for the same function call
        if(!this.contractCallOrganizers[address]) {
            this._contractCallOrganizers[address] = await new ContractCallOrganizer(address).initialize(this.provider);
            return this.contractCallOrganizers[address];
        } else {
            return this.contractCallOrganizers[address];
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
        // offset i by 1 so that it start at the `call_array` first value, and not at `call_array_len`
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

    get contractCallOrganizers() {
        return this._contractCallOrganizers;
    }
}