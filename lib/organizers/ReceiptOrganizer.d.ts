import { TransactionReceipt } from "../types/rawStarknet";
import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";
import { Provider } from "starknet";
import { OrganizedEvent } from "../types/organizedStarknet";
export declare class ReceiptOrganizer extends ContractCallOrganizerStorage {
    private _organizedEvents;
    constructor(provider: Provider);
    getEventsFromReceipt(receipt: TransactionReceipt): Promise<OrganizedEvent[]>;
    get organizedEvents(): OrganizedEvent[];
}
//# sourceMappingURL=ReceiptOrganizer.d.ts.map