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

import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service"
import { ApiConnector } from "src/modules/ApiConnector";
import spinalServiceTimeSeries from './spinalTimeSeries';
import moment from 'moment';
require("json5/lib/register");
// get the config
const config = require("../../config.json5");
// const counterjson = require("../../counter.json5");

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
    let network: SpinalNode;
    for (const _network of networks) {
      if (_network.getName().get() === 'SmartRoom') {
        network = _network
      }
    }
    const devices = await network.getChildren('hasBmsDevice');
    const url: string = config.host + config.counter_url_smartroom;
    for (let index = 1; index <= 2; index++) {
      console.log("request", index);

      const elements = [];
      await waitSync()
      const rep = await apiConnector.get<IResponseUbigreenCounter>(url + `?pageNumber=${index}`);
      elements.push(...rep.data.elements)
      let map = new Map<string, { date: number, value: number }[]>();
      const date = new Date();
      date.setHours(date.getHours() - 2);
      const _date = Math.trunc(date.getTime() / 1000);
      for (const element of elements) {
        if (element.dateBegin > _date) {
          let item = map.get(element.serial);
          if (item === undefined) {
            item = []
            map.set(element.serial, item);
          }
          item.push({ date: element.dateBegin, value: element.counter })
        }
      }
      const promise = []
      for (const [serial, arrayMap] of map) {
        const device = devices.find((_device) => {
          return _device.getName().get() === serial
        })
        if (device) {
          promise.push(insertTimeseries(device, arrayMap));
        }
      }
      await Promise.all(promise)
    }



  } catch (error) {
    console.error(error);
  }

}
export default networkSmartRoomCounter


async function insertTimeseries(device, arrayMap: { date: number; value: number; }[]) {
  const endpoints = await device.getChildren('hasBmsEndpoint');
  for (const endpoint of endpoints) {
    if (endpoint.getName().get() === ' Counter') {
      // @ts-ignore
      SpinalGraphService._addNode(endpoint);
      for (const { date, value } of arrayMap) {
        var timeseries = await spinalServiceTimeSeries().getOrCreateTimeSeries(endpoint.getId().get());
        await timeseries.insert(value, date * 1000);
      }
    }
  }
}

function waitSync() {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      console.log("waitsync");
      return resolve()
    }, 3000);
  })
}
