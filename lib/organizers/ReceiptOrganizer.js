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
        const _organizedEvents = [];
        if (receipt.events?.length === 0)
            return _organizedEvents;
        for (const _event of receipt.events) {
            // if(BigInt(_event.from_address) !== BigInt("0x071d07b1217cdcc334739a3f28da75db05d62672ad04b9204ee11b88f2f9f61c")) continue;
            try {
                const contractCallOrganizer = await super.getContractOrganizer((0, starknet_1.addAddressPadding)(_event.from_address));
                const eventCalldata = contractCallOrganizer.organizeEvent(_event);
                if (eventCalldata) {
                    _organizedEvents.push(eventCalldata);
                }
            }
            catch (error) {
                console.log(" --- ReceiptOrganizer::getEventsFromReceipt --- ");
                console.log(`Error with tx ${receipt.transaction_hash}`);
                console.log(error);
            }
            // break; // TO REMOVE TESTING PURPOSES
        }
        return _organizedEvents;
    }
}
exports.ReceiptOrganizer = ReceiptOrganizer;
//# sourceMappingURL=ReceiptOrganizer.js.map