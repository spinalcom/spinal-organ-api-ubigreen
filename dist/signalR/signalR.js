"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = require("querystring");
const node_signalr_1 = __importDefault(require("node-signalr"));
const axios = require('axios').create();
const generateData_1 = require("../modules/generateData");
const config_1 = require("../config");
async function signalR(tabGenerateData) {
    try {
        const base_url = config_1.NETWORK_BASE_URL_SMARTDESK;
        const auth_url = base_url + config_1.NETWORK_AUTH_URL_SOCKET;
        const hub_name = config_1.NETWORK_HUB_NAME;
        const function_name_server = config_1.NETWORK_FUNC_NAME_SERVER;
        const function_name_client = config_1.NETWORK_FUNC_NAME_CLIENT;
        const ref_installations = config_1.NETWORK_REF_INSTALLATIONS;
        const authenticate = async () => {
            try {
                const json = await axios.post(auth_url, (0, querystring_1.stringify)({
                    password: config_1.NETWORK_PASSWORD,
                    userName: config_1.NETWORK_USERNAME,
                    grant_type: config_1.NETWORK_GRANT_TYPE,
                }));
                return json.data.access_token;
            }
            catch (error) {
                console.error(error.response.data);
                return null;
            }
        };
        const startSignalRSmartDeskSmartRoom = async (tabGenerateData) => {
            let token = await authenticate();
            if (!token)
                process.exit();
            let client = new node_signalr_1.default.client(base_url, [hub_name]);
            client.qs = {
                access_token: `Bearer=${token}`,
                ref_installations: ref_installations,
            };
            client.on('connected', () => {
                console.log('SignalR client connected.');
                client.connection.hub.call(hub_name, function_name_client);
            });
            client.on('reconnecting', (count) => {
                console.log(`SignalR client reconnecting (${count}).`);
            });
            client.on('disconnected', (code) => {
                console.log(`SignalR client disconnected (${code}).`);
            });
            client.on('error', (code, ex) => {
                console.error(`SignalR client connect error: ${code}.`);
            });
            client.start();
            client.connection.hub.on(hub_name, function_name_server, async (messages) => {
                for (const message of messages) {
                    const result = await generateData_1.GenerateData.getDeviceBySerialOrByRefZone(message.serial, message.value, tabGenerateData);
                    if (result !== undefined) {
                        console.log(result.objDevice.serial);
                        result.generateData.updateData(result.objDevice);
                    }
                    else {
                        console.log('unknown Serial Device');
                    }
                }
            });
        };
        const startSignalRSmartFlow = async (tabGenerateData) => {
            let token = await authenticate();
            if (!token)
                process.exit();
            let client = new node_signalr_1.default.client(base_url, ['smartFlowZoneHub']);
            client.qs = {
                access_token: `Bearer=${token}`,
                ref_installations: ref_installations,
            };
            client.on('connected', () => {
                console.log('SignalR client connected.');
                client.connection.hub.call('smartFlowZoneHub', 'getZonesLastStatus');
            });
            client.on('reconnecting', (count) => {
                console.log(`SignalR client reconnecting (${count}).`);
            });
            client.on('disconnected', (code) => {
                console.log(`SignalR client disconnected (${code}).`);
            });
            client.on('error', (code, ex) => {
                console.error(`SignalR client connect error: ${code}.`);
            });
            client.start();
            client.connection.hub.on('smartFlowZoneHub', 'updateZonesLastStates', async (messages) => {
                for (const message of messages) {
                    const result = await generateData_1.GenerateData.getDeviceBySerialOrByRefZone(message.refZone, message.value, tabGenerateData);
                    if (result !== undefined) {
                        console.log(result.objDevice.serial);
                        result.generateData.updateData(result.objDevice);
                    }
                    else {
                        console.log('unknown Serial Device');
                    }
                }
            });
        };
        await startSignalRSmartFlow(tabGenerateData);
        await startSignalRSmartDeskSmartRoom(tabGenerateData);
    }
    catch (error) {
        console.error(error);
    }
}
exports.default = signalR;
//# sourceMappingURL=signalR.js.map