import { ProviderInterface, addAddressPadding, InvokeTransactionReceiptResponse } from "starknet";

import { ContractCallOrganizerStorage } from "../helpers/ContractCallOrganizerStorage";

import { ContractCallOrganizerMap, OrganizedEvent } from "../types/organizedStarknet";
import { ContractCallOrganizer } from "./ContractCallOrganizer";

export class ReceiptOrganizer extends ContractCallOrganizerStorage {

    constructor(provider: ProviderInterface, contractCallOrganizer?: ContractCallOrganizerMap) {
        super(provider, contractCallOrganizer);
    }
    
    async getEventsFromReceipt(receipt: InvokeTransactionReceiptResponse) {
        const _organizedEvents: OrganizedEvent[] = [];
        if(receipt.events?.length === 0) return _organizedEvents;
        for(const _event of receipt.events!) {
            // if(BigInt(_event.from_address) !== BigInt("0x071d07b1217cdcc334739a3f28da75db05d62672ad04b9204ee11b88f2f9f61c")) continue;
            try {
                const contractCallOrganizer: ContractCallOrganizer = await super.getContractOrganizer(addAddressPadding(_event.from_address));
                const eventCalldata = contractCallOrganizer.organizeEvent(_event);
                if(eventCalldata) {
                    _organizedEvents.push(eventCalldata);
                }
            } catch(error) { 
                console.log(" --- ReceiptOrganizer::getEventsFromReceipt --- ");
                console.log(`Error with tx ${receipt.transaction_hash}`);
                console.log(error);
            }
            // break; // TO REMOVE TESTING PURPOSES
        }
        return _organizedEvents;
    }
}