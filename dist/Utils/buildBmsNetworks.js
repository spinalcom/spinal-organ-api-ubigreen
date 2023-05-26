"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
require("json5/lib/register");
const config = require("../../config.json5");
async function buildBmsNetworks(networkName, generateData, graph) {
    const context = await graph.getContext(config.organ.contextName);
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
        childFoundId = await generateData.nwService
            .createNewBmsNetwork(context.getId().get(), config.organ.networkType, networkName)
            .then(res => res.id.get());
    }
    return childFoundId;
}
exports.default = buildBmsNetworks;
//# sourceMappingURL=buildBmsNetworks.js.map