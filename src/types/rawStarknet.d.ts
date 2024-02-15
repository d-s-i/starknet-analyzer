import {
  StructAbi,
  AbiEntry
} from "starknet";

export declare type Event = {
  from_address: string;
  keys: Array<any>;
  data: Array<any>;
};

export declare type EventAbi = {
//   data: { name: string, type: string }[],
//   keys: string[],
//   name: string,
//   type: 'event'
type: 'event',
name: string,
kind: string,
members: {
    name: string,
    type: string,
    kind: string
  }[]
};

export declare type FunctionAbi = {
  inputs: AbiEntry[];
  name: string;
  outputs: AbiEntry[];
  stateMutability?: 'view';
  type: 'function' | 'constructor' | "l1_handler";
};

export declare type EnumAbi = {
    type: 'enum',
    name: string,
    variants: { name: string, type: string }[]
}

export declare type ImplAbi = {
    type: 'impl',
    name: string,
    interface_name: string
};

export declare type InterfaceAbi = {
    type: "interface",
    name: string,
    items: any[]
};

export declare type Abi = Array<FunctionAbi | StructAbi | EventAbi | EnumAbi | ImplAbi | InterfaceAbi>;