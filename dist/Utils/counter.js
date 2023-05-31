"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const spinalTimeSeries_1 = __importDefault(require("./spinalTimeSeries"));
const fs = require("fs/promises");
require("json5/lib/register");
const config = require("../../config.json5");
async function networkSmartRoomCounter(apiConnector) {
    try {
        const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(config.organDesk.contextName);
        const networks = await context.getChildren('hasBmsNetwork');
        let network;
        for (const _network of networks) {
            if (_network.getName().get() === 'SmartRoom') {
                network = _network;
            }
        }
        const devices = await network.getChildren('hasBmsDevice');
        const url = config.host + config.counter_url_smartroom;
        for (let index = 4; index <= 5; index++) {
            console.log("request", index);
            const elements = [];
            await waitSync();
            const rep = await apiConnector.get(url + `?pageNumber=${index}`);
            const json = JSON.stringify(rep.data);
            await fs.writeFile('reponse.json', json);
            elements.push(...rep.data.elements);
            let map = new Map();
            const date1 = new Date();
            date1.setHours(date1.getHours() - 3);
            const date2 = new Date();
            date2.setHours(date2.getHours() - 1);
            const _date1 = Math.trunc(date1.getTime() / 1000);
            const _date2 = Math.trunc(date2.getTime() / 1000);
            for (const element of elements) {
                if (element.dateBegin < _date2 && element.dateBegin > _date1) {
                    let item = map.get(element.serial);
                    if (item === undefined) {
                        item = [];
                        map.set(element.serial, item);
                    }
                    item.push({ date: element.dateBegin, value: element.counter });
                }
            }
            const promise = [];
            for (const [serial, arrayMap] of map) {
                const device = devices.find((_device) => {
                    return _device.getName().get() === serial;
                });
                if (device) {
                    promise.push(insertTimeseries(device, arrayMap));
                }
            }
            await Promise.all(promise);
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.default = networkSmartRoomCounter;
async function insertTimeseries(device, arrayMap) {
    const endpoints = await device.getChildren('hasBmsEndpoint');
    for (const endpoint of endpoints) {
        if (endpoint.getName().get() === ' Counter') {
            spinal_env_viewer_graph_service_1.SpinalGraphService._addNode(endpoint);
            for (const { date, value } of arrayMap) {
                var timeseries = await (0, spinalTimeSeries_1.default)().getOrCreateTimeSeries(endpoint.getId().get());
                await timeseries.insert(value, date * 1000);
            }
        }
    }
}
function waitSync() {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("waitsync");
            return resolve();
        }, 3000);
    });
}
//# sourceMappingURL=counter.js.map