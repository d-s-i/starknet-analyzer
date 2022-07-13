import { Provider } from "starknet";

import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";

import { StandardProvider } from "../types";
import { TransactionReceipt } from "../types/rawStarknet";
import { ContractCallOrganizerMap } from "../types/organizedStarknet";
import { getFullSelector } from "../helpers/helpers";

export class ReceiptOrganizer extends ContractCallOrganizerStorage {

    
    constructor(provider: StandardProvider<Provider>, contractCallOrganizer?: ContractCallOrganizerMap) {
        super(provider, contractCallOrganizer);
    }
    
    async getEventsFromReceipt(receipt: TransactionReceipt) {
        let _organizedEvents = [];
        for(const _event of receipt.events) {
            try {
                const contractCallOrganizer = await super.getContractOrganizer(getFullSelector(_event.from_address));
                const eventCalldata = contractCallOrganizer.organizeEvent(_event);
                if(eventCalldata) {
                    _organizedEvents.push(eventCalldata);
                }
            } catch(error) {  }
        }
        return  _organizedEvents;
    }
}