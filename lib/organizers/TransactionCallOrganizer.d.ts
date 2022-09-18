import { BigNumber } from "ethers";
import { InvokeTransactionResponse, ProviderInterface } from "starknet";
import { FunctionCall, CallArray, ContractCallOrganizerMap } from "../types/organizedStarknet";
import { ReceiptOrganizer } from "./ReceiptOrganizer";
export declare class TransactionCallOrganizer extends ReceiptOrganizer {
    constructor(provider: ProviderInterface, contractCallOrganizer?: ContractCallOrganizerMap);
    organizeCalldataOfTx(transaction: InvokeTransactionResponse): Promise<FunctionCall[]>;
    organizeFunctionCalls(callArray: CallArray[], fullTxCalldata: BigNumber[]): Promise<{
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
    static destructureFunctionCalldata(tx: InvokeTransactionResponse): {
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
    static _getCallArrayFromTx(tx: InvokeTransactionResponse): {
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
    static _getRawFunctionCalldataFromTx(tx: InvokeTransactionResponse, offset: number): BigNumber[];
    static getSpecificArgFromFunctionCall(argName: string, { calldata }: FunctionCall): any;
}
//# sourceMappingURL=TransactionCallOrganizer.d.ts.map