"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkProcess = void 0;
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const spinal_env_viewer_plugin_documentation_service_1 = require("spinal-env-viewer-plugin-documentation-service");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
class NetworkProcess {
    constructor(inputData) {
        this.inputData = inputData;
        this.nwService = new spinal_model_bmsnetwork_1.NetworkService();
        this.nwService.setupDelay(60000);
    }
    async init(forgeFile, configOrgan) {
        const rep = await this.nwService.init(forgeFile, configOrgan);
        this.contextId = rep.contextId;
        this.inputData.setOnDataCBFunc(this.updateData.bind(this));
    }
    async updateAttr(dataDevice) {
        let attrObj = {
            serial: dataDevice.serial,
            refInstallation: dataDevice.refInstallation,
            customerReference: dataDevice.customerReference,
            ubigreenReference: dataDevice.ubigreenReference,
            positionReference: dataDevice.positionReference
        };
        const keys = Object.keys(attrObj);
        const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(this.contextId);
        const nodes = await context.findInContext(context, (node, stop) => {
            var _a;
            if (((_a = node.info.idNetwork) === null || _a === void 0 ? void 0 : _a.get()) === dataDevice.id) {
                stop();
                return true;
            }
            return false;
        });
        for (const node of nodes) {
            const category = await spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.getCategoryByName(node, "default");
            const attrs = await spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.getAttributesByCategory(node, category);
            for (const key of keys) {
                let found = false;
                for (const attr of attrs) {
                    if (key === attr.label.get()) {
                        found = true;
                        attr.value.set(attrObj[key]);
                        break;
                    }
                }
                if (found === false) {
                    spinal_env_viewer_plugin_documentation_service_1.serviceDocumentation.addAttributeByCategory(node, category, key, attrObj[key]);
                }
            }
        }
    }
    async updateData(obj) {
        console.log("Update data device ! => ", obj.name);
        await this.nwService.updateData.call(this.nwService, obj);
        await this.updateAttr(obj);
    }
}
exports.NetworkProcess = NetworkProcess;
//# sourceMappingURL=NetworkProcess.js.map