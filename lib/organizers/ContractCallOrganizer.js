"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractCallOrganizer = void 0;
const ethers_1 = require("ethers");
const starknet_1 = require("starknet");
const helpers_1 = require("../helpers/helpers");
class ContractCallOrganizer {
    constructor(contractAddress, structs, functions, events, provider) {
        this._address = contractAddress;
        this._structs = structs;
        this._functions = functions;
        this._events = events;
        this._provider = provider;
    }
    /*
        For the first contract you query `starknet_getClassAt`, it will give you the abi
        Then if in the abi there is an implementation, query `getClass`. The implementation should not be deployed so the
        implementation query should return a classHash which is used in getClass
    */
    static async getFullContractAbi(contractAddress, provider) {
        let { functions, structs, events } = await this.organizeContractAbiFromContractAddress(contractAddress, provider);
        const implementationEntryPoints = [
            "get_implementation_hash",
            "get_implementation",
            "getImplementationHash",
            "implementation",
            "implementationHash",
            "implementation_hash"
        ];
        const getImplementationSelectors = implementationEntryPoints.map(entrypoint => (0, helpers_1.getFullSelectorFromName)(entrypoint));
        const getImplementationIndex = getImplementationSelectors.findIndex(getImplementationSelector => {
            return Object.keys(functions).includes(getImplementationSelector);
        });
        if (getImplementationIndex !== -1) {
            const { result: [implementationClassHash] } = await provider.callContract({
                contractAddress,
                entrypoint: implementationEntryPoints[getImplementationIndex]
            });
            try {
                const { functions: implementationFunctions, structs: implementationStructs, events: implementationEvents } = await this.organizeContractAbiFromClassHash(implementationClassHash, provider);
                functions = { ...functions, ...implementationFunctions };
                structs = { ...structs, ...implementationStructs };
                events = { ...events, ...implementationEvents };
            }
            catch (error) {
                console.log(" -- ContractCallOrganizer::getFullContractAbi -- ");
                console.log(error);
            }
        }
        return { functions, structs, events };
    }
    static async organizeContractAbiFromContractAddress(contractAddress, provider) {
        // putting defaultProvider by default bc pathfinder nodes doesn't return abis
        const { abi } = await starknet_1.defaultProvider.getClassAt(contractAddress, "latest");
        if (!abi) {
            throw new Error(`ContractCallOrganizer::_organizeContractAbi - Couldn't fetch abi for address ${contractAddress}`);
        }
        return this.organizeContractAbiFromAbi(abi);
    }
    static async organizeContractAbiFromClassHash(classHash, provider) {
        // replace provider.getClass(classHash) until it's implemented by starknetjs + pathfinder doesn't return abis
        const { abi } = await fetch(`http://alpha4.starknet.io/feeder_gateway/get_class_by_hash?classHash=${classHash}`).then(res => res.json());
        if (!abi) {
            throw new Error(`ContractCallOrganizer::organizeContractAbiFromClassHash - Couldn't fetch abi for classHash ${classHash} (abi: ${abi})`);
        }
        return this.organizeContractAbiFromAbi(abi);
    }
    static organizeContractAbiFromAbi(abi) {
        let functions = {};
        let events = {};
        let structs = {};
        for (const item of abi) {
            if (item.type === "function" ||
                item.type === "l1_handler" ||
                item.type === "constructor") {
                const _name = (0, helpers_1.getFullSelectorFromName)(item.name);
                functions[_name] = item;
            }
            if (item.type === "struct") {
                structs[item.name] = {
                    size: item.size,
                    properties: item.members || []
                };
            }
            if (item.type === "event") {
                const _name = (0, helpers_1.getFullSelectorFromName)(item.name);
                events[_name] = item;
            }
        }
        return { functions, structs, events };
    }
    async initialize(provider) {
        const _provider = provider ? provider : this.provider;
        if (!_provider) {
            throw new Error(`ContractCallAnalyzer::initialize - No provider for this instance (provider: ${this.provider})`);
        }
        const { events, functions, structs } = await ContractCallOrganizer.getFullContractAbi(this.address, _provider);
        this._structs = structs;
        this._functions = functions;
        this._events = events;
        this._provider = _provider;
        return this;
    }
    async callViewFn(entrypoint, calldata, provider) {
        const _provider = provider ? provider : this.provider;
        if (!_provider) {
            throw new Error(`ContractCallAnalyzer::callViewFn - No provider for this instance (provider: ${this.provider})`);
        }
        const { result: rawRes } = await _provider.callContract({
            contractAddress: this.address,
            entrypoint,
            calldata: calldata || []
        });
        const rawResBN = rawRes.map((rawPool) => ethers_1.BigNumber.from(rawPool));
        // const { subcalldata } = this.organizeFunctionOutput(
        //     getFullSelectorFromName(entrypoint),
        //     rawResBN
        // ) as any;
        const { subcalldata } = this.organizeFunctionOutput((0, helpers_1.getFullSelectorFromName)(entrypoint), rawResBN);
        return subcalldata;
    }
    organizeFunctionInput(functionSelector, fullCalldataValues, startIndex) {
        const inputs = this.getFunctionAbiFromSelector(functionSelector).inputs;
        let calldataIndex = startIndex || 0;
        let calldata = [];
        for (const input of inputs) {
            const { argsValues, endIndex } = this._getArgumentsValuesFromCalldata(input.type, { fullCalldataValues: fullCalldataValues, startIndex: calldataIndex });
            calldataIndex = endIndex;
            calldata.push({ ...input, value: argsValues });
        }
        return { subcalldata: calldata, endIndex: calldataIndex };
    }
    organizeFunctionOutput(functionSelector, fullCalldataValues, startIndex) {
        const outputs = this.getFunctionAbiFromSelector(functionSelector).outputs;
        let calldataIndex = startIndex || 0;
        let calldata = [];
        for (const output of outputs) {
            const { argsValues, endIndex } = this._getArgumentsValuesFromCalldata(output.type, { fullCalldataValues: fullCalldataValues, startIndex: calldataIndex });
            calldataIndex = endIndex;
            calldata.push({ ...output, value: argsValues });
        }
        return { subcalldata: calldata, endIndex: calldataIndex };
    }
    organizeEvent(event) {
        // TODO: make another for loop for each keys in case many events are triggered
        // (never saw this case yet after analysing hundreds of blocks)
        // RE: Found one at txHash 0x2a709a4b385ee4ff07303636c3fe71964853cdaed824421475d639ab9b4eb9d (on goerli) but it's unclear how to interpret it
        if (event.keys.length > 1) {
            throw new Error(`ContractAnalyzer::structureEvent - You forwarded an event with many keys. This is a reminder this need to be added.`);
        }
        const eventAbi = this.getEventAbiFromKey((0, helpers_1.getFullSelector)(event.keys[0]));
        let dataIndex = 0;
        let eventArgs = [];
        for (const arg of eventAbi.data) {
            const { argsValues, endIndex } = this._getArgumentsValuesFromCalldata(arg.type, { fullCalldataValues: event.data, startIndex: dataIndex });
            dataIndex = endIndex;
            eventArgs.push({ ...arg, value: argsValues });
        }
        return { name: eventAbi.name, transmitterContract: event.from_address, calldata: eventArgs };
    }
    _getArgumentsValuesFromCalldata(type, calldata) {
        const rawType = type.includes("*") ? type.slice(0, type.length - 1) : type;
        if (type === "felt") {
            const { felt, endIndex } = this._getFeltFromCalldata(calldata.fullCalldataValues, calldata.startIndex);
            return { argsValues: felt, endIndex };
        }
        else if (type === "felt*") {
            const size = this._getArraySizeFromCalldata(calldata);
            const { feltArray, endIndex } = this._getFeltArrayFromCalldata(calldata.fullCalldataValues, calldata.startIndex, size);
            return { argsValues: feltArray, endIndex };
        }
        else if (!type.includes("*") && type !== "felt") {
            const { structCalldata, endIndex } = this._getStructFromCalldata(rawType, calldata.fullCalldataValues, calldata.startIndex);
            return { argsValues: structCalldata, endIndex };
        }
        else {
            const size = this._getArraySizeFromCalldata(calldata);
            const { structArray, endIndex } = this._getStructArrayFromCalldata(rawType, calldata.fullCalldataValues, calldata.startIndex, size);
            return { argsValues: structArray, endIndex };
        }
    }
    _getArraySizeFromCalldata(calldata) {
        try {
            const size = ethers_1.BigNumber.from(calldata.fullCalldataValues[calldata.startIndex - 1].toString()).toNumber();
            return size;
        }
        catch (error) {
            console.log("ContractAnalysze::getArraySizeFromCalldata - error", error);
            throw new Error(`ContractAnalysze::getArraySizeFromCalldata - Error trying to get the previous calldata index and converting it into number (value: ${calldata.fullCalldataValues[calldata.startIndex - 1]})`);
        }
    }
    _getFeltFromCalldata(calldata, startIndex) {
        const felt = calldata[startIndex];
        return { felt, endIndex: startIndex + 1 };
    }
    _getFeltArrayFromCalldata(calldata, startIndex, sizeOfArray) {
        let feltArray = [];
        let calldataIndex = startIndex;
        for (let j = startIndex; j < startIndex + sizeOfArray; j++) {
            feltArray.push(calldata[j]);
            calldataIndex++;
        }
        return { feltArray, endIndex: calldataIndex };
    }
    _getStructFromCalldata(type, calldata, startIndex) {
        const structAbi = this.getStructAbiFromStructType(type);
        let structCalldata = {};
        let calldataIndex = startIndex;
        for (const property of structAbi.properties) {
            const { argsValues, endIndex } = this._getArgumentsValuesFromCalldata(property.type, { fullCalldataValues: calldata, startIndex: calldataIndex });
            structCalldata[property.name] = argsValues;
            calldataIndex = endIndex;
        }
        return { structCalldata, endIndex: calldataIndex };
    }
    _getStructArrayFromCalldata(type, calldata, startIndex, size) {
        const structAbi = this.getStructAbiFromStructType(type);
        let structArray = [];
        let calldataIndex = startIndex;
        for (let j = 0; j < size; j++) {
            let singleStruct = {};
            for (const property of structAbi.properties) {
                const { argsValues, endIndex } = this._getArgumentsValuesFromCalldata(property.type, { fullCalldataValues: calldata, startIndex: calldataIndex });
                singleStruct[property.name] = argsValues;
                calldataIndex = endIndex;
            }
            structArray.push(singleStruct);
        }
        return { structArray, endIndex: calldataIndex };
    }
    getFunctionAbiFromSelector(_functionSelector) {
        const functionSelector = (0, helpers_1.getFullSelector)(_functionSelector);
        if (functionSelector === "0x00")
            return {
                "inputs": [
                    {
                        "name": "call_array_len",
                        "type": "felt"
                    },
                    {
                        "name": "call_array",
                        "type": "CallArray*"
                    },
                    {
                        "name": "calldata_len",
                        "type": "felt"
                    },
                    {
                        "name": "calldata",
                        "type": "felt*"
                    },
                    {
                        "name": "nonce",
                        "type": "felt"
                    }
                ],
                "name": "__execute__",
                "outputs": [
                    {
                        "name": "retdata_size",
                        "type": "felt"
                    },
                    {
                        "name": "retdata",
                        "type": "felt*"
                    }
                ],
                "type": "function"
            };
        if (!this.functions) {
            throw new Error(`ContractAnalyzer::getFunctionFromSelector - On contract ${this.address} no functions declared for this ContractAnalyzer instance (functions: ${this.functions})`);
        }
        const fn = this.functions[functionSelector];
        if (!fn) {
            throw new Error(`ContractAnalyzer::getFunctionFromSelector - On contract ${this.address} no functions matching this selector (selector: ${functionSelector})`);
        }
        return fn;
    }
    getStructAbiFromStructType(type) {
        if (!this.structs) {
            throw new Error(`ContractAnalyzer::getStructFromStructs - On contract ${this.address} no struct specified for this instance (structs: ${this.structs})`);
        }
        const struct = this.structs[type];
        if (!struct) {
            throw new Error(`ContractAnalyzer::getStructFromStructs - On contract ${this.address} no struct specified for this type (structType: ${type})`);
        }
        return struct;
    }
    getEventAbiFromKey(key) {
        if (!this.events) {
            throw new Error(`ContractAnalyzer::getEventFromKey - On contract ${this.address} no events specified for this instance (events: ${this.events})`);
        }
        const event = this.events[key];
        if (!event) {
            throw new Error(`ContractAnalyzer::getEventFromKey - On contract ${this.address}, no events specified for this key (key: ${key})`);
        }
        return event;
    }
    get address() {
        return this._address;
    }
    get structs() {
        return this._structs;
    }
    get functions() {
        return this._functions;
    }
    get events() {
        return this._events;
    }
    get abi() {
        return {
            functions: this.functions,
            events: this.events,
            structs: this.structs
        };
    }
    get provider() {
        return this._provider;
    }
}
exports.ContractCallOrganizer = ContractCallOrganizer;
//# sourceMappingURL=ContractCallOrganizer.js.map