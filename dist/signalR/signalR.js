"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require('querystring');
require("json5/lib/register");
const config = require("../../config.json5");
const signalr = require('node-signalr');
const { exit } = require('process');
const axios = require('axios').create();
async function signalR(inputData) {
    try {
        const base_url = config.base_url;
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
        const startSignalR = async (inputData) => {
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
            client.connection.hub.on(hub_name, function_name_server, (messages) => {
                for (const message of messages) {
                    const device = inputData.getDeviceBySerial(message.serial);
                    if (device !== undefined) {
                        inputData.updateDevice(device, message.value);
                    }
                    else {
                        console.log("unknown Serial Device");
                    }
                }
            });
        };
        await startSignalR(inputData);
    }
    catch (error) {
        console.error(error);
    }
}
exports.default = signalR;
//# sourceMappingURL=signalR.js.map