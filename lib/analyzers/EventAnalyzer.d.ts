import { RpcProvider } from "starknet";
import { SwapAnalyzer } from "./SwapAnalyzer";
import { SwappersTree, TransfersTreePerAccount } from "../types/organizedStarknet";
export declare class EventAnalyzer extends SwapAnalyzer {
    private _msBetweenCallQueries;
    constructor(provider: RpcProvider, msBetweenCallQueries: number);
    analyzeEventsInBlock(blockNumber: number): Promise<{
        swaps: SwappersTree;
        transfers: TransfersTreePerAccount;
    }>;
}
//# sourceMappingURL=EventAnalyzer.d.ts.map