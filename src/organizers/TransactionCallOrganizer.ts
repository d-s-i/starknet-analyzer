import { BigNumber } from "ethers";
import {
    InvokeTransactionResponse,
    ProviderInterface
} from "starknet";

import { callArrayStructLength } from "../helpers/constants";
import {
    FunctionCall,
    CallArray,
    ContractCallOrganizerMap
} from "../types/organizedStarknet";
import  { ReceiptOrganizer } from "./ReceiptOrganizer";
import { getFullSelector } from "../helpers/helpers";

export class TransactionCallOrganizer extends ReceiptOrganizer {

    constructor(provider: ProviderInterface, contractCallOrganizer?: ContractCallOrganizerMap) {
        super(provider, contractCallOrganizer);
    }
    
    async organizeCalldataOfTx(transaction: InvokeTransactionResponse) {
            const { callArray, rawFnCalldata } = TransactionCallOrganizer.destructureFunctionCalldata(transaction);
            const functionCalls = await this.organizeFunctionCalls(callArray, rawFnCalldata);
        
            return functionCalls as FunctionCall[];
    }

    async organizeFunctionCalls(
        callArray: CallArray[],
        fullTxCalldata: BigNumber[]
    ) {
        let rawCalldataIndex = 0;
        let functionCalls = [];
        for(const call of callArray) {
            const contractCallOrganizer = await super.getContractOrganizer(getFullSelector(call.to));
    
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
    
    /**
     * @dev - Transactions have:
     * 1) An array of contracts to call
     * 2) The arguments of each contract call
     * @returns an organized object of a transaction calldata
     */
    static destructureFunctionCalldata(tx: InvokeTransactionResponse) {
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

    /**
     * @notice The call array is an array containing information about the call being made
     * @param tx: An invoke function transaction as you get when you query a tx from the starknetjs defaultProvider
     * @returns The Call array (being { to, selector, dataOffset, dataLen })
     */
    static _getCallArrayFromTx(tx: InvokeTransactionResponse) {
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

    /**
     * @notice A starknet transaction calldata is made of ([CallArray, Calldata]) with the CallArray containing data about the call and the Calldata being the calldata of the call
     * @param tx: An invoke function transaction as you get when you query a tx from the starknetjs defaultProvider
     * @param offset: A number telling where we should start reading the calldata (in case there are many calls and many calldata for example)
     * @returns The calldata of the given call
     */
    static _getRawFunctionCalldataFromTx(tx: InvokeTransactionResponse, offset: number) {
        const calldataLength = BigNumber.from(tx.calldata![offset]).toNumber();
        let fnCalldata = [];
        for(let j = offset + 1; j <= calldataLength + offset; j++) {
            fnCalldata.push(BigNumber.from(tx.calldata![j]));
        }

        return fnCalldata;
    }

    static getSpecificArgFromFunctionCall(argName: string, { calldata }: FunctionCall) {
        for(const organizedCalldata of calldata) {
            if(organizedCalldata.name === argName) {
                return organizedCalldata.value;
            }
        }
        throw new Error(`PlayerAnalyzer::_getCalldataFromFunctionName - No calldata found for this function name in calldata (functionName: ${argName})`);
    }
}