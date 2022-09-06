import { testReceiptOrganizer, receiptOrganizer, TX_HASH, provider } from "./index.test";

describe("ReceiptOrganizer", async function() {
    it("Organize an event", async function() {
        /*
            tx {
                type: 'INVOKE_FUNCTION',
                transaction_hash: undefined,
                max_fee: '0x87671593f3',
                version: '0x0',
                signature: [
                    '0x22b5781e3eedaae197cf00ef630ad6666d6349e7041e9d5471097b754c6f017',
                    '0x568116f70bb02f76dc00ad92cd49ef698eb899900d0dfb91b00ac5583c5a287'
                ],
                nonce: '0x0',
                contract_address: '0x691bd65ac65f3d6b9001fe864246270d561ef95798e2b7d38dd7090bd201e4b',
                entry_point_selector: '0x15d40a3d6ca2ac30f4031e42be28da9b056fef9bb7357ac5e85627ee876e5ad',
                calldata: [ '0x0', '0x0', '0x76' ],
                entry_point_type: 'EXTERNAL'
            }
        */
       /*
       receipt {
            transaction_hash: '0xfdc97d95cf2dbbd352766f1bed4d655484daa824dc7e96503096ea42cf7c6d',
            actual_fee: '0x5a44b92b97',
            status: 'ACCEPTED_ON_L1',
            block_hash: '0x308c5363139a08e77719bc6ce28f93951a7bbd04877501f3ae7c0cc84ddaa79',
            block_number: 322915,
            messages_sent: [],
            events: [
                {
                from_address: '0x691bd65ac65f3d6b9001fe864246270d561ef95798e2b7d38dd7090bd201e4b',
                keys: [Array],
                data: [Array]
                },
                {
                from_address: '0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
                keys: [Array],
                data: [Array]
                }
            ]
        }
        */
        const receipt = await provider.getTransactionReceipt(TX_HASH);
        console.log("receipt", receipt);
        const organizedEvents = await receiptOrganizer.getEventsFromReceipt(receipt as any);
        console.log("organizedEvents", organizedEvents);
    });
});