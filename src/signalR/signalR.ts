/*
 * Copyright 2024 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
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

import { stringify } from 'querystring';
import signalr from 'node-signalr';
const axios = require('axios').create();
import { GenerateData } from '../modules/generateData';
import {
  NETWORK_AUTH_URL_SOCKET,
  NETWORK_BASE_URL_SMARTDESK,
  NETWORK_FUNC_NAME_CLIENT,
  NETWORK_FUNC_NAME_SERVER,
  NETWORK_GRANT_TYPE,
  NETWORK_HUB_NAME,
  NETWORK_PASSWORD,
  NETWORK_REF_INSTALLATIONS,
  NETWORK_USERNAME,
} from '../config';

export default async function signalR(tabGenerateData: GenerateData[]) {
  try {
    // auth url const
    const base_url = NETWORK_BASE_URL_SMARTDESK;
    const auth_url = base_url + NETWORK_AUTH_URL_SOCKET;
    // hub const
    const hub_name = NETWORK_HUB_NAME;
    const function_name_server = NETWORK_FUNC_NAME_SERVER;
    const function_name_client = NETWORK_FUNC_NAME_CLIENT;
    const ref_installations = NETWORK_REF_INSTALLATIONS;

    const authenticate = async () => {
      try {
        // url encode authentication payload
        const json = await axios.post(
          auth_url,
          stringify({
            password: NETWORK_PASSWORD,
            userName: NETWORK_USERNAME,
            grant_type: NETWORK_GRANT_TYPE,
          }),
        );
        return json.data.access_token;
      } catch (error) {
        console.error(error.response.data);
        return null;
      }
    };

    const startSignalRSmartDeskSmartRoom = async (
      tabGenerateData: GenerateData[],
    ) => {
      // Retrieve Token
      let token = await authenticate();
      if (!token) process.exit();
      // Create a instance of signalR client
      let client = new signalr.client(base_url, [hub_name]);
      // set client's query string
      client.qs = {
        access_token: `Bearer=${token}`,
        ref_installations: ref_installations,
      };

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
      client.connection.hub.on(
        hub_name,
        function_name_server,
        async (messages) => {
          for (const message of messages) {
            const result = await GenerateData.getDeviceBySerialOrByRefZone(
              message.serial,
              message.value,
              tabGenerateData,
            );

            if (result !== undefined) {
              console.log(result.objDevice.serial);
              result.generateData.updateData(result.objDevice);
            } else {
              console.log('unknown Serial Device');
            }
          }
        },
      );
    };

    const startSignalRSmartFlow = async (tabGenerateData: GenerateData[]) => {
      // Retrieve Token
      let token = await authenticate();
      if (!token) process.exit();
      // Create a instance of signalR client
      let client = new signalr.client(base_url, ['smartFlowZoneHub']);
      // set client's query string
      client.qs = {
        access_token: `Bearer=${token}`,
        ref_installations: ref_installations,
      };
      // setup client event listeners
      client.on('connected', () => {
        console.log('SignalR client connected.');
        // print received messages on specific function name
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

      // print received messages on specific function name
      client.connection.hub.on(
        'smartFlowZoneHub',
        'updateZonesLastStates',
        async (messages) => {
          for (const message of messages) {
            const result = await GenerateData.getDeviceBySerialOrByRefZone(
              message.refZone,
              message.value,
              tabGenerateData,
            );
            if (result !== undefined) {
              console.log(result.objDevice.serial);
              result.generateData.updateData(result.objDevice);
            } else {
              console.log('unknown Serial Device');
            }
          }
        },
      );
    };
    await startSignalRSmartFlow(tabGenerateData);
    await startSignalRSmartDeskSmartRoom(tabGenerateData);
  } catch (error) {
    console.error(error);
  }
}
