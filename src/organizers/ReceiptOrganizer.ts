import { ProviderInterface, addAddressPadding } from "starknet";
import { InvokeTransactionReceiptResponse } from "starknet/types";

import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";

import { ContractCallOrganizerMap } from "../types/organizedStarknet";

export class ReceiptOrganizer extends ContractCallOrganizerStorage {

    constructor(provider: ProviderInterface, contractCallOrganizer?: ContractCallOrganizerMap) {
        super(provider, contractCallOrganizer);
    }
    
    async getEventsFromReceipt(receipt: InvokeTransactionReceiptResponse) {
        let _organizedEvents = [];
        for(const _event of receipt.events) {
            try {
                const contractCallOrganizer = await super.getContractOrganizer(addAddressPadding(_event.from_address));
                const eventCalldata = contractCallOrganizer.organizeEvent(_event);
                if(eventCalldata) {
                    _organizedEvents.push(eventCalldata);
                }
            } catch(error) { 
                console.log(" --- ReceiptOrganizer::getEventsFromReceipt --- ");
                console.log(error);
            }
        }
        return _organizedEvents;
    }
}