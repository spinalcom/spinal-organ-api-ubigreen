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

import signalR from "./signalR/signalR"
require("json5/lib/register");
// get the config
const config = require("../config.json5");
import { GenerateData } from "./modules/generateData"
import { ApiConnector } from "./modules/ApiConnector";
import SpinalAPIMiddleware from "./spinalMiddelware";
import networkSmartRoomCounter from "./Utils/counter";
import ConfigFile from "../node_modules/spinal-lib-organ-monitoring/dist/classes/ConfigFile.js"



async function main() {
  const spinalMiddelware = new SpinalAPIMiddleware();
  const graph = await spinalMiddelware.getGraph();
  if (graph) {
    console.log("Connected to the server and got the Entry Model");
    ConfigFile.init(spinalMiddelware.conn, process.env.ORGAN_NAME + "-config", process.env.SPINALHUB_IP, process.env.SPINALHUB_PROTOCOL, parseInt(process.env.REQUESTS_PORT));

    const apiConnector = new ApiConnector();
    const generateDataSmartdesk = new GenerateData(apiConnector)
    const generateDataSmartroom = new GenerateData(apiConnector)
    const generateDataSmartflow = new GenerateData(apiConnector)
    await generateDataSmartdesk.init(graph, config.organDesk);
    await generateDataSmartroom.init(graph, config.organRoom);
    await generateDataSmartflow.init(graph, config.organFlow);

    const ubigreenContexte = await graph.getContext(config.organDesk.contextName);
    // await generateDataSmartdesk.discoverData(ubigreenContexte, config.organDesk.networkName);
    // await generateDataSmartdesk.waitSync()
    // await generateDataSmartroom.discoverData(ubigreenContexte, config.organRoom.networkName);
    // await generateDataSmartroom.waitSync()
    // await generateDataSmartflow.discoverData(ubigreenContexte, config.organFlow.networkName)
    // // reset data for test purpose
    // await signalR([generateDataSmartdesk, generateDataSmartroom, generateDataSmartflow]);
    // start organ with endpoint counter cron
    await networkSmartRoomCounter(apiConnector);

    // var cron = require('node-cron');
    // cron.schedule('0 0 */2 * * *', async function () {
    //   await networkSmartRoomCounter(apiConnector);
    // });
  }
}
main()














