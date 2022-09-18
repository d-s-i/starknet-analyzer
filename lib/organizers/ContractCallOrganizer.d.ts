import { BigNumber } from "ethers";
import { ProviderInterface } from "starknet";
import { BigNumberish } from "starknet/utils/number";
import { OrganizedEventAbi, OrganizedFunctionAbi, OrganizedStructAbi, StarknetArgument, OrganizedCalldata, OrganizedEvent, StarknetContractCode } from "../types/organizedStarknet";
import { Abi, Event } from "../types/rawStarknet";
export declare class ContractCallOrganizer {
    private _address;
    private _structs;
    private _functions;
    private _events;
    private _provider;
    constructor(contractAddress: string, structs?: OrganizedStructAbi, functions?: OrganizedFunctionAbi, events?: OrganizedEventAbi, provider?: ProviderInterface);
    static getFullContractAbi(contractAddress: string, provider: ProviderInterface): Promise<StarknetContractCode>;
    static organizeContractAbiFromContractAddress(contractAddress: string, provider: ProviderInterface): Promise<StarknetContractCode>;
    static organizeContractAbiFromClassHash(classHash: string, provider: ProviderInterface): Promise<StarknetContractCode>;
    static organizeContractAbiFromAbi(abi: Abi): StarknetContractCode;
    initialize(provider: ProviderInterface): Promise<this>;
    callViewFn(entrypoint: string, calldata?: BigNumberish[], provider?: ProviderInterface): Promise<OrganizedCalldata>;
    organizeCalldata(functionSelector: string, fullCalldataValues: BigNumber[], startIndex?: number): {
        subcalldata: OrganizedCalldata;
        endIndex: number;
    };
    organizeEvent(event: Event): OrganizedEvent;
    _getArgumentsValuesFromCalldata(type: string, calldata: {
        fullCalldataValues: BigNumber[];
        startIndex: number;
    }): {
        argsValues: StarknetArgument;
        endIndex: number;
    };
    _getArraySizeFromCalldata(calldata: {
        fullCalldataValues: BigNumber[];
        startIndex: number;
    }): number;
    _getFeltFromCalldata(calldata: BigNumber[], startIndex: number): {
        felt: BigNumber;
        endIndex: number;
    };
    _getFeltArrayFromCalldata(calldata: BigNumber[], startIndex: number, sizeOfArray: number): {
        feltArray: BigNumber[];
        endIndex: number;
    };
    _getStructFromCalldata(type: string, calldata: BigNumber[], startIndex: number): {
        structCalldata: StarknetArgument;
        endIndex: number;
    };
    _getStructArrayFromCalldata(type: string, calldata: BigNumber[], startIndex: number, size: number): {
        structArray: StarknetArgument[];
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
    getStructAbiFromStructType(type: string): import("../types/organizedStarknet").StarknetStruct;
    getEventAbiFromKey(key: string): import("../types/rawStarknet").EventAbi;
    get address(): string;
    get structs(): OrganizedStructAbi | undefined;
    get functions(): OrganizedFunctionAbi | undefined;
    get events(): OrganizedEventAbi | undefined;
    get abi(): {
        functions: OrganizedFunctionAbi | undefined;
        events: OrganizedEventAbi | undefined;
        structs: OrganizedStructAbi | undefined;
    };
    get provider(): ProviderInterface | undefined;
}
//# sourceMappingURL=ContractCallOrganizer.d.ts.map