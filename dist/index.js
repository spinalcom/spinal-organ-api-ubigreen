"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require('querystring');
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
require("json5/lib/register");
const config = require("../config.json5");
const InputData_1 = require("./modules/InputData/InputData");
const NetworkProcess_1 = require("./modules/NetworkProcess");
const ApiConnector_1 = require("./modules/ApiConnector");
const connectOpt = `http://${config.spinalConnector.user}:${config.spinalConnector.password}@${config.spinalConnector.host}:${config.spinalConnector.port}/`;
const conn = spinal_core_connectorjs_type_1.spinalCore.connect(connectOpt);
spinal_core_connectorjs_type_1.spinalCore.load(conn, config.file.path, onLoadSuccess, onLoadError);
function onLoadError() {
    console.log(`File does not exist in location ${config.file.path}`);
}
async function onLoadSuccess(forgeFile) {
    console.log("Connected to the server and got the Entry Model");
    const apiConnector = new ApiConnector_1.ApiConnector();
    const inputData = new InputData_1.InputData(apiConnector);
    const networkProcess = new NetworkProcess_1.NetworkProcess(inputData);
    networkProcess.init(forgeFile, config.organ).then(async () => {
        await buildBmsNetworks("SmartRoom", networkProcess, forgeFile);
        await buildBmsNetworks("SmartFlow", networkProcess, forgeFile);
    });
}
async function buildBmsNetworks(networkName, networkProcess, forgeFile) {
    const context = await forgeFile.getContext(config.organ.contextName);
    const childrenContext = await spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext(context.getId().get(), context.getId().get());
    let childFoundId = '';
    for (const childContext of childrenContext) {
        if (typeof childContext.networkName !== 'undefined' &&
            childContext.networkName.get() === networkName) {
            childFoundId = childContext.id.get();
            break;
        }
    }
    if (childFoundId === '') {
        childFoundId = await networkProcess.nwService
            .createNewBmsNetwork(context.getId().get(), config.organ.networkType, networkName)
            .then(res => res.id.get());
    }
    return childFoundId;
}
//# sourceMappingURL=index.js.map