"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDataEndpointGroup = void 0;
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const genUID_1 = require("../../../Utils/genUID");
class InputDataEndpointGroup {
    constructor(name = 'default EndpointGroup name', type = 'default EndpointGroup type', id = (0, genUID_1.genUID)('InputDataEndpointGroup'), path = 'default EndpointGroup path') {
        this.nodeTypeName = spinal_model_bmsnetwork_1.SpinalBmsEndpointGroup.nodeTypeName;
        this.id = id;
        this.name = name;
        this.type = type;
        this.path = path;
        this.children = [];
    }
}
exports.InputDataEndpointGroup = InputDataEndpointGroup;
//# sourceMappingURL=InputDataEndpointGroup.js.map