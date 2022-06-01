import { Provider } from "starknet";
import { ContractCallOrganizer } from "../organizers/ContractCallOrganizer";
export declare class ContractCallOrganizerStorage {
    private _provider;
    private _contractCallOrganizers;
    constructor(provider: Provider);
    getContractOrganizer(address: string): Promise<ContractCallOrganizer>;
    get contractCallOrganizers(): {
        [address: string]: ContractCallOrganizer;
    };
    get provider(): Provider;
}
//# sourceMappingURL=ContractCallOrganizerStorage.d.ts.map