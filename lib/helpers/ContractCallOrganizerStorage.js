"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractCallOrganizerStorage = void 0;
const starknet_1 = require("starknet");
const ContractCallOrganizer_1 = require("../organizers/ContractCallOrganizer");
class ContractCallOrganizerStorage {
    constructor(provider, contractCallOrganizer) {
        this._contractCallOrganizers = {};
        this._provider = provider;
        if (contractCallOrganizer) {
            for (const [key, obj] of Object.entries(contractCallOrganizer)) {
                this._contractCallOrganizers[(0, starknet_1.addAddressPadding)(key)] = obj;
            }
        }
        else {
            this._contractCallOrganizers = {};
        }
    }
    async getContractOrganizer(_address) {
        const address = (0, starknet_1.addAddressPadding)(_address);
        // store contract to avoid fetching the same contract twice for the same function call
        if (!this.contractCallOrganizers[address]) {
            this._contractCallOrganizers[address] = await new ContractCallOrganizer_1.ContractCallOrganizer(BigInt(address)).initialize(this.provider);
            return this.contractCallOrganizers[address];
        }
        else {
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
exports.ContractCallOrganizerStorage = ContractCallOrganizerStorage;
//# sourceMappingURL=ContractCallOrganizerStorage.js.map