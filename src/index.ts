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

import { FileSystem, spinalCore } from "spinal-core-connectorjs_type";
import { ForgeFileItem } from "spinal-lib-forgefile";
import signalR from "./signalR/signalR"
require("json5/lib/register");
// get the config
const config = require("../config.json5");
import buildBmsNetworks from './Utils/buildBmsNetworks'
import { InputData } from "./modules/InputData/InputData";
import { NetworkProcess } from "./modules/NetworkProcess";
//import { TokenManager } from "./modules/TokenManager";
import { ApiConnector } from "./modules/ApiConnector";

// callback function.
// connection string to connect to spinalhub
// get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2
// callback function.
const protocol = config.spinalConnector.protocol
  ? config.spinalConnector.protocol
  : 'http';
const host =
  config.spinalConnector.host +
  (config.spinalConnector.port ? `:${config.spinalConnector.port}` : '');
const login = `${config.spinalConnector.user}:${config.spinalConnector.password}`;
const connect_opt = `${protocol}://${login}@${host}/`;
console.log(`start connect to hub: ${protocol}://${host}/`);

// initialize the connection
const conn = spinalCore.connect(connect_opt);
// get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2

spinalCore.load(conn, config.file.path, onLoadSuccess, onLoadError);

// called network error or file not found
function onLoadError() {
  console.log(`File does not exist in location ${config.file.path}`);
}

// called if connected to the server and if the spinalhub sent us the Model
async function onLoadSuccess(forgeFile: ForgeFileItem) {
  console.log("Connected to the server and got the Entry Model");
  const apiConnector = new ApiConnector();
  const inputData = new InputData(apiConnector);
  const networkProcess = new NetworkProcess(inputData);
  // reset data for test purpose
  if (typeof forgeFile.graph !== 'undefined') forgeFile.rem_attr('graph');
  await networkProcess.init(forgeFile, config.organ).then(
    async () => {
      await buildBmsNetworks("SmartRoom", networkProcess, forgeFile)
      await buildBmsNetworks("SmartFlow", networkProcess, forgeFile)
    }
  );
  await signalR(inputData);
}



















