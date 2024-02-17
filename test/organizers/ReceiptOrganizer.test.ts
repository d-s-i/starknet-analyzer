import { testReceiptOrganizer, receiptOrganizer, INVOKE_TX, provider } from "../index.test";

testReceiptOrganizer && describe("ReceiptOrganizer", async function() {
    it("Organize an event", async function() {

        const txs = [
            "0x73225918f354e27b8eda64cbd694606ea129ecb84372763d6d9ea704d3236b5",
            "0x3a544f5fb51a84d41030d56fa720297dcb0ae87b77df90f50e81989e8a01e18",
            "0x176e2a3fa310c3dc204914eccd903b82f671f02d2aea7a2206d5647068d281a",
            "0x1f02fa4859dc2f03e3f8330009ea71951cb43c9797cd7f7c46cce0dfd3c4b1d",
            "0x139337f64ec1406c41e4ab1eecfc6593f67e5e8a96ed684956f0f66d54b00fb"
        ];
        
        const receipt = await provider.getTransactionReceipt(txs[4]);
        const organizedEvents = await receiptOrganizer.getEventsFromReceipt(receipt as any);
        console.log("\n\nORGANIZED EVENTS");
        for(const _event of organizedEvents) {
            console.log("\n");
            console.log(_event.name);
            if(_event.name === "game::Game::ItemsLeveledUp") {
                for(const val of _event.calldata) {
                    console.log(val.value);
                }
            }
        }
    });
});