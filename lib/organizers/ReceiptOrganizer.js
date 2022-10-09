"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptOrganizer = void 0;
const ContractCallOrganizerStorage_1 = require("../helpers/ContractCallOrganizerStorage");
const helpers_1 = require("../helpers/helpers");
class ReceiptOrganizer extends ContractCallOrganizerStorage_1.ContractCallOrganizerStorage {
    constructor(provider, contractCallOrganizer) {
        super(provider, contractCallOrganizer);
    }
    async getEventsFromReceipt(receipt) {
        let _organizedEvents = [];
        for (const _event of receipt.events) {
            try {
                const contractCallOrganizer = await super.getContractOrganizer((0, helpers_1.getFullSelector)(_event.from_address));
                const eventCalldata = contractCallOrganizer.organizeEvent(_event);
                if (eventCalldata) {
                    _organizedEvents.push(eventCalldata);
                }
            }
            catch (error) {
                console.log(" --- ReceiptOrganizer::getEventsFromReceipt --- ");
                console.log(error);
            }
        }
        return _organizedEvents;
    }
}
exports.ReceiptOrganizer = ReceiptOrganizer;
//# sourceMappingURL=ReceiptOrganizer.js.map