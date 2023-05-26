"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinalTimeSeries_1 = __importDefault(require("./spinalTimeSeries"));
require("json5/lib/register");
const config = require("../../config.json5");
async function networkSmartRoomCounter(apiConnector) {
    try {
        const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(config.organDesk.contextName);
        const networks = await context.getChildren('hasBmsNetwork');
        const url = config.host + config.counter_url_smartroom;
        for (let index = 9; index <= 12; index++) {
            const elements = [];
            await waitSync();
            const rep = await apiConnector.get(url + `?pageNumber=${index}`);
            elements.push(...rep.data.elements);
<<<<<<< HEAD
=======
            console.log("request", index, elements.length);
>>>>>>> 02c6f97e065e195ed62bed72395608982b2c9291
            for (const network of networks) {
                if (network.getName().get() === 'SmartRoom') {
                    const devices = await network.getChildren('hasBmsDevice');
                    for (const device of devices) {
                        const element = elements.find((item) => {
                            return item.serial === device.getName().get();
                        });
                        if (element) {
                            const endpoints = await device.getChildren('hasBmsEndpoint');
                            for (const endpoint of endpoints) {
                                if (endpoint.getName().get() === ' Counter') {
                                    spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(endpoint);
                                    var timeseries = await (0, spinalTimeSeries_1.default)().getOrCreateTimeSeries(endpoint.getId().get());
                                    let unix_timestamp = element.dateBegin;
                                    const datetimestamp = unix_timestamp * 1000;
                                    await timeseries.insert(element.counter, datetimestamp);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.default = networkSmartRoomCounter;
function waitSync() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("waitsync");
            return resolve();
        }, 3000);
    });
}
//# sourceMappingURL=counter.js.map