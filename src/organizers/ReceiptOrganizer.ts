import { Provider } from "starknet";

import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";

import { StandardProvider } from "../types";
import { TransactionReceipt } from "../types/rawStarknet";
import { OrganizedEvent, ContractCallOrganizerMap } from "../types/organizedStarknet";
import { getFullSelector } from "../helpers/helpers";

export class ReceiptOrganizer extends ContractCallOrganizerStorage {

    private _organizedEvents: OrganizedEvent[];
    
    constructor(provider: StandardProvider<Provider>, contractCallOrganizer?: ContractCallOrganizerMap) {
        super(provider, contractCallOrganizer);
        this._organizedEvents = [];
    }
    
    async getEventsFromReceipt(receipt: TransactionReceipt) {
        for(const _event of receipt.events) {
            try {
                const contractCallOrganizer = await super.getContractOrganizer(getFullSelector(_event.from_address));
                const eventCalldata = contractCallOrganizer.organizeEvent(_event);
                if(eventCalldata) {
                    this._organizedEvents.push(eventCalldata);
                }
            } catch(error) {  }
        }
        return  this.organizedEvents;
    }

    get organizedEvents() {
        return this._organizedEvents;
    }
}