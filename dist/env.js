"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('json5/lib/register');
const dotenv = require("dotenv");
const path_1 = require("path");
const processEnv = {};
dotenv.config({
    processEnv: processEnv,
    path: [
        (0, path_1.resolve)(__dirname, '..', '.env.local'),
        (0, path_1.resolve)(__dirname, '..', '.env'),
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
];
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    const config = require('../config.json5');
    function setUp(envKey, configValue) {
        if (configValue && !process.env[envKey])
            process.env[envKey] = configValue;
    }
    setUp('SPINALHUB_PROTOCOL', (_a = config.spinalConnector) === null || _a === void 0 ? void 0 : _a.protocol);
    setUp('SPINALHUB_IP', (_b = config.spinalConnector) === null || _b === void 0 ? void 0 : _b.host);
    setUp('SPINAL_USER_ID', (_c = config.spinalConnector) === null || _c === void 0 ? void 0 : _c.user);
    setUp('SPINAL_PASSWORD', (_d = config.spinalConnector) === null || _d === void 0 ? void 0 : _d.password);
    setUp('SPINAL_DIGITALTWIN_PATH', (_e = config.file) === null || _e === void 0 ? void 0 : _e.path);
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
    setUp('NETWORK_HOST', config.host);
    setUp('NETWORK_ORGAN_DESK_CONTEXT_NAME', (_f = config.organDesk) === null || _f === void 0 ? void 0 : _f.contextName);
    setUp('NETWORK_ORGAN_DESK_CONTEXT_TYPE', (_g = config.organDesk) === null || _g === void 0 ? void 0 : _g.contextType);
    setUp('NETWORK_ORGAN_DESK_NETWORK_NAME', (_h = config.organDesk) === null || _h === void 0 ? void 0 : _h.networkName);
    setUp('NETWORK_ORGAN_DESK_NETWORK_TYPE', (_j = config.organDesk) === null || _j === void 0 ? void 0 : _j.networkType);
    setUp('NETWORK_ORGAN_ROOM_CONTEXT_NAME', (_k = config.organRoom) === null || _k === void 0 ? void 0 : _k.contextName);
    setUp('NETWORK_ORGAN_ROOM_CONTEXT_TYPE', (_l = config.organRoom) === null || _l === void 0 ? void 0 : _l.contextType);
    setUp('NETWORK_ORGAN_ROOM_NETWORK_NAME', (_m = config.organRoom) === null || _m === void 0 ? void 0 : _m.networkName);
    setUp('NETWORK_ORGAN_ROOM_NETWORK_TYPE', (_o = config.organRoom) === null || _o === void 0 ? void 0 : _o.networkType);
    setUp('NETWORK_ORGAN_FLOW_CONTEXT_NAME', (_p = config.organFlow) === null || _p === void 0 ? void 0 : _p.contextName);
    setUp('NETWORK_ORGAN_FLOW_CONTEXT_TYPE', (_q = config.organFlow) === null || _q === void 0 ? void 0 : _q.contextType);
    setUp('NETWORK_ORGAN_FLOW_NETWORK_NAME', (_r = config.organFlow) === null || _r === void 0 ? void 0 : _r.networkName);
    setUp('NETWORK_ORGAN_FLOW_NETWORK_TYPE', (_s = config.organFlow) === null || _s === void 0 ? void 0 : _s.networkType);
}
//# sourceMappingURL=env.js.map