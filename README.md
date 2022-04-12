# starknet-analyzer

1) `BlockAnalyzer` - Given a block, organize transactions with events and calldata to each funcions (if possible).
2) `TransactionCallAnalyzer` - Given a transaction, can manipulate and organize the calldata and events. Used by BlockAnalyzer.
3) `ContractCallAnalyzer` - Organize inputs, outputs and events of a function call for a given contract.

# Tips

Should be run on Linux

# Examples

1) ContractCallAnalyzer

How to intiialize: 

```
import { defaultProvider } from "starknet";
import { ContractCallAnalyzer } from "starknet-analyzer/lib/analyzers/ContractCallAnalyzer";

const contractAddr = "0x0000...e54";

const contractCallAnalyzer = await new ContractCallAnalyzer(contractAddress).initialize(defaultProvider);
```

```
import { defaultProvider } from "starknet";
import { ContractCallAnalyzer } from "starknet-analyzer/lib/analyzers/ContractCallAnalyzer";

const contractAddr = "0x0000...e54";

const { events, functions, structs } = await ContractCallAnalyzer.getContractAbi(contractAddr, defaultProvider);
const contractCallAnalyzer = new ContractCallAnalyzer(contractAddr, structs, functions, events);
```

How to use:

Function outputs (example: view functions)

```
import { defaultProvider } from "starknet";
import { BigNumber } from "ethers";
import { ContractCallAnalyzer } from "starknet-analyzer/lib/analyzers/ContractCallAnalyzer";

const contractAddr = "0x0000...e54";
const entrypoint = "get_amounts_out";

const { result: rawAmountsOut } = await defaultProvider.callContract({
    contractAddress: contractAddr,
    entrypoint
});

const rawAmountsOutBN = rawAmountsOut.map((rawPool: any) => BigNumber.from(rawPool));

const contractCallAnalyzer = await new ContractCallAnalyzer(contractAddress).initialize(defaultProvider);

const { subcalldata: amountsOut } = contractCallAnalyzer.organizeFunctionOutput(
    getFullSelector(entrypoint),
    rawAmountsOutBN
);

console.log(amountsOut);

/*
    output something like: 
    {
        amountIn: { low: "0x0154eda", high: "0x0" },
        amountOut: { low: "0x41da25", high: "0x0" }
    }
    instead of:
    [
        "0x2",
        "0x0154eda",
        "0x0",
        "0x41da25",
        "0x0"
    ]
*/
```

Function Inputs:

Not really used on its own. Work better with a full transaction calldata.
See `TransactionCallAnalyzer.ts::getCalldataPerCall` for an example.

Events:

```
import { defaultProvider } from "starknet";
import { ContractCallAnalyzer } from "starknet-analyzer/lib/analyzers/ContractCallAnalyzer";

const contractAddr = "0x0000...e54";

const contractCallAnalyzer = await new ContractCallAnalyzer(contractAddress).initialize(defaultProvider);

const block = await defaultProvider.getBlock(1145);
const receipt = block.transaction_receipts[0] as TransactionReceipt; // pick a random receipt

let events: OrganizedEvent[] = [];
for(const event of receipt.events) {
    const contractCallAnalyzer = await this.getContractAnalyzer(event.from_address);
    const eventCalldata = await contractCallAnalyzer.organizeEvent(event);
    if(eventCalldata) {
        events.push(eventCalldata);
    }
}

console.log(events);

/*
    output something like:
    {
        name: "Transfer", 
        transmitterContract: "0x0000...e54", 
        calldata: {
            "amount": { low: "0x1554a", high: "0x0" };
        } 
    }
*/
```

2) TransactionCallAnalyzer

How to use:

```
import { TransactionCallAnalyzer } from "starknet-analyzer/lib/analyzers/TransactionCallAnalyzer";
import { defaultProvider } from "starknet";

const block = await defaultProvider.getBlock(99874);
const transaction = block.transactions[0] as InvokeFunctionTransaction;

const transactionCallAnalyzer = new TransactionCallAnalyzer(defaultProvider);
const functionCalls = await transactionCallAnalyzer.getCalldataPerCallFromTx(tx);

/*
    return something like:
    {
        name: "approve";
        to: "0xa14...c56";
        calldata: [
            {
                to: 
            }, {
                amount: 
            }
        ];
    }
*/
```

3) BlockAnalyzer

How to use:

```
import { defaultProvider } from "starknet";
import { BlockAnalyzer } from "./analyzers/BlockAnalyzer";

const blockAnalyzer = new BlockAnalyzer(defaultProvider);
const block = await defaultProvider.getBlock(blockNumber);
const transactions = await blockAnalyzer.organizeTransactions(block);

/*
    return something like:
    {
        hash: string,
        events: OrganizedEvent[],
        origin: string,
        entrypointSelector: string,
        entrypointType?: string,
        functionCalls?: OrganizedCalldata,
        maxFee?: string,
        type: string
    }
*/
```
