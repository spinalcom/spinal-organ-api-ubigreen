"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUID = void 0;
function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}
function genUID(constructor) {
    const res = `${constructor}-${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}-${Date.now().toString(16)}`;
    return res;
}
exports.genUID = genUID;
//# sourceMappingURL=genUID.js.map