"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require('querystring');
require("json5/lib/register");
const config = require("../../config.json5");
const signalr = require('node-signalr');
const { exit } = require('process');
const axios = require('axios').create();
const generateData_1 = require("../modules/generateData");
async function signalR(tabGenerateData) {
    try {
        const base_url = config.base_url_smartdesk;
        const auth_url = base_url + config.auth_url_socket;
        const hub_name = config.hub_name;
        const function_name_server = config.function_name_server;
        const function_name_client = config.function_name_client;
        const ref_installations = config.ref_installations;
        const user = config.username;
        const password = config.password;
        const grant_type = config.grant_type;
        const authenticate = async () => {
            try {
                const json = await axios.post(auth_url, querystring.stringify({
                    password: password,
                    userName: user,
                    grant_type: grant_type
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
                exit();
            let client = new signalr.client(base_url, [hub_name]);
            client.qs = { access_token: `Bearer=${token}`, ref_installations: ref_installations };
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
                        console.log("unknown Serial Device");
                    }
                }
            });
        };
        const startSignalRSmartFlow = async (tabGenerateData) => {
            let token = await authenticate();
            if (!token)
                exit();
            let client = new signalr.client(base_url, ["smartFlowZoneHub"]);
            client.qs = { access_token: `Bearer=${token}`, ref_installations: ref_installations };
            client.on('connected', () => {
                console.log('SignalR client connected.');
                client.connection.hub.call("smartFlowZoneHub", "getZonesLastStatus");
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
            client.connection.hub.on("smartFlowZoneHub", "updateZonesLastStates", async (messages) => {
                for (const message of messages) {
                    const result = await generateData_1.GenerateData.getDeviceBySerialOrByRefZone(message.refZone, message.value, tabGenerateData);
                    if (result !== undefined) {
                        console.log(result.objDevice.serial);
                        result.generateData.updateData(result.objDevice);
                    }
                    else {
                        console.log("unknown Serial Device");
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