import { BigNumber } from "ethers";
import { AbiEntry } from "starknet/types/index";
import { EventAbi, FunctionAbi } from "./rawStarknet";

export interface ContractInfos {
    [key: string]: { 
        transactionCount: number, 
        type: string 
    } 
}

export interface AccountCallArray {
    to: BigNumber,
    selector: BigNumber,
    dataOffset: BigNumber,
    dataLen: BigNumber
}

export interface StarknetContractCode {
    functions: OrganizedFunctionAbi,
    structs: OrganizedStructAbi,
    events: OrganizedEventAbi,
}

export interface OrganizedFunctionAbi { 
    [selector: string]: FunctionAbi 
}

export interface OrganizedStructAbi {
    [key: string]: StarknetStruct
}

export interface OrganizedEventAbi { 
    [key: string]: EventAbi
}

export interface StarknetStruct { 
    size: number,
    properties: (AbiEntry & { offset: number; })[] | []
}

export type StarknetArgument = { [key: string]: any } | BigNumber;

export interface CallArray {
    to: BigNumber,
    selector: BigNumber,
    dataOffset: BigNumber,
    dataLen: BigNumber
}

export interface FunctionCall {
    name: string;
    to: BigNumber;
    calldata: OrganizedArgument[];
}

export interface OrganizedArgument {
    name: string,
    type: string,
    value: any
}

export type OrganizedCalldata = StarknetArgument | StarknetArgument[];

export interface OrganizedEvent { 
    name: string, 
    transmitterContract: string, 
    calldata: OrganizedArgument[]
}

export interface OrganizedTransaction {
    hash: string,
    events: OrganizedEvent[],
    origin: string,
    entrypointSelector: string,
    entrypointType?: string,
    functionCalls?: OrganizedCalldata,
    maxFee?: string,
    type: "ORGANIZED_INVOKE_FUNCTION"
}

export interface OrganizedTransfer { from: string, to: string, value: BigNumber, hash: string, symbol: string, decimals: number }
export type TransfersTree = { received: OrganizedTransfer[] | undefined, sent: OrganizedTransfer[] | undefined };
export interface TransfersTreePerAccount { [address: string]: TransfersTree }

export interface OrganizedSwap {
    swapperAddress: string;
    tokenIn: {
        amount: BigNumber;
        address: string;
        symbol: string;
        decimals: number;
    };
    tokenOut: {
        amount: BigNumber;
        address: string;
        symbol: string;
        decimals: number;
    };
}
export interface SwappersTree { [address: string]: OrganizedSwap[] }

export interface ContractCallOrganizerMap { [address: string]: ContractCallOrganizer }