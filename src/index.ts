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

import signalR from './signalR/signalR';
import { GenerateData } from './modules/generateData';
import { ApiConnector } from './modules/ApiConnector';
import SpinalAPIMiddleware from './spinalMiddelware';
import networkSmartRoomCounter from './Utils/counter';
import { SpinalGraph } from 'spinal-model-graph';
import {
  NETWORK_CONFIG_ORGAN_DESK,
  NETWORK_CONFIG_ORGAN_FLOW,
  NETWORK_CONFIG_ORGAN_ROOM,
} from './config';
import {
  getLastRunDiscover,
  setLastRunDiscover,
} from './Utils/LastRunDiscover';

interface IDataConfig {
  graph: SpinalGraph;
  apiConnector: ApiConnector;
  generateDataSmartdesk: GenerateData;
  generateDataSmartroom: GenerateData;
  generateDataSmartflow: GenerateData;
}

async function run_counter(obj: IDataConfig) {
  // // reset data for test purpose
  await signalR([
    obj.generateDataSmartdesk,
    obj.generateDataSmartroom,
    obj.generateDataSmartflow,
  ]);

  const cron = require('node-cron');
  cron.schedule('0 */2 * * *', async function () {
    await networkSmartRoomCounter(obj.apiConnector);
  });
}

async function run_discover(obj: IDataConfig) {
  // check if last run was less than an hour ago
  let lastRun = await getLastRunDiscover();
  if (lastRun) {
    const now = Date.now();
    lastRun += 1000 * 60 * 60;
    const diff = now - lastRun;
    if (diff < 1000 * 60 * 60) {
      console.log('Last run was less than an hour ago, wait %s s.', diff);
      await new Promise((resolve) => setTimeout(resolve, diff));
    }
  }
  setLastRunDiscover();

  const ubigreenContexte = await obj.graph.getContext(
    NETWORK_CONFIG_ORGAN_DESK.contextName,
  );
  await obj.generateDataSmartdesk.discoverData(
    ubigreenContexte,
    NETWORK_CONFIG_ORGAN_DESK.networkName,
  );
  await obj.generateDataSmartdesk.waitSync();
  await obj.generateDataSmartroom.discoverData(
    ubigreenContexte,
    NETWORK_CONFIG_ORGAN_ROOM.networkName,
  );
  await obj.generateDataSmartroom.waitSync();
  await obj.generateDataSmartflow.discoverData(
    ubigreenContexte,
    NETWORK_CONFIG_ORGAN_FLOW.networkName,
  );
  // // reset data for test purpose
  await signalR([
    obj.generateDataSmartdesk,
    obj.generateDataSmartroom,
    obj.generateDataSmartflow,
  ]);
}

async function init(): Promise<IDataConfig> {
  const spinalMiddelware = new SpinalAPIMiddleware();
  const graph = await spinalMiddelware.getGraph();
  if (graph) {
    console.log('Connected to the server and got the Entry Model');
    const apiConnector = new ApiConnector();
    const generateDataSmartdesk = new GenerateData(apiConnector);
    const generateDataSmartroom = new GenerateData(apiConnector);
    const generateDataSmartflow = new GenerateData(apiConnector);
    await generateDataSmartdesk.init(graph, NETWORK_CONFIG_ORGAN_DESK);
    await generateDataSmartroom.init(graph, NETWORK_CONFIG_ORGAN_ROOM);
    await generateDataSmartflow.init(graph, NETWORK_CONFIG_ORGAN_FLOW);
    return {
      graph,
      apiConnector,
      generateDataSmartdesk,
      generateDataSmartroom,
      generateDataSmartflow,
    };
  }
  throw new Error('Cannot connect to the server');
}

async function main() {
  if (process.env.ORGAN_RUN_MODE === 'MODE_DISCOVER') {
    const data = await init();
    await run_discover(data);
  } else if (process.env.ORGAN_RUN_MODE === 'MODE_COUNTER') {
    const data = await init();
    await run_counter(data);
  } else {
    console.error(
      '"ORGAN_RUN_MODE" in .env must be one of "MODE_DISCOVER" or "MODE_COUNTER"',
    );
    process.exit(-1);
  }
}

main();
