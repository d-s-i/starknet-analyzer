"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptOrganizer = void 0;
const starknet_1 = require("starknet");
const ContractCallOrganizerStorage_1 = require("../helpers/ContractCallOrganizerStorage");
class ReceiptOrganizer extends ContractCallOrganizerStorage_1.ContractCallOrganizerStorage {
    constructor(provider, contractCallOrganizer) {
        super(provider, contractCallOrganizer);
    }
    async getEventsFromReceipt(receipt) {
        let _organizedEvents = [];
        for (const _event of receipt.events) {
            try {
                const contractCallOrganizer = await super.getContractOrganizer((0, starknet_1.addAddressPadding)(_event.from_address));
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