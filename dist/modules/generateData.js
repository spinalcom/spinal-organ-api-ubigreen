"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateData = void 0;
const InputDataModel_1 = require("./InputData/InputDataModel/InputDataModel");
const spinal_model_bmsnetwork_1 = require("spinal-model-bmsnetwork");
const spinal_env_viewer_plugin_documentation_service_1 = require("spinal-env-viewer-plugin-documentation-service");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
require("json5/lib/register");
const config = require("../../config.json5");
class GenerateData {
    constructor(apiConnector) {
        this.apiConnector = apiConnector;
        this.nwService = new spinal_model_bmsnetwork_1.NetworkService();
    }
    async init(graph, configOrgan) {
        const rep = await this.nwService.init(graph, configOrgan);
        this.contextId = rep.contextId;
        this.networkId = rep.networkId;
        this.networkName = configOrgan.networkName;
    }
    async discoverData(context, networkName) {
        try {
            let UDevices = [];
            let SDevices;
            let serialArray = [];
            const networks = await context.getChildren('hasBmsNetwork');
            for (const network of networks) {
                if (network.getName().get() === networkName) {
                    SDevices = await network.getChildren('hasBmsDevice');
                }
            }
            for (const SDevice of SDevices) {
                serialArray.push(SDevice.getName().get());
            }
            if (networkName === 'SmartDesk') {
                const url = config.host + config.refDevices_url_smartdesk + '?pageSize=1000&pageNumber=2';
                const response = await this.apiConnector.get(url);
                UDevices = response.data.elements;
                await this.updateUdevices(UDevices, serialArray, networkName);
            }
            else if (networkName === 'SmartRoom') {
                const url = config.host + config.refDevices_url_smartroom + '?pageSize=1000&pageNumber=1';
                const response = await this.apiConnector.get(url);
                UDevices = response.data.elements;
                await this.updateUdevices(UDevices, serialArray, networkName);
            }
            else if (networkName === 'SmartFlow') {
                const url = config.host + config.refZones_url_smartflow;
                const response = await this.apiConnector.get(url);
                UDevices = response.data.elements;
                await this.updateUdevices(UDevices, serialArray, networkName);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async updateUdevices(UDevices, serialArray, networkName) {
        for (const UDevice of UDevices) {
            if (networkName === "SmartFlow") {
                if (serialArray.includes(UDevice.refZone) === false) {
                    const device = await this.generateDataZone(UDevice);
                    await this.nwService.updateData(device);
                    await this.updateAttr(device, networkName);
                }
            }
            else {
                if (serialArray.includes(UDevice.serial) === false) {
                    const device = await this.generateDataDevice(UDevice, networkName);
                    await this.nwService.updateData(device);
                    await this.updateAttr(device, networkName);
                }
            }
        }
    }
    async generateDataDevice(equipement, networkName) {
        function createFunc(str, type, constructor) {
            return new constructor(str, type, str, '', equipement.serial, equipement.refInstallation, equipement.customerReference, equipement.ubigreenReference, equipement.positionReference);
        }
        const device = createFunc(equipement.serial, 'device', InputDataModel_1.InputDataDevice);
        const occupationEventType = new InputDataModel_1.InputDataEndpoint(` Occupation`, 0, '', InputDataModel_1.InputDataEndpointDataType.String, InputDataModel_1.InputDataEndpointType.Other, `DEVICE-${equipement.serial} Occupation`, '');
        if (networkName === "SmartRoom") {
            const counterEventType = new InputDataModel_1.InputDataEndpoint(` Counter`, 0, 'person', InputDataModel_1.InputDataEndpointDataType.String, InputDataModel_1.InputDataEndpointType.Other, `DEVICE-${equipement.serial} Counter`, '');
            const percentageEventType = new InputDataModel_1.InputDataEndpoint(` Percentage`, 0, '%', InputDataModel_1.InputDataEndpointDataType.String, InputDataModel_1.InputDataEndpointType.Other, `DEVICE-${equipement.serial} Percentage`, '');
            device.children.push(counterEventType);
            device.children.push(percentageEventType);
        }
        device.children.push(occupationEventType);
        return device;
    }
    async generateDataZone(zone) {
        function createFunc(str, type, constructor) {
            return new constructor(str, type, str, '', zone.refZone, zone.customerReference, zone.ubigreenReference);
        }
        const device = createFunc(zone.refZone, 'device', InputDataModel_1.InputDataDevice);
        const counterEventType = new InputDataModel_1.InputDataEndpoint(` Counter`, 0, 'person', InputDataModel_1.InputDataEndpointDataType.String, InputDataModel_1.InputDataEndpointType.Other, `DEVICE-${zone.refZone} Counter`, '');
        device.children.push(counterEventType);
        return device;
    }
    async updateData(obj) {
        await this.nwService.updateData.call(this.nwService, obj);
    }
    async updateAttr(dataDevice, networkName) {
        var attrObj;
        if (networkName === "SmartFlow") {
            attrObj = {
                refZone: dataDevice.refZone,
                customerReference: dataDevice.customerReference,
                ubigreenReference: dataDevice.ubigreenReference,
            };
        }
        else {
            attrObj = {
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
    }
    static async getDeviceBySerialOrByRefZone(serial, newvalue, tabGenerateData) {
        const contextId = tabGenerateData[0].contextId;
        const context = spinal_env_viewer_graph_service_1.SpinalGraphService.getRealNode(contextId);
        const networks = await context.getChildren('hasBmsNetwork');
        for (const network of networks) {
            const generateData = tabGenerateData.find((t) => {
                return t.networkId === network.getId().get();
            });
            if (generateData === undefined) {
                continue;
            }
            const devices = await network.getChildren('hasBmsDevice');
            for (const device of devices) {
                if (device.getName().get() === serial) {
                    const endpoints = await device.getChildren('hasBmsEndpoint');
                    var _endpoint;
                    for (const endpoint of endpoints) {
                        if (endpoint.getName().get() === ' Occupation') {
                            _endpoint = endpoint;
                        }
                        else if (network.getName().get() === "SmartFlow" && endpoint.getName().get() === ' Counter') {
                            _endpoint = endpoint;
                        }
                    }
                    const elementEndpoint = await _endpoint.getElement(true);
                    let objDevice = {
                        name: device.getName().get(),
                        type: 'device',
                        id: device.info.idNetwork.get(),
                        path: '',
                        serial: device.getName().get(),
                        refInstallation: "",
                        customerReference: "",
                        ubigreenReference: "",
                        positionReference: "",
                        address: "",
                        nodeTypeName: spinal_model_bmsnetwork_1.SpinalBmsDevice.nodeTypeName,
                        children: [{
                                id: _endpoint.info.idNetwork.get(),
                                typeId: '',
                                name: _endpoint.getName().get(),
                                path: elementEndpoint.path.get(),
                                currentValue: newvalue,
                                unit: elementEndpoint.unit.get(),
                                dataType: elementEndpoint.dataType.get(),
                                type: elementEndpoint.type.get(),
                                nodeTypeName: spinal_model_bmsnetwork_1.SpinalBmsEndpoint.nodeTypeName,
                                timeseries: [],
                                idx: 0
                            }]
                    };
                    return { objDevice, generateData };
                }
            }
        }
    }
    async waitSync() {
        return new Promise(resolve => {
            setTimeout(() => {
                return resolve();
            }, 2000);
        });
    }
}
exports.GenerateData = GenerateData;
//# sourceMappingURL=generateData.js.map