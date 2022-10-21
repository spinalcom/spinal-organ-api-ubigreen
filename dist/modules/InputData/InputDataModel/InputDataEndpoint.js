"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDataEndpoint = void 0;
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const genUID_1 = require("../../../Utils/genUID");
class InputDataEndpoint {
    constructor(name = "default endpoint name", currentValue = 0, unit = "unit", dataType = spinal_model_bmsnetwork_1.InputDataEndpointDataType.Integer, type = spinal_model_bmsnetwork_1.InputDataEndpointType.Other, id = (0, genUID_1.genUID)("InputDataEndpoint"), path = "default endpoint path") {
        this.nodeTypeName = spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName;
        this.id = id;
        this.name = name;
        this.type = type;
        this.path = path;
        this.currentValue = currentValue;
        this.unit = unit;
        this.dataType = dataType;
        this.timeseries = [];
        this.idx = Math.floor(Math.random() * 100);
    }
}
exports.InputDataEndpoint = InputDataEndpoint;
//# sourceMappingURL=InputDataEndpoint.js.map