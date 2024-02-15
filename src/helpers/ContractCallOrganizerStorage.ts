import { ProviderInterface, addAddressPadding } from "starknet";
import { ContractCallOrganizer } from "../organizers/ContractCallOrganizer";

import { ContractCallOrganizerMap } from "../types/organizedStarknet";

export class ContractCallOrganizerStorage {

    private _provider: ProviderInterface;
    private _contractCallOrganizers: ContractCallOrganizerMap;

    constructor(provider: ProviderInterface, contractCallOrganizer?: ContractCallOrganizerMap) {
        this._contractCallOrganizers = {};
        this._provider = provider;
        if(contractCallOrganizer) {
            for(const [key, obj] of Object.entries(contractCallOrganizer)) {
                this._contractCallOrganizers[addAddressPadding(key)] = obj;
            }
        } else {
            this._contractCallOrganizers = {};
        }
    }

    async getContractOrganizer(_address: string) {
        const address = addAddressPadding(_address);
        // store contract to avoid fetching the same contract twice for the same function call
        if(!this.contractCallOrganizers[address]) {
            this._contractCallOrganizers[address] = await new ContractCallOrganizer(address).initialize(this.provider);
            return this.contractCallOrganizers[address];
        } else {
            return this.contractCallOrganizers[address];
        }
    
    }

    get contractCallOrganizers() {
        return this._contractCallOrganizers;
    }

    get provider() {
        return this._provider;
    } 
}