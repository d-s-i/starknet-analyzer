import { Provider } from "starknet";
import { ContractCallOrganizer } from "../organizers/ContractCallOrganizer";
import { StandardProvider } from "../types";
export declare class ContractCallOrganizerStorage {
    private _provider;
    private _contractCallOrganizers;
    constructor(provider: StandardProvider<Provider>);
    getContractOrganizer(address: string): Promise<ContractCallOrganizer>;
    get contractCallOrganizers(): {
        [address: string]: ContractCallOrganizer;
    };
    get provider(): StandardProvider<Provider>;
}
//# sourceMappingURL=ContractCallOrganizerStorage.d.ts.map