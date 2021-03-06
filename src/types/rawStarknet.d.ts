import {
  Transaction,
  BlockNumber,
  Status,
  StructAbi,
  Signature, 
  EntryPointType,
  RawCalldata,
  AbiEntry
} from "starknet";
import { BigNumberish } from "starknet/utils/number";

export declare type Event = {
  from_address: string;
  keys: Array<any>;
  data: Array<any>;
};

export declare type GetBlockResponse = {
  block_number: number;
  state_root: string;
  block_hash: string;
  transactions: Transaction[];
  timestamp: number;
  transaction_receipts: TransactionReceipt[];
  previous_block_hash: string;
  status: Status;
};

export declare type TransactionReceipt = {
  status: Status;
  transaction_hash: string;
  transaction_index: number;
  block_hash: string;
  block_number: BlockNumber;
  l2_to_l1_messages: string[];
  events: Event[];
};

export declare type InvokeFunctionTransaction = {
  type: 'INVOKE_FUNCTION';
  contract_address: string;
  signature?: Signature;
  transaction_hash: string;
  entry_point_type?: EntryPointType;
  entry_point_selector: string;
  calldata?: RawCalldata;
  nonce?: BigNumberish;
  max_fee?: BigNumberish;
  version?: BigNumberish;
}

export declare type GetCodeResponse = {
  bytecode: string[];
  abi: Abi;
};

export declare type EventAbi = {
  data: { name: string, type: string }[],
  keys: string[],
  name: string,
  type: 'event'
};

export declare type FunctionAbi = {
  inputs: AbiEntry[];
  name: string;
  outputs: AbiEntry[];
  stateMutability?: 'view';
  type: 'function' | 'constructor' | "l1_handler";
};

export declare type Abi = Array<FunctionAbi | StructAbi | EventAbi>;