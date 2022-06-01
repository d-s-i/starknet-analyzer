import { Provider } from "starknet";
import { ContractCallOrganizer } from "../organizers/ContractCallOrganizer";

export class ContractCallOrganizerStorage {

    private _provider: Provider;
    private _contractCallOrganizers: { [address: string]: ContractCallOrganizer };

    constructor(provider: Provider) {
        this._contractCallOrganizers = {};
        this._provider = provider;
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