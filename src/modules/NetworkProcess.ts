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

import { ForgeFileItem } from "spinal-lib-forgefile";
import { InputData } from "./InputData/InputData";
import { NetworkService } from "spinal-model-bmsnetwork";
import { InputDataDevice } from "./InputData/InputDataModel/InputDataModel";
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service"
import { ConfigOrgan } from "../Utils/ConfigOrgan";
import { SpinalGraphService } from "spinal-env-viewer-graph-service";

/**
 *
 *
 * @export
 * @class NetworkProcess
 */
export class NetworkProcess {
  private inputData: InputData;
  public nwService: NetworkService;
  public contextId: string;
  /**
   *Creates an instance of NetworkProcess.
   * @param {InputData} inputData
   * @memberof NetworkProcess
   */
  constructor(inputData: InputData) {
    this.inputData = inputData;
    this.nwService = new NetworkService();
    this.nwService.setupDelay(60000);
  }
  /**
   *
   *
   * @param {ForgeFileItem} forgeFile
   * @param {ConfigOrgan} configOrgan
   * @returns {Promise<void>}
   * @memberof NetworkProcess
   */
  public async init(
    forgeFile: ForgeFileItem,
    configOrgan: ConfigOrgan
  ): Promise<void> {
    const rep = await this.nwService.init(forgeFile, configOrgan);
    this.contextId = rep.contextId;
    this.inputData.setOnDataCBFunc(this.updateData.bind(this));
  }


  public async updateAttr(dataDevice: InputDataDevice) {
    let attrObj = {
      serial: dataDevice.serial,
      refInstallation: dataDevice.refInstallation,
      customerReference: dataDevice.customerReference,
      ubigreenReference: dataDevice.ubigreenReference,
      positionReference: dataDevice.positionReference
    }
    const keys = Object.keys(attrObj);
    const context = SpinalGraphService.getRealNode(this.contextId);
    const nodes = await context.findInContext(context, (node, stop) => {
      if (node.info.idNetwork?.get() === dataDevice.id) {
        stop()
        return true
      }
      return false
    })
    for (const node of nodes) {
      const category = await serviceDocumentation.getCategoryByName(node, "default");
      const attrs = await serviceDocumentation.getAttributesByCategory(node, category);
      for (const key of keys) {
        let found = false
        for (const attr of attrs) {
          if (key === attr.label.get()) {
            found = true;
            attr.value.set(attrObj[key])
            break;
          }
        }
        if (found === false) {
          serviceDocumentation.addAttributeByCategory(node, category, key, attrObj[key])
        }
      }
    }
  }

  /**
   *
   *
   * @param {InputDataDevice} obj
   * @memberof NetworkProcess
   */
  async updateData(obj: InputDataDevice) {
    console.log("Update data device ! => ", obj.name);
    await this.nwService.updateData.call(this.nwService, obj);
    await this.updateAttr(obj);
  }
}


