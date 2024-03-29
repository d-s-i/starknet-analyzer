"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractCallOrganizer = void 0;
const starknet_1 = require("starknet");
const helpers_1 = require("../helpers");
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
        let { functions, structs, events, enums } = await this.organizeContractAbiFromContractAddress(contractAddress, provider);
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
                contractAddress: contractAddress,
                entrypoint: implementationEntryPoints[getImplementationIndex]
            });
            try {
                const { functions: implementationFunctions, structs: implementationStructs, events: implementationEvents, enums: implementationEnums } = await this.organizeContractAbiFromClassHash(implementationClassHash, provider);
                functions = { ...functions, ...implementationFunctions };
                structs = { ...structs, ...implementationStructs };
                events = { ...events, ...implementationEvents };
                enums = { ...enums, ...implementationEnums };
            }
            catch (error) {
                console.log(" -- ContractCallOrganizer::getFullContractAbi -- ");
                console.log(error);
            }
        }
        return { functions, structs, events, enums };
    }
    static async organizeContractAbiFromContractAddress(contractAddress, provider) {
        // putting defaultProvider by default bc pathfinder nodes doesn't return abis
        const { abi } = await provider.getClassAt(contractAddress);
        if (!abi) {
            throw new Error(`ContractCallOrganizer::_organizeContractAbi - Couldn't fetch abi for address ${contractAddress}`);
        }
        return this.organizeContractAbiFromAbi(typeof (abi) === "string" ? JSON.parse(abi) : abi); // starknetjs type is incorrect and forward a string instead of an array
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
        let enums = {};
        let events = {};
        let structs = {};
        const interfaces = [];
        for (const item of abi) {
            if (item.type === "impl")
                continue;
            if (item.type === "function" ||
                item.type === "l1_handler" ||
                item.type === "constructor") {
                const itemName = this._extractNameFromPath(item.name);
                const _name = (0, helpers_1.getFullSelectorFromName)(itemName);
                functions[_name] = item;
            }
            else if (item.type === "struct") {
                structs[item.name] = {
                    type: item.type,
                    name: item.name,
                    members: item.members || []
                };
            }
            else if (item.type === "enum") {
                enums[item.name] = item;
            }
            else if (item.type === "event") {
                const itemName = this._extractNameFromPath(item.name);
                const _name = (0, helpers_1.getFullSelectorFromName)(itemName);
                events[_name] = item;
            }
            else if (item.type === "interface") {
                interfaces.push(item);
            }
            else {
                console.log("item", item);
                throw new Error(`ContractCallOrganizer::organizeContractAbiFromAbi - Unhandled item type ${item.type}`);
            }
        }
        for (const iface of interfaces) {
            for (const item of iface.items) {
                if (item.type === "function") {
                    const itemName = this._extractNameFromPath(item.name);
                    const _name = (0, helpers_1.getFullSelectorFromName)(itemName);
                    functions[_name] = item;
                }
                else {
                    throw new Error(`ContractCallOrganizer::organizeContractAbiFromAbi - Unhandled item type in interface ${item.type}`);
                }
            }
        }
        return { functions, structs, enums, events };
    }
    async initialize(provider) {
        const _provider = provider ? provider : this.provider;
        if (!_provider) {
            throw new Error(`ContractCallAnalyzer::initialize - No provider for this instance (provider: ${this.provider})`);
        }
        const { events, functions, structs, enums } = await ContractCallOrganizer.getFullContractAbi(this.address, _provider);
        this._structs = structs;
        this._functions = functions;
        this._events = events;
        this._enums = enums;
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
        const rawResBN = rawRes.map((rawPool) => BigInt(rawPool));
        const { subcalldata } = this.organizeFunctionOutput((0, helpers_1.getFullSelectorFromName)(entrypoint), rawResBN);
        return subcalldata;
    }
    organizeFunctionInput(functionSelector, fullCalldataValues, startIndex) {
        const inputs = this.getFunctionAbiFromSelector(functionSelector).inputs;
        let calldataIndex = startIndex || 0;
        let calldata = [];
        for (const input of inputs) {
            const { argsValues, endIndex } = this._decodeData(input.type, { fullCalldataValues: fullCalldataValues, startIndex: calldataIndex });
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
            const { argsValues, endIndex } = this._decodeData(output.type, { fullCalldataValues: fullCalldataValues, startIndex: calldataIndex });
            calldataIndex = endIndex;
            calldata.push({ ...output, value: argsValues });
        }
        if (calldataIndex !== fullCalldataValues.length) {
            console.log("dataIndex", calldataIndex);
            console.log("event.data.length", fullCalldataValues.length, fullCalldataValues);
            throw new Error(`ContractCallOrganizer::organizeFunctionOutput - Data should have reached end of event calldata (make sure you didn't forgot to handle a given type)`);
        }
        return { subcalldata: calldata, endIndex: calldataIndex };
    }
    organizeEvent(event) {
        const eventSelector = event.keys[0];
        const eventAbi = this.getEventAbiFromKey((0, starknet_1.addAddressPadding)(eventSelector));
        let dataIndex = 0;
        let eventArgs = [];
        let eventInKeys = [];
        for (const member of eventAbi.members) {
            if (member.kind === "key") {
                eventInKeys.push(member);
                continue;
            }
            if (member.kind === "data") {
                const { argsValues, endIndex } = this._decodeData(member.type, { fullCalldataValues: event.data, startIndex: dataIndex });
                dataIndex = endIndex;
                eventArgs.push({ ...member, value: argsValues });
            }
            else {
                console.log("event", event);
                throw new Error(`ContractCallOrganizer::organizeEvent - Unhandled member kind ${member.kind} for event`);
            }
        }
        if (dataIndex !== event.data.length) {
            console.log("dataIndex", dataIndex);
            console.log("event.data.length", event.data.length);
            throw new Error(`ContractCallOrganizer::organizeEvent - Data should have reached end of event calldata (make sure you didn't forgot to handle a given type)`);
        }
        for (let i = 0; i < eventInKeys.length; i++) {
            const arg = eventInKeys[i];
            const value = event.keys[i + 1];
            eventArgs.push({ ...arg, value });
        }
        return { name: eventAbi.name, transmitterContract: event.from_address, calldata: eventArgs };
    }
    _decodeData(type, calldata) {
        const _struct = this.structs && this.structs[type];
        const _enum = this.enums && this.enums[type];
        if (_struct) {
            const { structCalldata: argsValues, endIndex } = this._getStructFromCalldata(_struct, calldata.fullCalldataValues, calldata.startIndex);
            return { argsValues, endIndex };
        }
        else if (_enum) {
            // const enumPath = _enum.name.split("::");
            // const enumName = enumPath[enumPath.length - 1];
            // const value = { [enumName]:  };
            return { argsValues: calldata.fullCalldataValues[calldata.startIndex], endIndex: calldata.startIndex + 1 };
        }
        else {
            if (this._isArray(type)) {
                const arrayType = this._getArrayType(type);
                const { arrValues, endIndex } = this._getArrayFromCalldata(arrayType, calldata.fullCalldataValues, calldata.startIndex);
                return { argsValues: arrValues, endIndex: endIndex };
            }
            return { argsValues: calldata.fullCalldataValues[calldata.startIndex], endIndex: calldata.startIndex + 1 };
        }
    }
    _getStructFromCalldata(structAbi, fullCalldataValues, startIndex) {
        let structCalldata = {};
        let calldataIndex = startIndex;
        for (const property of structAbi.members) {
            const { argsValues, endIndex } = this._decodeData(property.type, { fullCalldataValues: fullCalldataValues, startIndex: calldataIndex });
            structCalldata[property.name] = argsValues;
            calldataIndex = endIndex;
        }
        return { structCalldata, endIndex: calldataIndex };
    }
    /**
     * @dev - Might need to add an arrayDepth to calldataFinalEndIndex instead of just `startIndex + 1` that probably works only for 1 depth
     * Need to handle multiple depths
     * @param type
     * @param fullCalldataValues
     * @param startIndex
     * @returns
     */
    _getArrayFromCalldata(type, fullCalldataValues, startIndex) {
        const isNestedArray = this._isArray(type);
        if (isNestedArray) {
            const arrayType = this._getArrayType(type);
            return this._getArrayFromCalldata(arrayType, fullCalldataValues, startIndex + 1);
        }
        else {
            let calldataFinalEndIndex = startIndex + 1;
            const arrLength = +fullCalldataValues[startIndex].toString();
            const start = startIndex + 1; // first value comes from after array length
            const end = start + arrLength;
            let arrValues = [];
            for (let i = start; i < end; i++) {
                const { argsValues, endIndex } = this._decodeData(type, { fullCalldataValues, startIndex: calldataFinalEndIndex });
                arrValues.push(argsValues);
                calldataFinalEndIndex = endIndex;
            }
            return { arrValues, endIndex: calldataFinalEndIndex };
        }
    }
    getFunctionAbiFromSelector(_functionSelector) {
        const functionSelector = (0, starknet_1.addAddressPadding)(_functionSelector);
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
            throw new Error(`ContactCallOrganizer::getFunctionFromSelector - On contract ${this.address} no functions declared for this ContactCallOrganizer instance (functions: ${this.functions})`);
        }
        const fn = this.functions[functionSelector];
        if (!fn) {
            throw new Error(`ContactCallOrganizer::getFunctionFromSelector - On contract ${this.address} no functions matching this selector (selector: ${functionSelector})`);
        }
        return fn;
    }
    getStructAbiFromStructType(type) {
        if (!this.structs) {
            throw new Error(`ContactCallOrganizer::getStructFromStructs - On contract ${this.address} no struct specified for this instance (structs: ${this.structs})`);
        }
        const struct = this.structs[type];
        if (!struct) {
            // console.log(this.structs)
            throw new Error(`ContactCallOrganizer::getStructFromStructs - On contract ${this.address} no struct specified for this type (structType: ${type})`);
        }
        return struct;
    }
    getEnumAbiFromStructType(type) {
        if (!this.enums) {
            throw new Error(`ContactCallOrganizer::getEnumAbiFromStructType - On contract ${this.address} no enum specified for this instance (enums: ${this.structs})`);
        }
        const _enum = this.enums[type];
        if (!_enum) {
            // console.log(this.structs)
            throw new Error(`ContactCallOrganizer::getEnumAbiFromStructType - On contract ${this.address} no enum specified for this type (enumType: ${type})`);
        }
        return _enum;
    }
    getEventAbiFromKey(key) {
        if (!this.events) {
            throw new Error(`ContactCallOrganizer::getEventFromKey - On contract ${this.address} no events specified for this instance (events: ${this.events})`);
        }
        const event = this.events[key];
        if (!event) {
            // console.log("this.events", this.events);
            throw new Error(`ContactCallOrganizer::getEventFromKey - On contract ${this.address}, no events specified for this key (key: ${key})`);
        }
        return event;
    }
    static _extractNameFromPath(path) {
        const pathArr = path.split("::");
        return pathArr[pathArr.length - 1];
    }
    _isArray(type) {
        const pathArr = type.split("::");
        const isArray = (pathArr[0] === "core" || pathArr[0] === "@core") && pathArr[1] === "array";
        return (isArray);
    }
    _arrayDepthFromType(type) {
        return (type.match(/core::array/g) || []).length;
    }
    _getArrayType(type) {
        const typeStart = type.indexOf("<") + 1;
        const typeEnd = type.lastIndexOf(">");
        const arrayType = type.slice(typeStart, typeEnd);
        return arrayType;
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
    get enums() {
        return this._enums;
    }
    get abi() {
        return {
            functions: this.functions,
            events: this.events,
            structs: this.structs,
            enums: this.enums
        };
    }
    get provider() {
        return this._provider;
    }
}
exports.ContractCallOrganizer = ContractCallOrganizer;
//# sourceMappingURL=ContractCallOrganizer.js.map