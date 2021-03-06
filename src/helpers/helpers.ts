import { BigNumber, BigNumberish } from "ethers";
import { getSelectorFromName } from "starknet/utils/hash";

export const sleep = async function(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getFullSelectorFromName = function(entrypoint: string) {
    return BigNumber.from(getSelectorFromName(entrypoint)).toHexString();
}

export const getFullSelector = function(selector: BigNumberish) {
    return BigNumber.from(selector).toHexString();
}

export const uint256ToBN = function(num: { low: string, high: string }) {
    return BigNumber.from(num.low).add(num.high);
}

export function forceCast<T>(input: any): T {
    return input;
}