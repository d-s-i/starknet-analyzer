"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceCast = exports.uint256ToBN = exports.getFullSelector = exports.getFullSelectorFromName = exports.sleep = void 0;
const ethers_1 = require("ethers");
const hash_1 = require("starknet/utils/hash");
const sleep = async function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const getFullSelectorFromName = function (entrypoint) {
    return ethers_1.BigNumber.from((0, hash_1.getSelectorFromName)(entrypoint)).toHexString();
};
exports.getFullSelectorFromName = getFullSelectorFromName;
const getFullSelector = function (selector) {
    return ethers_1.BigNumber.from(selector).toHexString();
};
exports.getFullSelector = getFullSelector;
const uint256ToBN = function (num) {
    return ethers_1.BigNumber.from(num.low).add(num.high);
};
exports.uint256ToBN = uint256ToBN;
function forceCast(input) {
    return input;
}
exports.forceCast = forceCast;
//# sourceMappingURL=index.js.map