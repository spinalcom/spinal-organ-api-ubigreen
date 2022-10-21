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



import axios, { AxiosRequestConfig } from "axios";

const querystring = require('querystring');

import { FileSystem, spinalCore } from "spinal-core-connectorjs_type";
import { ForgeFileItem } from "spinal-lib-forgefile";
import { SpinalContext, SpinalGraphService } from "spinal-env-viewer-graph-service"

require("json5/lib/register");
// get the config
const config = require("../config.json5");

import { InputData } from "./modules/InputData/InputData";
import { NetworkProcess } from "./modules/NetworkProcess";
//import { TokenManager } from "./modules/TokenManager";
import { ApiConnector } from "./modules/ApiConnector";
// //@ts-ignore
// globalThis.$ = globalThis
// import $ from "jquery";
// //@ts-ignore
// globalThis.window = globalThis
// import "signalr";


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
  // if (typeof forgeFile.graph !== 'undefined') forgeFile.rem_attr('graph');
  networkProcess.init(forgeFile, config.organ).then(
    async () => {
      await buildBmsNetworks("SmartRoom", networkProcess, forgeFile)
      await buildBmsNetworks("SmartFlow", networkProcess, forgeFile)
    }
  );
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



















 // try {
  //   const response = await axios.post(config.auth_url_socket,
  //     querystring.stringify({ username: config.username, password: config.password, grant_type: config.grant_type }));



  //   //Méthode appelée lors de la validation de l'authentification
  //   var aggregateToHubServer = function () {
  //     //Définition de l'URL hub serveur
  //     $.connection.hub.url = "https://https://sd-api-preprod-cnp.ubigreen.com/smartdesk/signalr/hubs";
  //     //Définition de la méthode du hub avec laquelle on souhaite échanger
  //     var smartDeskHub = $.connection.smartDeskDeviceHub;
  //     //Méthode cliente appelée par le serveur
  //     smartDeskHub.client.updateDevicesStatus = function (devicesUpdated) {
  //       // action réalisée quand un changement d’état pour un capteur de présence est détecté
  //       // OU au chargement des derniers états des capteurs
  //     };
  //     function getLastDevicesStatus() {
  //       //Appel de cette méthode sur le hub serveur pour connaître les derniers états des capteurs de
  //       // présence(à appeler 1 fois maximum par jour, les derniers états sont ensuite réceptionnés en temps réel via le flux signalR)
  //       console.log("getlaststausdevices");

  //       smartDeskHub.server.getDevicesStatus();
  //       console.log("*w*w*w*w*w*w*", smartDeskHub.server.getDevicesStatus());

  //     };
  //     //Ajout des logs de création de la connexion entre le client et le serveur
  //     $.connection.hub.logging = true;
  //     //Ajout du token et des références installations à la query string
  //     $.connection.hub.qs = {
  //       "access_token": "Bearer=" + response.data.access_token, "ref_installations":
  //         "CNP-SIEGE"
  //     };
  //     //Start the connection
  //     $.connection.hub.start()
  //       .done(function () {
  //         //Validation de la connexion et exécution de la méthode serveur
  //         console.log("connection done");

  //         getLastDevicesStatus();
  //       })
  //       .fail(function () {
  //         //Connexion impossible
  //         console.log("Could not Connect!");
  //       });
  //   }();


  // } catch (error) {
  //   console.error(error);
  // }
