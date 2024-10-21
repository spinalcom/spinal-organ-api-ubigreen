"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLastRunDiscover = exports.getLastRunDiscover = void 0;
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fileName = (0, path_1.resolve)(__dirname, '..', '..', '.lastrun');
async function getLastRunDiscover() {
    try {
        const fileData = await (0, promises_1.readFile)(fileName, 'utf8');
        return parseInt(fileData);
    }
    catch (error) {
        return 0;
    }
}
exports.getLastRunDiscover = getLastRunDiscover;
function setLastRunDiscover() {
    return (0, promises_1.writeFile)(fileName, Date.now().toString());
}
exports.setLastRunDiscover = setLastRunDiscover;
//# sourceMappingURL=LastRunDiscover.js.map