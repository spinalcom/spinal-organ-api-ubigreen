"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signalR_1 = __importDefault(require("./signalR/signalR"));
const generateData_1 = require("./modules/generateData");
const ApiConnector_1 = require("./modules/ApiConnector");
const spinalMiddelware_1 = __importDefault(require("./spinalMiddelware"));
const counter_1 = __importDefault(require("./Utils/counter"));
const config_1 = require("./config");
const LastRunDiscover_1 = require("./Utils/LastRunDiscover");
async function run_counter(obj) {
    await (0, signalR_1.default)([
        obj.generateDataSmartdesk,
        obj.generateDataSmartroom,
        obj.generateDataSmartflow,
    ]);
    const cron = require('node-cron');
    cron.schedule('0 */2 * * *', async function () {
        await (0, counter_1.default)(obj.apiConnector);
    });
}
async function run_discover(obj) {
    let lastRun = await (0, LastRunDiscover_1.getLastRunDiscover)();
    if (lastRun) {
        const now = Date.now();
        lastRun += 1000 * 60 * 60;
        const diff = now - lastRun;
        if (diff < 1000 * 60 * 60) {
            console.log('Last run was less than an hour ago, wait %s s.', diff);
            await new Promise((resolve) => setTimeout(resolve, diff));
        }
    }
    (0, LastRunDiscover_1.setLastRunDiscover)();
    const ubigreenContexte = await obj.graph.getContext(config_1.NETWORK_CONFIG_ORGAN_DESK.contextName);
    await obj.generateDataSmartdesk.discoverData(ubigreenContexte, config_1.NETWORK_CONFIG_ORGAN_DESK.networkName);
    await obj.generateDataSmartdesk.waitSync();
    await obj.generateDataSmartroom.discoverData(ubigreenContexte, config_1.NETWORK_CONFIG_ORGAN_ROOM.networkName);
    await obj.generateDataSmartroom.waitSync();
    await obj.generateDataSmartflow.discoverData(ubigreenContexte, config_1.NETWORK_CONFIG_ORGAN_FLOW.networkName);
    await (0, signalR_1.default)([
        obj.generateDataSmartdesk,
        obj.generateDataSmartroom,
        obj.generateDataSmartflow,
    ]);
}
async function init() {
    const spinalMiddelware = new spinalMiddelware_1.default();
    const graph = await spinalMiddelware.getGraph();
    if (graph) {
        console.log('Connected to the server and got the Entry Model');
        const apiConnector = new ApiConnector_1.ApiConnector();
        const generateDataSmartdesk = new generateData_1.GenerateData(apiConnector);
        const generateDataSmartroom = new generateData_1.GenerateData(apiConnector);
        const generateDataSmartflow = new generateData_1.GenerateData(apiConnector);
        await generateDataSmartdesk.init(graph, config_1.NETWORK_CONFIG_ORGAN_DESK);
        await generateDataSmartroom.init(graph, config_1.NETWORK_CONFIG_ORGAN_ROOM);
        await generateDataSmartflow.init(graph, config_1.NETWORK_CONFIG_ORGAN_FLOW);
        return {
            graph,
            apiConnector,
            generateDataSmartdesk,
            generateDataSmartroom,
            generateDataSmartflow,
        };
    }
    throw new Error('Cannot connect to the server');
}
async function main() {
    if (process.env.ORGAN_RUN_MODE === 'MODE_DISCOVER') {
        const data = await init();
        await run_discover(data);
    }
    else if (process.env.ORGAN_RUN_MODE === 'MODE_COUNTER') {
        const data = await init();
        await run_counter(data);
    }
    else {
        console.error('"ORGAN_RUN_MODE" in .env must be one of "MODE_DISCOVER" or "MODE_COUNTER"');
        process.exit(-1);
    }
}
main();
//# sourceMappingURL=index.js.map