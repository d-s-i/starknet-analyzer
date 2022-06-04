import * as organizedStarknetTypes from "./organizedStarknet";
import * as rawStarknetTypes from "./rawStarknet";

export type StandardProvider<T> = { [K in keyof T]: T[K] };
