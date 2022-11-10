"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkProcess = void 0;
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
class NetworkProcess {
    constructor(inputData) {
        this.inputData = inputData;
        this.nwService = new spinal_model_bmsnetwork_1.NetworkService();
        this.nwService.setupDelay(60000);
    }
    async init(forgeFile, configOrgan) {
        const rep = await this.nwService.init(forgeFile, configOrgan);
        this.inputData.setOnDataCBFunc(this.updateData.bind(this));
    }
    updateData(obj) {
        console.log("Update data device ! => ", obj.name);
        this.nwService.updateData.call(this.nwService, obj);
    }
}
exports.NetworkProcess = NetworkProcess;
//# sourceMappingURL=NetworkProcess.js.map