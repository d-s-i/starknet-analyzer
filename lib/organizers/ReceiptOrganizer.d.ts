import { ProviderInterface, InvokeTransactionReceiptResponse } from "starknet";
import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";
import { ContractCallOrganizerMap, OrganizedEvent } from "../types/organizedStarknet";
export declare class ReceiptOrganizer extends ContractCallOrganizerStorage {
    constructor(provider: ProviderInterface, contractCallOrganizer?: ContractCallOrganizerMap);
    getEventsFromReceipt(receipt: InvokeTransactionReceiptResponse): Promise<OrganizedEvent[]>;
}
//# sourceMappingURL=ReceiptOrganizer.d.ts.map