import { Provider } from "starknet";
import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";
import { StandardProvider } from "../types";
import { TransactionReceipt } from "../types/rawStarknet";
import { OrganizedEvent } from "../types/organizedStarknet";
export declare class ReceiptOrganizer extends ContractCallOrganizerStorage {
    private _organizedEvents;
    constructor(provider: StandardProvider<Provider>);
    getEventsFromReceipt(receipt: TransactionReceipt): Promise<OrganizedEvent[]>;
    get organizedEvents(): OrganizedEvent[];
}
//# sourceMappingURL=ReceiptOrganizer.d.ts.map