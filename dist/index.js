"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const signalR_1 = __importDefault(require("./signalR/signalR"));
require("json5/lib/register");
const config = require("../config.json5");
const buildBmsNetworks_1 = __importDefault(require("./Utils/buildBmsNetworks"));
const InputData_1 = require("./modules/InputData/InputData");
const NetworkProcess_1 = require("./modules/NetworkProcess");
const ApiConnector_1 = require("./modules/ApiConnector");
const protocol = config.spinalConnector.protocol
    ? config.spinalConnector.protocol
    : 'http';
const host = config.spinalConnector.host +
    (config.spinalConnector.port ? `:${config.spinalConnector.port}` : '');
const login = `${config.spinalConnector.user}:${config.spinalConnector.password}`;
const connect_opt = `${protocol}://${login}@${host}/`;
console.log(`start connect to hub: ${protocol}://${host}/`);
const conn = spinal_core_connectorjs_type_1.spinalCore.connect(connect_opt);
spinal_core_connectorjs_type_1.spinalCore.load(conn, config.file.path, onLoadSuccess, onLoadError);
function onLoadError() {
    console.log(`File does not exist in location ${config.file.path}`);
}
async function onLoadSuccess(forgeFile) {
    console.log(forgeFile);
    console.log("Connected to the server and got the Entry Model");
    const apiConnector = new ApiConnector_1.ApiConnector();
    const inputData = new InputData_1.InputData(apiConnector);
    const networkProcess = new NetworkProcess_1.NetworkProcess(inputData);
    if (typeof forgeFile.graph !== 'undefined')
        forgeFile.rem_attr('graph');
    await networkProcess.init(forgeFile, config.organ).then(async () => {
        await (0, buildBmsNetworks_1.default)("SmartRoom", networkProcess, forgeFile);
        await (0, buildBmsNetworks_1.default)("SmartFlow", networkProcess, forgeFile);
    });
    await (0, signalR_1.default)(inputData);
}
//# sourceMappingURL=index.js.map