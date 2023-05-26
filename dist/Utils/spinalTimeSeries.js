"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_model_timeseries_1 = require("spinal-model-timeseries");
let instance = null;
function getInstance() {
    if (instance === null) {
        instance = new spinal_model_timeseries_1.SpinalServiceTimeseries();
    }
    return instance;
}
exports.default = getInstance;
//# sourceMappingURL=spinalTimeSeries.js.map