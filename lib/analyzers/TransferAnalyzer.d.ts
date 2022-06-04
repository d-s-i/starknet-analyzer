import { BigNumber } from "ethers";
import { Provider } from "starknet";
import { QueryHelper } from "./QueryHelper";
import { OrganizedEvent, OrganizedTransaction, OrganizedTransfer, TransfersTree, TransfersTreePerAccount } from "../types/organizedStarknet";
import { StandardProvider } from "../types";
export declare class TransferAnalyzer extends QueryHelper {
    private _transfersPerBlock;
    constructor(provider: StandardProvider<Provider>);
    analyzeTransfersInBlock(transactions: OrganizedTransaction[]): Promise<TransfersTreePerAccount>;
    analyzeTransfer(transaction: OrganizedTransaction, event: OrganizedEvent): Promise<{
        from: any;
        to: any;
        value: BigNumber;
        hash: string;
        symbol: string;
        decimals: number;
    }>;
    getSymbolAndDecimalOfToken(tokenAddress: string): Promise<{
        symbol: string;
        decimals: number;
    }>;
    populateTransfersPerBlock(blockNumber: number, transfersObj: TransfersTreePerAccount): void;
    populateTransfersObject(transfers: TransfersTreePerAccount, { from, to, value, hash, symbol, decimals }: OrganizedTransfer): TransfersTreePerAccount;
    _populateSentTransfers(transfersObj: TransfersTree, value: OrganizedTransfer): TransfersTree;
    _populateReceivedTransfers(transfersObj: TransfersTree, value: OrganizedTransfer): TransfersTree;
    get transfersPerBlock(): {
        [blockNumber: string]: TransfersTreePerAccount;
    };
}
//# sourceMappingURL=TransferAnalyzer.d.ts.map