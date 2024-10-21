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

require('json5/lib/register');
import dotenv = require('dotenv');
import { resolve } from 'path';
const processEnv: any = {};

dotenv.config({
  processEnv: processEnv,
  path: [
    resolve(__dirname, '..', '.env.local'),
    resolve(__dirname, '..', '.env'),
  ],
});
for (var key in processEnv) {
  if (processEnv[key]) {
    process.env[key] = processEnv[key];
  }
}

const _env_keys = [
  'SPINALHUB_PROTOCOL',
  'SPINALHUB_IP',
  'SPINAL_USER_ID',
  'SPINAL_PASSWORD',
  'SPINAL_DIGITALTWIN_PATH',
  'SPINAL_MONITORING_FILE_NAME',
  'ORGAN_RUN_MODE',
  'NETWORK_AUTH_URL_SMARTDESK',
  'NETWORK_USERNAME',
  'NETWORK_PASSWORD',
  'NETWORK_GRANT_TYPE',
  'NETWORK_FUNC_NAME_SERVER',
  'NETWORK_FUNC_NAME_CLIENT',
  'NETWORK_REF_INSTALLATIONS',
  'NETWORK_URL_SMARTROOM',
  'NETWORK_BASE_URL_SMARTDESK',
  'NETWORK_AUTH_URL_SOCKET',
  'NETWORK_HUB_NAME',
  'NETWORK_REF_DEVICES_URL_SMARTDESK',
  'NETWORK_REF_DEVICES_URL_SMARTROOM',
  'NETWORK_REF_ZONES_URL_SMARTFLOW',
  'NETWORK_ORGAN_DESK_CONTEXT_NAME',
  'NETWORK_ORGAN_DESK_CONTEXT_TYPE',
  'NETWORK_ORGAN_DESK_NETWORK_NAME',
  'NETWORK_ORGAN_DESK_NETWORK_TYPE',
  'NETWORK_ORGAN_ROOM_CONTEXT_NAME',
  'NETWORK_ORGAN_ROOM_CONTEXT_TYPE',
  'NETWORK_ORGAN_ROOM_NETWORK_NAME',
  'NETWORK_ORGAN_ROOM_NETWORK_TYPE',
  'NETWORK_ORGAN_FLOW_CONTEXT_NAME',
  'NETWORK_ORGAN_FLOW_CONTEXT_TYPE',
  'NETWORK_ORGAN_FLOW_NETWORK_NAME',
  'NETWORK_ORGAN_FLOW_NETWORK_TYPE',
] as const;

tryImportJson5Data();
checkEnv(_env_keys);

function checkEnv(env_keys) {
  const missing_keys = [];
  for (let i = 0; i < env_keys.length; i++) {
    const key = env_keys[i];
    if (!process.env[key]) {
      missing_keys.push(key);
    }
  }
  if (missing_keys.length > 0) {
    console.error(`missing ${missing_keys.join(', ')} in env`);
    process.exit(-1);
  }
  const run_mode = ['MODE_DISCOVER', 'MODE_COUNTER'];
  if (run_mode.includes(process.env.ORGAN_RUN_MODE) === false) {
    console.error(`ORGAN_RUN_MODE must be one of ${run_mode}`);
    process.exit(-1);
  }
}

function tryImportJson5Data() {
  const config = require('../config.json5');
  function setUp(envKey: string, configValue: string | undefined) {
    if (configValue && !process.env[envKey]) process.env[envKey] = configValue;
  }
  setUp('SPINALHUB_PROTOCOL', config.spinalConnector?.protocol);
  setUp('SPINALHUB_IP', config.spinalConnector?.host);
  setUp('SPINAL_USER_ID', config.spinalConnector?.user);
  setUp('SPINAL_PASSWORD', config.spinalConnector?.password);
  setUp('SPINAL_DIGITALTWIN_PATH', config.file?.path);
  setUp('SPINAL_MONITORING_FILE_NAME', 'spinal-organ-api-ubigreen');
  setUp('ORGAN_RUN_MODE', config.organ_run_mode);
  setUp('NETWORK_AUTH_URL_SMARTDESK', config.auth_url_smartdesk);
  setUp('NETWORK_USERNAME', config.username);
  setUp('NETWORK_PASSWORD', config.password);
  setUp('NETWORK_GRANT_TYPE', config.grant_type);
  setUp('NETWORK_FUNC_NAME_SERVER', config.function_name_server);
  setUp('NETWORK_FUNC_NAME_CLIENT', config.function_name_client);
  setUp('NETWORK_REF_INSTALLATIONS', config.ref_installations);
  setUp('NETWORK_REF_DEVICES_URL_SMARTDESK', config.refDevices_url_smartdesk);
  setUp('NETWORK_REF_DEVICES_URL_SMARTROOM', config.refDevices_url_smartroom);
  setUp('NETWORK_REF_ZONES_URL_SMARTFLOW', config.refZones_url_smartflow);
  setUp('NETWORK_URL_SMARTROOM', config.counter_url_smartroom);
  setUp('NETWORK_BASE_URL_SMARTDESK', config.base_url_smartdesk);
  setUp('NETWORK_AUTH_URL_SOCKET', config.auth_url_socket);
  setUp('NETWORK_HUB_NAME', config.hub_name);
  setUp('NETWORK_ORGAN_DESK_CONTEXT_NAME', config.organDesk?.contextName);
  setUp('NETWORK_ORGAN_DESK_CONTEXT_TYPE', config.organDesk?.contextType);
  setUp('NETWORK_ORGAN_DESK_NETWORK_NAME', config.organDesk?.networkType);
  setUp('NETWORK_ORGAN_DESK_NETWORK_TYPE', config.organDesk?.networkName);
  setUp('NETWORK_ORGAN_ROOM_CONTEXT_NAME', config.organRoom?.contextName);
  setUp('NETWORK_ORGAN_ROOM_CONTEXT_TYPE', config.organRoom?.contextType);
  setUp('NETWORK_ORGAN_ROOM_NETWORK_NAME', config.organRoom?.networkType);
  setUp('NETWORK_ORGAN_ROOM_NETWORK_TYPE', config.organRoom?.networkName);
  setUp('NETWORK_ORGAN_FLOW_CONTEXT_NAME', config.organFlow?.contextName);
  setUp('NETWORK_ORGAN_FLOW_CONTEXT_TYPE', config.organFlow?.contextType);
  setUp('NETWORK_ORGAN_FLOW_NETWORK_NAME', config.organFlow?.networkType);
  setUp('NETWORK_ORGAN_FLOW_NETWORK_TYPE', config.organFlow?.networkName);
}
