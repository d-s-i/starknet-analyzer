import { ProviderInterface } from "starknet";
import { ContractCallOrganizerMap } from "../types/organizedStarknet";
export declare class ContractCallOrganizerStorage {
    private _provider;
    private _contractCallOrganizers;
    constructor(provider: ProviderInterface, contractCallOrganizer?: ContractCallOrganizerMap);
    getContractOrganizer(_address: string): Promise<ContractCallOrganizer>;
    get contractCallOrganizers(): ContractCallOrganizerMap;
    get provider(): ProviderInterface;
}
//# sourceMappingURL=ContractCallOrganizerStorage.d.ts.map