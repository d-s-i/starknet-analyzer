import { Provider } from "starknet";
import { StandardProvider } from "../types";
import { ContractCallOrganizerMap } from "../types/organizedStarknet";
export declare class ContractCallOrganizerStorage {
    private _provider;
    private _contractCallOrganizers;
    constructor(provider: StandardProvider<Provider>, contractCallOrganizer?: ContractCallOrganizerMap);
    getContractOrganizer(address: string): Promise<ContractCallOrganizer>;
    get contractCallOrganizers(): ContractCallOrganizerMap;
    get provider(): StandardProvider<Provider>;
}
//# sourceMappingURL=ContractCallOrganizerStorage.d.ts.map