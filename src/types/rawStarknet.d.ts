import {
  StructAbi,
  AbiEntry
} from "starknet";
import { BigNumberish } from "starknet/utils/number";

export declare type Event = {
  from_address: string;
  keys: Array<any>;
  data: Array<any>;
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