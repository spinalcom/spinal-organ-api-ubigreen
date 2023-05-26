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
import { SpinalContext, SpinalGraph, SpinalGraphService } from "spinal-env-viewer-graph-service"
import { GenerateData } from "src/modules/generateData";
// import { NetworkProcess } from "../modules/NetworkProcess";
require("json5/lib/register");
// get the config
const config = require("../../config.json5");
import { ForgeFileItem } from "spinal-lib-forgefile";

async function buildBmsNetworks(networkName: string, generateData: GenerateData, graph: SpinalGraph) {
  const context: SpinalContext = await graph.getContext(config.organ.contextName)
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
    childFoundId = await generateData.nwService
      .createNewBmsNetwork(
        context.getId().get(),
        config.organ.networkType,
        networkName,
      )
      .then(res => <string>res.id.get());
  }
  return childFoundId;
}
export default buildBmsNetworks
