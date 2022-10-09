import { BigNumber } from "ethers";
import { addAddressPadding } from "starknet";
import { getSelectorFromName } from "starknet/utils/hash";

export const sleep = async function(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getFullSelectorFromName = function(entrypoint: string) {
    return addAddressPadding(getSelectorFromName(entrypoint));
}

export const uint256ToBN = function(num: { low: string, high: string }) {
    return BigNumber.from(num.low).add(num.high);
}

export function forceCast<T>(input: any): T {
    return input as T;
}

export * from "./ContractCallOrganizerStorage";
export * from "./constants";