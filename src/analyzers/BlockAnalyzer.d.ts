import { Provider } from "starknet";
import { GetBlockResponse } from "../types/rawStarknet";
import { OrganizedTransaction } from "../types/organizedStarknet";
import { TransactionCallAnalyzer } from "./TransactionCallAnalyzer";
export declare class BlockAnalyzer extends TransactionCallAnalyzer {
    constructor(provider: Provider);
    organizeTransactions(block: GetBlockResponse): Promise<OrganizedTransaction[]>;
}
