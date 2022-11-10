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


// import { SpinalGraph } from "spinal-env-viewer-graph-service";
// import SpinalAPIMiddleware from "./spinalMiddelware";
// import iconv from 'iconv-lite';
// import axios from 'axios'
// import request from 'request';
// import { Token } from './token/token'

// const querystring = require('querystring');

// const config = require("../config.json5");

// var graph: SpinalGraph<any>
// const spinalMiddelware = SpinalAPIMiddleware.getInstance();





import { FileSystem, spinalCore } from "spinal-core-connectorjs_type";
import { ForgeFileItem } from "spinal-lib-forgefile";
import { SpinalContext, SpinalGraphService } from "spinal-env-viewer-graph-service"
import signalR from "./signalR/signalR"
require("json5/lib/register");
// get the config
const config = require("../config.json5");

import { InputData } from "./modules/InputData/InputData";
import { NetworkProcess } from "./modules/NetworkProcess";
//import { TokenManager } from "./modules/TokenManager";
import { ApiConnector } from "./modules/ApiConnector";



// connection string to connect to spinalhub
const connectOpt = `http://${config.spinalConnector.user}:${config.spinalConnector.password
  }@${config.spinalConnector.host}:${config.spinalConnector.port}/`;

// initialize the connection
const conn = spinalCore.connect(connectOpt);

// get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2
// callback function.
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
  networkProcess.init(forgeFile, config.organ).then(
    async () => {
      await buildBmsNetworks("SmartRoom", networkProcess, forgeFile)
      await buildBmsNetworks("SmartFlow", networkProcess, forgeFile)
    }
  );
  await signalR(inputData);

}
async function buildBmsNetworks(networkName: string, networkProcess: NetworkProcess, forgeFile: ForgeFileItem) {
  const context: SpinalContext = await forgeFile.getContext(config.organ.contextName)
  const childrenContext = await SpinalGraphService.getChildrenInContext(
    context.getId().get(),
    context.getId().get(),
  );

  let childFoundId: string = '';
  for (const childContext of childrenContext) {
    if (typeof childContext.networkName !== 'undefined' &&
      childContext.networkName.get() === networkName) {
      childFoundId = childContext.id.get();
      break;
    }
  }
  if (childFoundId === '') {
    childFoundId = await networkProcess.nwService
      .createNewBmsNetwork(
        context.getId().get(),
        config.organ.networkType,
        networkName,
      )
      .then(res => <string>res.id.get());
  }
  return childFoundId;
}



















