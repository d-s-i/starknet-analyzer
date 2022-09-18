import { ProviderInterface } from "starknet";
import { OrganizedTransaction, ContractCallOrganizerMap } from "../types/organizedStarknet";
import { TransactionCallOrganizer } from "./TransactionCallOrganizer";
import { GetBlockResponse } from "starknet/types";
export declare class BlockOrganizer extends TransactionCallOrganizer {
    private _msBetweenCallQueries;
    constructor(provider: ProviderInterface, msBetweenCallQueries?: number, contractCallOrganizer?: ContractCallOrganizerMap);
    organizeTransactions(block: GetBlockResponse): Promise<OrganizedTransaction[]>;
}
//# sourceMappingURL=BlockOrganizer.d.ts.map