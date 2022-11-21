/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */
const querystring = require('querystring');
require("json5/lib/register");
const config = require("../../config.json5");
const signalr = require('node-signalr')
const { exit } = require('process');
const axios = require('axios').create();

export default async function signalR(inputData) {
  try {
    // auth url const
    const base_url = config.base_url;
    const auth_url = base_url + config.auth_url_socket;
    // hub const
    const hub_name = config.hub_name;
    const function_name_server = config.function_name_server;
    const function_name_client = config.function_name_client
    const ref_installations = config.ref_installations; // comma separated list
    // auth const
    const user = config.username;
    const password = config.password;
    const grant_type = config.grant_type;

    const authenticate = async () => {
      try {
        // url encode authentication payload
        const json = await axios.post(auth_url, querystring.stringify({
          password: password,
          userName: user,
          grant_type: grant_type
        }));
        return json.data.access_token;
      } catch (error) {
        console.error(error.response.data);
        return null;
      }

    };

    const startSignalR = async (inputData) => {
      // Retrieve Token
      let token = await authenticate();
      if (!token)
        exit();
      // Create a instance of signalR client
      let client = new signalr.client(base_url, [hub_name]);
      // set client's query string
      client.qs = { access_token: `Bearer=${token}`, ref_installations: ref_installations };

      // setup client event listeners
      client.on('connected', () => {
        console.log('SignalR client connected.');
        // print received messages on specific function name
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
      // print received messages on specific function name
      client.connection.hub.on(hub_name, function_name_server, (messages) => {
        for (const message of messages) {
          const device = inputData.getDeviceBySerial(message.serial);
          console.log("***********1 appel device changé", device);
          if (device !== undefined) {
            inputData.updateDevice(device, message.value);
          } else {
            console.log("unknown Serial Device");
          }
        }
      });
    };
    await startSignalR(inputData);

  } catch (error) {
    console.error(error);
  }
}


