import { BigNumber } from "ethers";
import { addAddressPadding, hash } from "starknet";

export const sleep = async function(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getFullSelectorFromName = function(entrypoint: string) {
    return addAddressPadding(hash.getSelectorFromName(entrypoint));
}

export const uint256ToBN = function(num: { low: string, high: string }) {
    return BigNumber.from(num.low).add(num.high);
}

export const forceCast = function<T>(input: any): T {
    return input as T;
}

export const getArrayDepth = function(value: any[]): number {
    return Array.isArray(value) ? 
      1 + Math.max(0, ...value.map(getArrayDepth)) :
      0;
}

export * from "./ContractCallOrganizerStorage";
export * from "./constants";