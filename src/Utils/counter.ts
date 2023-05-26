/*
 * Copyright 2023 SpinalCom - www.spinalcom.com
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
import { ApiConnector } from "src/modules/ApiConnector";
import spinalServiceTimeSeries from './spinalTimeSeries';
import moment from 'moment';

require("json5/lib/register");
// get the config
const config = require("../../config.json5");
interface IResponseUbigreenCounter {
  elements: IElementsItem[];
  paging: IPaging;
}
interface IElementsItem {
  serial: string;
  dateBegin: number;
  duration: number;
  counter: number;
}
interface IPaging {
  pageNumber: number;
  pageSize: number;
  pageCount: number;
  totalElements: number;
}

async function networkSmartRoomCounter(apiConnector: ApiConnector) {
  try {
    const context = SpinalGraphService.getContext(config.organDesk.contextName);
    const networks = await context.getChildren('hasBmsNetwork');
    const url: string = config.host + config.counter_url_smartroom;
    for (let index = 9; index <= 12; index++) {
      const elements = []
      await waitSync()
      const rep = await apiConnector.get<IResponseUbigreenCounter>(url + `?pageNumber=${index}`);
      elements.push(...rep.data.elements)
      console.log("request", index, elements.length);
      for (const network of networks) {
        if (network.getName().get() === 'SmartRoom') {
          const devices = await network.getChildren('hasBmsDevice');
          for (const device of devices) {
            const element = elements.find((item) => {
              return item.serial === device.getName().get()
            })
            if (element) {
              const endpoints = await device.getChildren('hasBmsEndpoint')
              for (const endpoint of endpoints) {
                if (endpoint.getName().get() === ' Counter') {
                  // @ts-ignore
                  SpinalGraphService._addNode(endpoint)
                  var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get())
                  let unix_timestamp = element.dateBegin
                  const datetimestamp = unix_timestamp * 1000
                  await timeseries.insert(element.counter, datetimestamp)
                }
              }
            }
          }
        }
      }
    }

  } catch (error) {
    console.error(error);
  }

}
export default networkSmartRoomCounter


function waitSync() {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      console.log("waitsync");

      return resolve()
    }, 3000);
  })
}
