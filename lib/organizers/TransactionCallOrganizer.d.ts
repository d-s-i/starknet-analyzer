import { BigNumber } from "ethers";
import { InvokeFunctionTransaction, Provider } from "starknet";
import { FunctionCall, CallArray, ContractCallOrganizerMap } from "../types/organizedStarknet";
import { StandardProvider } from "../types";
import { ReceiptOrganizer } from "./ReceiptOrganizer";
export declare class TransactionCallOrganizer extends ReceiptOrganizer {
    constructor(provider: StandardProvider<Provider>, contractCallOrganizer?: ContractCallOrganizerMap);
    getCalldataPerCallFromTx(transaction: InvokeFunctionTransaction): Promise<FunctionCall[]>;
    getCalldataPerCall(callArray: CallArray[], fullTxCalldata: BigNumber[]): Promise<{
        name: any;
        to: BigNumber;
        calldata: any;
    }[]>;
    /**
     * @dev - Transactions have:
     * 1) An array of contracts to call
     * 2) The arguments of each contract call
     * @returns an organized object of a transaction calldata
     */
    static destructureFunctionCalldata(tx: InvokeFunctionTransaction): {
        callArray: {
            to: BigNumber;
            selector: BigNumber;
            dataOffset: BigNumber;
            dataLen: BigNumber;
        }[];
        rawFnCalldata: BigNumber[];
        nonce: any;
    };
    /**
     * @notice The call array is an array containing information about the call being made
     * @param tx: An invoke function transaction as you get when you query a tx from the starknetjs defaultProvider
     * @returns The Call array (being { to, selector, dataOffset, dataLen })
     */
    static _getCallArrayFromTx(tx: InvokeFunctionTransaction): {
        to: BigNumber;
        selector: BigNumber;
        dataOffset: BigNumber;
        dataLen: BigNumber;
    }[];
    /**
     * @notice A starknet transaction calldata is made of ([CallArray, Calldata]) with the CallArray containing data about the call and the Calldata being the calldata of the call
     * @param tx: An invoke function transaction as you get when you query a tx from the starknetjs defaultProvider
     * @param offset: A number telling where we should start reading the calldata (in case there are many calls and many calldata for example)
     * @returns The calldata of the given call
     */
    static _getRawFunctionCalldataFromTx(tx: InvokeFunctionTransaction, offset: number): BigNumber[];
    static getValueFromOrganizedFunctionCallForFunctionName(fnName: string, { calldata }: FunctionCall): any;
}
//# sourceMappingURL=TransactionCallOrganizer.d.ts.map