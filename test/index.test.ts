import { defaultProvider } from "starknet";

import { ContractCallOrganizer } from "../src/organizers/ContractCallOrganizer";
import { TransactionCallOrganizer } from "../src/organizers/TransactionCallOrganizer";
import { ReceiptOrganizer } from "../src/organizers/ReceiptOrganizer";

export const provider = defaultProvider;

export const TX_HASH = "0xfdc97d95cf2dbbd352766f1bed4d655484daa824dc7e96503096ea42cf7c6d";

export const testContractCallOrganizer = false;
export const testTransactionCallOrganizer = false;
export const testReceiptOrganizer = true;

export let contractCallOrganizer;
export const transactionCallOrganizer = new TransactionCallOrganizer(provider);
export const receiptOrganizer = new ReceiptOrganizer(provider);

testContractCallOrganizer && before(async function() {
    contractCallOrganizer = await new ContractCallOrganizer("0x0691bd65ac65f3d6b9001fe864246270d561ef95798e2b7d38dd7090bd201e4b").initialize(provider);
});