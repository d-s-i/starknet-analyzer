import { BigNumber } from "ethers";
import { getSelectorFromName } from "starknet/utils/hash";

export const sleep = async function(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getFullSelector = function(entrypoint: string) {
    return BigNumber.from(getSelectorFromName(entrypoint)).toHexString();
}