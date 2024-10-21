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

import './env';

export const SPINALHUB_PROTOCOL = process.env.SPINALHUB_PROTOCOL;
export const SPINALHUB_IP = process.env.SPINALHUB_IP;
export const SPINALHUB_PORT = process.env.SPINALHUB_PORT;
export const SPINAL_USER_ID = process.env.SPINAL_USER_ID;
export const SPINAL_PASSWORD = process.env.SPINAL_PASSWORD;
export const SPINAL_DIGITALTWIN_PATH = process.env.SPINAL_DIGITALTWIN_PATH;
export const SPINAL_MONITORING_FILE_NAME =
  process.env.SPINAL_MONITORING_FILE_NAME;
export const ORGAN_RUN_MODE = process.env.ORGAN_RUN_MODE;

export const NETWORK_AUTH_URL_SMARTDESK =
  process.env.NETWORK_AUTH_URL_SMARTDESK;
export const NETWORK_BASE_URL_SMARTDESK =
  process.env.NETWORK_BASE_URL_SMARTDESK;
export const NETWORK_AUTH_URL_SOCKET = process.env.NETWORK_AUTH_URL_SOCKET;
export const NETWORK_HUB_NAME = process.env.NETWORK_HUB_NAME;

export const NETWORK_FUNC_NAME_SERVER = process.env.NETWORK_FUNC_NAME_SERVER;
export const NETWORK_FUNC_NAME_CLIENT = process.env.NETWORK_FUNC_NAME_CLIENT;

export const NETWORK_USERNAME = process.env.NETWORK_USERNAME;
export const NETWORK_PASSWORD = process.env.NETWORK_PASSWORD;
export const NETWORK_HOST = process.env.NETWORK_HOST;
export const NETWORK_URL_SMARTROOM = process.env.NETWORK_URL_SMARTROOM;
export const NETWORK_GRANT_TYPE = process.env.NETWORK_GRANT_TYPE;
export const NETWORK_REF_INSTALLATIONS = process.env.NETWORK_REF_INSTALLATIONS;

export const NETWORK_REF_DEVICES_URL_SMARTDESK =
  process.env.NETWORK_REF_DEVICES_URL_SMARTDESK;
export const NETWORK_REF_DEVICES_URL_SMARTROOM =
  process.env.NETWORK_REF_DEVICES_URL_SMARTROOM;
export const NETWORK_REF_ZONES_URL_SMARTFLOW =
  process.env.NETWORK_REF_ZONES_URL_SMARTFLOW;

export const NETWORK_CONFIG_ORGAN_DESK = {
  contextName: process.env.NETWORK_ORGAN_DESK_CONTEXT_NAME,
  contextType: process.env.NETWORK_ORGAN_DESK_CONTEXT_TYPE,
  networkName: process.env.NETWORK_ORGAN_DESK_NETWORK_NAME,
  networkType: process.env.NETWORK_ORGAN_DESK_NETWORK_TYPE,
};
export const NETWORK_CONFIG_ORGAN_ROOM = {
  contextName: process.env.NETWORK_ORGAN_ROOM_CONTEXT_NAME,
  contextType: process.env.NETWORK_ORGAN_ROOM_CONTEXT_TYPE,
  networkName: process.env.NETWORK_ORGAN_ROOM_NETWORK_NAME,
  networkType: process.env.NETWORK_ORGAN_ROOM_NETWORK_TYPE,
};
export const NETWORK_CONFIG_ORGAN_FLOW = {
  contextName: process.env.NETWORK_ORGAN_FLOW_CONTEXT_NAME,
  contextType: process.env.NETWORK_ORGAN_FLOW_CONTEXT_TYPE,
  networkName: process.env.NETWORK_ORGAN_FLOW_NETWORK_NAME,
  networkType: process.env.NETWORK_ORGAN_FLOW_NETWORK_TYPE,
};
