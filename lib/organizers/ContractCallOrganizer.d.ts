import { ProviderInterface } from "starknet";
import { OrganizedEventAbi, OrganizedFunctionAbi, OrganizedStructAbi, StarknetArgument, OrganizedCalldata, OrganizedEvent, StarknetContractCode, OrganizedEnumAbi, StarknetStruct } from "../types/organizedStarknet";
import { Abi, Event } from "../types/rawStarknet";
export declare class ContractCallOrganizer {
    private _address;
    private _structs;
    private _functions;
    private _events;
    private _enums;
    private _provider;
    constructor(contractAddress: bigint, structs?: OrganizedStructAbi, functions?: OrganizedFunctionAbi, events?: OrganizedEventAbi, provider?: ProviderInterface);
    static getFullContractAbi(contractAddress: bigint, provider: ProviderInterface): Promise<StarknetContractCode>;
    static organizeContractAbiFromContractAddress(contractAddress: string, provider: ProviderInterface): Promise<StarknetContractCode>;
    static organizeContractAbiFromClassHash(classHash: string, provider: ProviderInterface): Promise<StarknetContractCode>;
    static organizeContractAbiFromAbi(abi: Abi): StarknetContractCode;
    initialize(provider: ProviderInterface): Promise<this>;
    callViewFn(entrypoint: string, calldata?: string[], provider?: ProviderInterface): Promise<OrganizedCalldata>;
    organizeFunctionInput(functionSelector: string, fullCalldataValues: bigint[], startIndex?: number): {
        subcalldata: OrganizedCalldata;
        endIndex: number;
    };
    organizeFunctionOutput(functionSelector: string, fullCalldataValues: bigint[], startIndex?: number): {
        subcalldata: OrganizedCalldata;
        endIndex: number;
    };
    organizeEvent(event: Event): OrganizedEvent;
    _decodeData(type: string, calldata: {
        fullCalldataValues: bigint[];
        startIndex: number;
    }): {
        argsValues: StarknetArgument;
        endIndex: number;
    } | {
        argsValues: bigint;
        endIndex: number;
    };
    _getStructFromCalldata(structAbi: StarknetStruct, fullCalldataValues: bigint[], startIndex: number): {
        structCalldata: StarknetArgument;
        endIndex: number;
    };
    /**
     * @dev - Might need to add an arrayDepth to calldataFinalEndIndex instead of just `startIndex + 1` that probably works only for 1 depth
     * Need to handle multiple depths
     * @param type
     * @param fullCalldataValues
     * @param startIndex
     * @returns
     */
    _getArrayFromCalldata(type: string, fullCalldataValues: bigint[], startIndex: number): {
        arrValues: any[];
        endIndex: number;
    };
    getFunctionAbiFromSelector(_functionSelector: string): import("../types/rawStarknet").FunctionAbi | {
        inputs: {
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            name: string;
            type: string;
        }[];
        type: string;
    };
    getStructAbiFromStructType(type: string): StarknetStruct;
    getEnumAbiFromStructType(type: string): import("../types/organizedStarknet").StarknetEnum;
    getEventAbiFromKey(key: string): import("../types/rawStarknet").EventAbi;
    static _extractNameFromPath(path: string): string;
    _isArray(type: string): boolean;
    _arrayDepthFromType(type: string): number;
    get address(): bigint;
    get structs(): OrganizedStructAbi | undefined;
    get functions(): OrganizedFunctionAbi | undefined;
    get events(): OrganizedEventAbi | undefined;
    get enums(): OrganizedEnumAbi | undefined;
    get abi(): {
        functions: OrganizedFunctionAbi | undefined;
        events: OrganizedEventAbi | undefined;
        structs: OrganizedStructAbi | undefined;
        enums: OrganizedEnumAbi | undefined;
    };
    get provider(): ProviderInterface | undefined;
}
//# sourceMappingURL=ContractCallOrganizer.d.ts.map