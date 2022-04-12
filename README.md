# starknet-analyzer

# Help analyze onchain data

## Transform this:
```
[
  '0x4',
  '0x74555344432f7457455448',
  '0x2c03d22f43898f146e026a72f4cf37b9e898b70a11c4731665e0d75ce87700d',
  '0x152e41ba9e1f486b9b8e15',
  '0x0',
  '0x44e592375a34fb4fdd3a5e2694cd2cbbcd61305b95cfac9d40c1f02ac64aa66',
  '0x4f993197257f3ffa0247049',
  '0x0',
  '0x12c',
  '0x0',
  '0x74434f4d502f7455534443',
  '0x44e592375a34fb4fdd3a5e2694cd2cbbcd61305b95cfac9d40c1f02ac64aa66',
  '0x45a21b6e7e1b4de2fd552',
  '0x0',
  '0x7f6e6a3b90ebe02190fba0269becaf8828b9219e92a7a041fa6da3ef11d0c6a',
  '0x4c9fbe35c34bb1f95da',
  '0x0',
  '0x12c',
  '0x0',
  '0x7473742f77657468',
  '0x2c03d22f43898f146e026a72f4cf37b9e898b70a11c4731665e0d75ce87700d',
  '0x49557ba2aade631b1c0bc15',
  '0x0',
  '0x7394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10',
  '0x32394234fe67c75e124bb05f867a1a8',
  '0x0',
  '0x12c',
  '0x0',
  '0x7473742f7475736463',
  '0x44e592375a34fb4fdd3a5e2694cd2cbbcd61305b95cfac9d40c1f02ac64aa66',
  '0x8aae3d253a05bff445fd4e36',
  '0x0',
  '0x7394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10',
  '0xa97d373e0da43f12c65ba66a49e208a',
  '0x0',
  '0x12c',
  '0x0'
]
```

## Into this:

```
[
    {
        name: 'pools_ptr_len',
        type: 'felt',
        value: BigNumber { _hex: '0x04', _isBigNumber: true }
    }
    {
        name: 'pools_ptr',
        type: 'Pool*',
        value: [
            {
                name: [BigNumber],
                token_a_address: [BigNumber],
                token_a_reserves: [BigNumber],
                token_b_address: [BigNumber],
                token_b_reserves: [BigNumber],
                fee_percentage: [BigNumber],
                cfmm_type: [BigNumber]
            },
            {
                name: [BigNumber],
                token_a_address: [BigNumber],
                token_a_reserves: [BigNumber],
                token_b_address: [BigNumber],
                token_b_reserves: [BigNumber],
                fee_percentage: [BigNumber],
                cfmm_type: [BigNumber]
            },
            {
                name: [BigNumber],
                token_a_address: [BigNumber],
                token_a_reserves: [BigNumber],
                token_b_address: [BigNumber],
                token_b_reserves: [BigNumber],
                fee_percentage: [BigNumber],
                cfmm_type: [BigNumber]
            },
            {
                name: [BigNumber],
                token_a_address: [BigNumber],
                token_a_reserves: [BigNumber],
                token_b_address: [BigNumber],
                token_b_reserves: [BigNumber],
                fee_percentage: [BigNumber],
                cfmm_type: [BigNumber]
            }
        ]
    }
]
```

# Contain

1) `BlockAnalyzer` - Given a block, organize transactions with events and calldata to each funcions (if possible).
2) `TransactionCallAnalyzer` - Given a transaction, can manipulate and organize the calldata and events. Used by BlockAnalyzer.
3) `ContractCallAnalyzer` - Organize inputs, outputs and events of a function call for a given contract.

# Tips

Should be run on Linux

# Examples

## ContractCallAnalyzer

### How to intiialize: 

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

### How to use:

#### Function outputs (example: view functions)

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

#### Function Inputs:

Not really used on its own. Work better with a full transaction calldata.
See `TransactionCallAnalyzer.ts::getCalldataPerCall` for an example.

#### Events:

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

## TransactionCallAnalyzer

### How to use:

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

## BlockAnalyzer

### How to use:

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
