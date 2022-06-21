import { Provider } from "starknet";
import { GetBlockResponse } from "../types/rawStarknet";
import { OrganizedTransaction, ContractCallOrganizerMap } from "../types/organizedStarknet";
import { StandardProvider } from "../types";
import { TransactionCallOrganizer } from "./TransactionCallOrganizer";
export declare class BlockOrganizer extends TransactionCallOrganizer {
    private _msBetweenCallQueries;
    constructor(provider: StandardProvider<Provider>, msBetweenCallQueries?: number, contractCallOrganizer?: ContractCallOrganizerMap);
    organizeTransactions(block: GetBlockResponse): Promise<OrganizedTransaction[]>;
}
//# sourceMappingURL=BlockOrganizer.d.ts.map