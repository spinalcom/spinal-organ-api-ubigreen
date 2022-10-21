"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDataDevice = void 0;
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const genUID_1 = require("../../../Utils/genUID");
class InputDataDevice {
    constructor(name = 'default device name', type = 'default device type', id = (0, genUID_1.genUID)('InputDataDevice'), path = 'default device path', serial = "", refInstallation = "", customerReference = "", ubigreenReference = "", positionReference = "") {
        this.nodeTypeName = spinal_model_bmsnetwork_1.SpinalBmsDevice.nodeTypeName;
        this.id = id;
        this.name = name;
        this.type = type;
        this.path = path;
        this.serial = serial;
        this.refInstallation = refInstallation;
        this.customerReference = customerReference;
        this.ubigreenReference = ubigreenReference;
        this.positionReference = positionReference;
        this.children = [];
    }
}
exports.InputDataDevice = InputDataDevice;
//# sourceMappingURL=InputDataDevice.js.map