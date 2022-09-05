import { testReceiptOrganizer, receiptOrganizer, TX_HASH, provider } from "./index.test";

describe("ReceiptOrganizer", async function() {
    it("Organize an event", async function() {
        const receipt = await provider.getTransactionReceipt(TX_HASH);
        const organizedEvents = await receiptOrganizer.getEventsFromReceipt(receipt as any);
        console.log("organizedEvents", organizedEvents);
    });
});