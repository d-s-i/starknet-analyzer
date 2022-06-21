import assert from "assert";
import { ContractCallOrganizer } from "../src/organizers/ContractCallOrganizer";
import { defaultProvider } from "starknet";

describe("ContractCallOrganizer", function() {
    it("Fecth ABI", async function() {
        const contractCallOrganizer = await new ContractCallOrganizer("0x0691bd65ac65f3d6b9001fe864246270d561ef95798e2b7d38dd7090bd201e4b").initialize(defaultProvider);
        // console.log(contractCallOrganizer.abi);
    });
});