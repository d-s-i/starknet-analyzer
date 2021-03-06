"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractCallOrganizerStorage = void 0;
const ContractCallOrganizer_1 = require("../organizers/ContractCallOrganizer");
const helpers_1 = require("./helpers");
class ContractCallOrganizerStorage {
    constructor(provider, contractCallOrganizer) {
        this._contractCallOrganizers = {};
        this._provider = provider;
        if (contractCallOrganizer) {
            for (const [key, obj] of Object.entries(contractCallOrganizer)) {
                this._contractCallOrganizers[(0, helpers_1.getFullSelector)(key)] = obj;
            }
        }
        else {
            this._contractCallOrganizers = {};
        }
    }
    getContractOrganizer(_address) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = (0, helpers_1.getFullSelector)(_address);
            // store contract to avoid fetching the same contract twice for the same function call
            if (!this.contractCallOrganizers[address]) {
                this._contractCallOrganizers[address] = yield new ContractCallOrganizer_1.ContractCallOrganizer(address).initialize(this.provider);
                return this.contractCallOrganizers[address];
            }
            else {
                return this.contractCallOrganizers[address];
            }
        });
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