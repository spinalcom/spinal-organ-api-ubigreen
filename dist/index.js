"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("json5/lib/register");
const config = require("../config.json5");
const generateData_1 = require("./modules/generateData");
const ApiConnector_1 = require("./modules/ApiConnector");
const spinalMiddelware_1 = __importDefault(require("./spinalMiddelware"));
const counter_1 = __importDefault(require("./Utils/counter"));
async function main() {
    const spinalMiddelware = new spinalMiddelware_1.default();
    const graph = await spinalMiddelware.getGraph();
    if (graph) {
        console.log("Connected to the server and got the Entry Model");
        const apiConnector = new ApiConnector_1.ApiConnector();
        const generateDataSmartdesk = new generateData_1.GenerateData(apiConnector);
        const generateDataSmartroom = new generateData_1.GenerateData(apiConnector);
        const generateDataSmartflow = new generateData_1.GenerateData(apiConnector);
        await generateDataSmartdesk.init(graph, config.organDesk);
        await generateDataSmartroom.init(graph, config.organRoom);
        await generateDataSmartflow.init(graph, config.organFlow);
        const ubigreenContexte = await graph.getContext(config.organDesk.contextName);
        await (0, counter_1.default)(apiConnector);
    }
}
main();
//# sourceMappingURL=index.js.map