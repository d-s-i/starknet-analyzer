import dotenv from "dotenv";
dotenv.config();
import assert from "assert";
import { defaultProvider, RpcProvider } from "starknet";

import { BlockOrganizer } from "../src/organizers/BlockOrganizer";
import { TransactionCallOrganizer } from "../src/organizers/TransactionCallOrganizer";
import { ReceiptOrganizer } from "../src/organizers/ReceiptOrganizer";

// export const provider = defaultProvider;
export const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_GOERLI_NODE_URL! });

// export const DEPLOY_TX_HASH_V0 = "0x1bc2a00d66f3090ec66511f67f276323e0a26b2d324a61aed43e08ba092eb68";
// export const DECLARE_TX_HASH_V1 = "0x584b86f6a3dd9462ad1dbdb4c7a912d2d9de04cb9fdf7b4e0a8d0651a2c8e8c";
// export const INVOKE_TX_HASH_V1 = "0x3796576e3b42c8dc9990dea4dee0e43e0df10e4895080efc00d8cf6414046ed";
// export const INVOKE_TX_HASH_V0 = "0x7b58eb1b53ab3d363ad44fabbf6036acd480039c85aaad3844a9bfcf40439ca";

export const INVOKE_TX = "0x06bf2fbfaee2c7c86728ba7db3038d23ff58566e2481c0ea3fc5c9b71cbe8171";

export const testBlockOrganizer = false;
export const testContractCallOrganizer = false;
export const testReceiptOrganizer = true;
export const testTransactionCallOrganizer = false;

export let contractCallOrganizer;
export const transactionCallOrganizer = new TransactionCallOrganizer(provider);
export const receiptOrganizer = new ReceiptOrganizer(provider);
export const blockOrganizer = new BlockOrganizer(provider);