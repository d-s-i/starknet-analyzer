import { BigNumber, BigNumberish } from "ethers";
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const getFullSelectorFromName: (entrypoint: string) => string;
export declare const getFullSelector: (selector: BigNumberish) => string;
export declare const uint256ToBN: (num: {
    low: string;
    high: string;
}) => BigNumber;
export declare function forceCast<T>(input: any): T;
//# sourceMappingURL=index.d.ts.map