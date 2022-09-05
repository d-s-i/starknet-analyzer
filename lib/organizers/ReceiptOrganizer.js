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
exports.ReceiptOrganizer = void 0;
const ContractCallOrganizerStorage_1 = require("../helpers/ContractCallOrganizerStorage");
const helpers_1 = require("../helpers/helpers");
class ReceiptOrganizer extends ContractCallOrganizerStorage_1.ContractCallOrganizerStorage {
    constructor(provider, contractCallOrganizer) {
        super(provider, contractCallOrganizer);
    }
    getEventsFromReceipt(receipt) {
        const _super = Object.create(null, {
            getContractOrganizer: { get: () => super.getContractOrganizer }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let _organizedEvents = [];
            for (const _event of receipt.events) {
                try {
                    const contractCallOrganizer = yield _super.getContractOrganizer.call(this, (0, helpers_1.getFullSelector)(_event.from_address));
                    const eventCalldata = contractCallOrganizer.organizeEvent(_event);
                    if (eventCalldata) {
                        _organizedEvents.push(eventCalldata);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            return _organizedEvents;
        });
    }
}
exports.ReceiptOrganizer = ReceiptOrganizer;
//# sourceMappingURL=ReceiptOrganizer.js.map