import { ProviderInterface } from "starknet";
import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";
import { ContractCallOrganizerMap } from "../types/organizedStarknet";
import { InvokeTransactionReceiptResponse } from "starknet/types";
export declare class ReceiptOrganizer extends ContractCallOrganizerStorage {
    constructor(provider: ProviderInterface, contractCallOrganizer?: ContractCallOrganizerMap);
    getEventsFromReceipt(receipt: InvokeTransactionReceiptResponse): Promise<any[]>;
}
//# sourceMappingURL=ReceiptOrganizer.d.ts.map