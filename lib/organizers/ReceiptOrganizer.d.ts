import { Provider } from "starknet";
import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";
import { StandardProvider } from "../types";
import { TransactionReceipt } from "../types/rawStarknet";
import { ContractCallOrganizerMap } from "../types/organizedStarknet";
export declare class ReceiptOrganizer extends ContractCallOrganizerStorage {
    constructor(provider: StandardProvider<Provider>, contractCallOrganizer?: ContractCallOrganizerMap);
    getEventsFromReceipt(receipt: TransactionReceipt): Promise<any[]>;
}
//# sourceMappingURL=ReceiptOrganizer.d.ts.map