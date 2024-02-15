import { AbiEntry } from "starknet";
import { EventAbi, FunctionAbi } from "./rawStarknet";

export interface ContractInfos {
    [key: string]: { 
        transactionCount: number, 
        type: string 
    } 
}

export interface AccountCallArray {
    to: bigint,
    selector: bigint,
    dataOffset: bigint,
    dataLen: bigint
}

export interface StarknetContractCode {
    functions: OrganizedFunctionAbi,
    structs: OrganizedStructAbi,
    events: OrganizedEventAbi,
    enums: OrganizedEnumAbi
}

export interface OrganizedFunctionAbi { 
    [selector: string]: FunctionAbi 
}

export interface OrganizedStructAbi {
    [key: string]: StarknetStruct
}

export interface OrganizedEnumAbi {
    [key: string]: StarknetEnum
}

export interface OrganizedEventAbi { 
    [key: string]: EventAbi
}

export interface StarknetStruct { 
    type: 'struct',
    name: string,
    members: { name: string, type: string }[]
}

export interface StarknetEnum {
    type: 'enum',
    name: string,
    variants: { name: string, type: string }[]
}

export type StarknetArgument = { [key: string]: any };

export interface CallArray {
    to: bigint,
    selector: bigint,
    dataOffset: bigint,
    dataLen: bigint
}

export interface FunctionCall {
    name: string;
    to: bigint;
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
    functionCalls?: FunctionCall[],
    maxFee?: string,
    type: "ORGANIZED_INVOKE_FUNCTION"
}

export interface OrganizedTransfer { from: string, to: string, value: bigint, hash: string, symbol: string, decimals: number }
export type TransfersTree = { received: OrganizedTransfer[] | undefined, sent: OrganizedTransfer[] | undefined };
export interface TransfersTreePerAccount { [address: string]: TransfersTree }

export interface OrganizedSwap {
    swapperAddress: string;
    tokenIn: {
        amount: bigint;
        address: string;
        symbol: string;
        decimals: number;
    };
    tokenOut: {
        amount: bigint;
        address: string;
        symbol: string;
        decimals: number;
    };
}
export interface SwappersTree { [address: string]: OrganizedSwap[] }

export interface ContractCallOrganizerMap { [address: string]: ContractCallOrganizer }