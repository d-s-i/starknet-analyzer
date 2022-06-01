import { TransactionReceipt } from "../types/rawStarknet";
import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";
import { Provider } from "starknet";
import { OrganizedEvent } from "../types/organizedStarknet";

export class ReceiptOrganizer extends ContractCallOrganizerStorage {

    private _organizedEvents: OrganizedEvent[];
    
    constructor(provider: Provider) {
        super(provider);
        this._organizedEvents = [];
    }
    
    async getEventsFromReceipt(receipt: TransactionReceipt) {
        for(const _event of receipt.events) {
            const contractCallOrganizer = await super.getContractOrganizer(_event.from_address);
            const eventCalldata = contractCallOrganizer.organizeEvent(_event);
            if(eventCalldata) {
                this._organizedEvents.push(eventCalldata);
            }
        }
        return  this.organizedEvents;
    }

    get organizedEvents() {
        return this._organizedEvents;
    }
}