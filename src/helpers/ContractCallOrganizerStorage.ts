import { Provider } from "starknet";
import { ContractCallOrganizer } from "../organizers/ContractCallOrganizer";

import { StandardProvider } from "../types";
import { ContractCallOrganizerMap } from "../types/organizedStarknet";

export class ContractCallOrganizerStorage {

    private _provider: StandardProvider<Provider>;
    private _contractCallOrganizers: ContractCallOrganizerMap;

    constructor(provider: StandardProvider<Provider>, contractCallOrganizer?: ContractCallOrganizerMap) {
        this._contractCallOrganizers = {};
        this._provider = provider;
        this._contractCallOrganizers = contractCallOrganizer || {};
    }

    async getContractOrganizer(address: string) {
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