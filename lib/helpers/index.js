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
exports.getArrayDepth = exports.forceCast = exports.uint256ToBN = exports.getFullSelectorFromName = exports.sleep = void 0;
const starknet_1 = require("starknet");
const sleep = async function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const getFullSelectorFromName = function (entrypoint) {
    return (0, starknet_1.addAddressPadding)(starknet_1.hash.getSelectorFromName(entrypoint));
};
exports.getFullSelectorFromName = getFullSelectorFromName;
const uint256ToBN = function (num) {
    return BigInt(num.low) + BigInt(num.high);
};
exports.uint256ToBN = uint256ToBN;
const forceCast = function (input) {
    return input;
};
exports.forceCast = forceCast;
const getArrayDepth = function (value) {
    return Array.isArray(value) ?
        1 + Math.max(0, ...value.map(exports.getArrayDepth)) :
        0;
};
exports.getArrayDepth = getArrayDepth;
__exportStar(require("./ContractCallOrganizerStorage"), exports);
__exportStar(require("./constants"), exports);
//# sourceMappingURL=index.js.map