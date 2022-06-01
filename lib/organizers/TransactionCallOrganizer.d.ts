import { BigNumber } from "ethers";
import { InvokeFunctionTransaction, Provider } from "starknet";
import { FunctionCall, CallArray } from "../types/organizedStarknet";
import { ReceiptOrganizer } from "./ReceiptOrganizer";
export declare class TransactionCallOrganizer extends ReceiptOrganizer {
    constructor(provider: Provider);
    getCalldataPerCallFromTx(transaction: InvokeFunctionTransaction): Promise<FunctionCall[]>;
    getCalldataPerCall(callArray: CallArray[], fullTxCalldata: BigNumber[]): Promise<{
        name: string;
        to: BigNumber;
        calldata: {
            [key: string]: any;
        } | import("../types/organizedStarknet").StarknetArgument[];
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
    static _getCallArrayFromTx(tx: InvokeFunctionTransaction): {
        to: BigNumber;
        selector: BigNumber;
        dataOffset: BigNumber;
        dataLen: BigNumber;
    }[];
    static _getRawFunctionCalldataFromTx(tx: InvokeFunctionTransaction, offset: number): BigNumber[];
}
//# sourceMappingURL=TransactionCallOrganizer.d.ts.map