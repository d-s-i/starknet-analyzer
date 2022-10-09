"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
__exportStar(require("./ContractCallOrganizerStorage"), exports);
__exportStar(require("./constants"), exports);
//# sourceMappingURL=index.js.map