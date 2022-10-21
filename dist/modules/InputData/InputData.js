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
        setInterval(this.onDataInterval.bind(this), intervalTest);
    }
    onDataInterval() {
        if (this.onData !== null) {
            this.onData(this.getAndUpdateOneRandomDevice());
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
            for (let index = 2; index <= response.data.paging.pageCount; index++) {
                const rep = await this.apiConnector.get(`https://sd-api-preprod-cnp.ubigreen.com/smartdesk/api/installations/CNP-SIEGE/refdevices?pageNumber=${index}`);
                equipments.concat(rep.data.elements);
            }
            for (const equipment of equipments) {
                const device = await this.generateDataDevice(equipment.serial);
                this.devices.push(device);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async generateDataDevice(serial) {
        function createFunc(str, type, constructor) {
            return new constructor(str, type, str, '');
        }
        const device = createFunc(`DEVICE-${serial}`, 'device', InputDataModel_1.InputDataDevice);
        const occupationEventType = new InputDataModel_1.InputDataEndpoint(`DEVICE-${serial} Occupation`, 3, '', InputDataModel_1.InputDataEndpointDataType.String, InputDataModel_1.InputDataEndpointType.Other, `DEVICE-${serial} Occupation`, '');
        device.children.push(occupationEventType);
        return device;
    }
    async updateDevice(device) {
        let id = device.id;
        for (const child of device.children) {
            if (child instanceof InputDataModel_1.InputDataEndpoint) {
                if (child.name === 'MovementEvent') {
                    child.currentValue = 9;
                }
            }
        }
    }
    getAndUpdateOneRandomDevice() {
        if (this.devices.length > 0) {
            const idx = Math.floor(Math.random() * this.devices.length);
            this.updateDevice(this.devices[idx]);
            return this.devices[idx];
        }
        this.generateData();
        return this.getAndUpdateOneRandomDevice();
    }
}
exports.InputData = InputData;
//# sourceMappingURL=InputData.js.map