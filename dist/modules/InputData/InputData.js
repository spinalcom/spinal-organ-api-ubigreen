"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputData = void 0;
const InputDataModel_1 = require("./InputDataModel/InputDataModel");
class InputData {
    constructor(apiConnector) {
        const intervalTest = 2000;
        this.apiConnector = apiConnector;
        this.devices = [];
        this.onData = null;
        this.generateData();
    }
    updateDevice(obj, value) {
        var _a;
        (_a = obj.children[0]) === null || _a === void 0 ? void 0 : _a.currentValue = value;
        if (this.onData !== null) {
            this.onData(obj);
        }
    }
    getDeviceBySerial(serial) {
        for (const device of this.devices) {
            if (device.serial === serial) {
                return device;
            }
        }
    }
    setOnDataCBFunc(onData) {
        this.onData = onData;
    }
    async generateData() {
        try {
            let equipments = [];
            const response = await this.apiConnector.get('https://sd-api-preprod-cnp.ubigreen.com/smartdesk/api/installations/CNP-SIEGE/refdevices');
            equipments = response.data.elements;
            if (response.data.paging.pageCount > 1) {
                for (let index = 2; index <= response.data.paging.pageCount; index++) {
                    const rep = await this.apiConnector.get(`https://sd-api-preprod-cnp.ubigreen.com/smartdesk/api/installations/CNP-SIEGE/refdevices?pageNumber=${index}`);
                    equipments.concat(rep.data.elements);
                }
            }
            for (const equipment of equipments) {
                const device = await this.generateDataDevice(equipment);
                this.devices.push(device);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async generateDataDevice(equipement) {
        function createFunc(str, type, constructor) {
            return new constructor(str, type, str, '', equipement.serial, equipement.refInstallation, equipement.customerReference, equipement.ubigreenReference, equipement.positionReference);
        }
        const device = createFunc(`DEVICE-${equipement.serial}`, 'device', InputDataModel_1.InputDataDevice);
        const occupationEventType = new InputDataModel_1.InputDataEndpoint(` Occupation-DEVICE-${equipement.serial}`, 0, '', InputDataModel_1.InputDataEndpointDataType.String, InputDataModel_1.InputDataEndpointType.Other, `DEVICE-${equipement.serial} Occupation`, '');
        device.children.push(occupationEventType);
        return device;
    }
}
exports.InputData = InputData;
//# sourceMappingURL=InputData.js.map