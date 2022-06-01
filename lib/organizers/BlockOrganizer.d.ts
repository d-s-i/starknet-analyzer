import { Provider } from "starknet";
import { GetBlockResponse } from "../types/rawStarknet";
import { OrganizedTransaction } from "../types/organizedStarknet";
import { TransactionCallOrganizer } from "./TransactionCallOrganizer";
export declare class BlockOrganizer extends TransactionCallOrganizer {
    private _msBetweenCallQueries;
    constructor(provider: Provider, msBetweenCallQueries?: number);
    organizeTransactions(block: GetBlockResponse): Promise<OrganizedTransaction[]>;
}
//# sourceMappingURL=BlockOrganizer.d.ts.map