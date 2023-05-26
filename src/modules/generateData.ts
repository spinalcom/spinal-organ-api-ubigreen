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


import { genUID } from '../Utils/genUID';
import {
  InputDataDevice,
  InputDataEndpoint,
  InputDataEndpointGroup,
  InputDataEndpointDataType,
  InputDataEndpointType
} from "./InputData/InputDataModel/InputDataModel";
import {
  NetworkService,
  SpinalBmsDevice,
  InputDataEndpoint as idEndpoint,
  SpinalBmsEndpoint,
  InputDataEndpointGroup as idEndpointGroup,
  SpinalBmsEndpointGroup,
} from 'spinal-model-bmsnetwork';
import { serviceDocumentation } from "spinal-env-viewer-plugin-documentation-service"
import { ConfigOrgan } from "../Utils/ConfigOrgan";
import { SpinalContext, SpinalGraph, SpinalGraphService, SpinalNode } from "spinal-env-viewer-graph-service";

require("json5/lib/register");
// get the config
const config = require("../../config.json5");
import { ApiConnector } from './ApiConnector';



/**
 *
 *
 * @class name
 */
export class GenerateData {
  public nwService: NetworkService;
  public contextId: string;
  public networkId: string;
  public networkName: string
  private apiConnector: ApiConnector;


  /**
   *Creates an instance of InputData.
   * @memberof GenerateData
   */
  constructor(apiConnector: ApiConnector) {
    this.apiConnector = apiConnector;
    this.nwService = new NetworkService();
  }
  /**
   *
   *
   * @param {SpinalGraph} graph
   * @param {ConfigOrgan} configOrgan
   * @returns {Promise<void>}
   * @memberof GenerateData
   */
  public async init(
    graph: SpinalGraph,
    configOrgan: ConfigOrgan
  ): Promise<void> {
    const rep = await this.nwService.init(graph, configOrgan);
    this.contextId = rep.contextId;
    this.networkId = rep.networkId;
    this.networkName = configOrgan.networkName;
  }


  /**
   * @private
   * @memberof GenerateData
   */
  public async discoverData(context: SpinalContext | SpinalNode, networkName: string) {
    try {
      let UDevices = []
      let SDevices: SpinalNode[];
      let serialArray = []
      const networks = await context.getChildren('hasBmsNetwork');
      for (const network of networks) {
        if (network.getName().get() === networkName) {
          SDevices = await network.getChildren('hasBmsDevice')
        }
      }
      for (const SDevice of SDevices) {
        serialArray.push(SDevice.getName().get())
      }

      if (networkName === 'SmartDesk') {
        const url: string = config.host + config.refDevices_url_smartdesk + '?pageSize=1000&pageNumber=2'
        const response = await this.apiConnector.get<any>(url);
        UDevices = response.data.elements;
        await this.updateUdevices(UDevices, serialArray, networkName);
        // if (response.data.paging.pageCount > 1) {
        //   for (let index = 2; index <= response.data.paging.pageCount; index++) {
        //     await this.waitSync();
        //     const rep = await this.apiConnector.get(config.host + config.refDevices_url_smartdesk + `?pageSize=1000&pageNumber=${index}`);
        //     await this.updateUdevices(rep.data.elements, serialArray);
        //   }
        // }
      } else if (networkName === 'SmartRoom') {
        const url: string = config.host + config.refDevices_url_smartroom + '?pageSize=1000&pageNumber=1'
        const response = await this.apiConnector.get<any>(url);
        UDevices = response.data.elements;
        await this.updateUdevices(UDevices, serialArray, networkName);
        // if (response.data.paging.pageCount > 1) {
        //   for (let index = 2; index <= response.data.paging.pageCount; index++) {
        //     await this.waitSync();
        //     const rep = await this.apiConnector.get(config.host + config.refDevices_url_smartdesk + `?pageSize=1000&pageNumber=${index}`);
        //     await this.updateUdevices(rep.data.elements, serialArray);
        //   }
        // }
      } else if (networkName === 'SmartFlow') {
        const url: string = config.host + config.refZones_url_smartflow;
        const response = await this.apiConnector.get<any>(url);
        UDevices = response.data.elements;
        await this.updateUdevices(UDevices, serialArray, networkName);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async updateUdevices(UDevices: any[], serialArray: any[], networkName?: string) {
    for (const UDevice of UDevices) {
      if (networkName === "SmartFlow") {
        if (serialArray.includes(UDevice.refZone) === false) {
          const device = await this.generateDataZone(UDevice);
          await this.nwService.updateData(device);
          await this.updateAttr(device, networkName);
        }
      }
      else {
        if (serialArray.includes(UDevice.serial) === false) {
          const device = await this.generateDataDevice(UDevice, networkName);
          await this.nwService.updateData(device);
          await this.updateAttr(device, networkName);
        }
      }

    }
  }
  /**
* @private
* @returns {InputDataDevice}
* @memberof GenerateData
*/
  public async generateDataDevice(equipement: InputDataDevice, networkName?: string): Promise<InputDataDevice> {
    // Function to create a device or Endpoint Group
    function createFunc(
      str: string,
      type: string,
      constructor: typeof InputDataDevice
    ): any {
      return new constructor(str, type, str, '', equipement.serial, equipement.refInstallation, equipement.customerReference, equipement.ubigreenReference, equipement.positionReference);
    }
    const device: InputDataDevice = createFunc(
      equipement.serial,
      'device',
      InputDataDevice,
    );
    const occupationEventType: InputDataEndpoint = new InputDataEndpoint(
      ` Occupation`,
      0,
      '',
      InputDataEndpointDataType.String,
      InputDataEndpointType.Other,
      `DEVICE-${equipement.serial} Occupation`,
      '',
    );
    if (networkName === "SmartRoom") {
      const counterEventType: InputDataEndpoint = new InputDataEndpoint(
        ` Counter`,
        0,
        'person',
        InputDataEndpointDataType.String,
        InputDataEndpointType.Other,
        `DEVICE-${equipement.serial} Counter`,
        '',
      );
      const percentageEventType: InputDataEndpoint = new InputDataEndpoint(
        ` Percentage`,
        0,
        '%',
        InputDataEndpointDataType.String,
        InputDataEndpointType.Other,
        `DEVICE-${equipement.serial} Percentage`,
        '',
      );
      device.children.push(counterEventType);
      device.children.push(percentageEventType);
    }
    device.children.push(occupationEventType);
    return device;
  }


  public async generateDataZone(zone: InputDataDevice): Promise<InputDataDevice> {
    // Function to create a device or Endpoint Group
    function createFunc(
      str: string,
      type: string,
      constructor: typeof InputDataDevice
    ): any {
      return new constructor(str, type, str, '', zone.refZone, zone.customerReference, zone.ubigreenReference);
    }
    const device: InputDataDevice = createFunc(
      zone.refZone,
      'device',
      InputDataDevice,
    );
    const counterEventType: InputDataEndpoint = new InputDataEndpoint(
      ` Counter`,
      0,
      'person',
      InputDataEndpointDataType.String,
      InputDataEndpointType.Other,
      `DEVICE-${zone.refZone} Counter`,
      '',
    );
    device.children.push(counterEventType);
    return device;
  }
  /**
   *
   *
   * @param {InputDataDevice} obj
   * @memberof GenerateData
   */
  async updateData(obj: InputDataDevice) {
    // console.log("Update data device ! => ", obj.name);
    await this.nwService.updateData.call(this.nwService, obj);
  }
  public async updateAttr(dataDevice: InputDataDevice, networkName?: string) {
    var attrObj: any;
    if (networkName === "SmartFlow") {
      attrObj = {
        refZone: dataDevice.refZone,
        customerReference: dataDevice.customerReference,
        ubigreenReference: dataDevice.ubigreenReference,
      }
    } else {
      attrObj = {
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
  }
  static async getDeviceBySerialOrByRefZone(serial: string, newvalue: number, tabGenerateData: GenerateData[]): Promise<{ objDevice: InputDataDevice, generateData: GenerateData }> {
    const contextId = tabGenerateData[0].contextId;
    const context = SpinalGraphService.getRealNode(contextId);
    const networks = await context.getChildren('hasBmsNetwork');
    for (const network of networks) {
      const generateData = tabGenerateData.find((t) => {
        return t.networkId === network.getId().get()
      })
      if (generateData === undefined) {
        continue;
      }
      const devices = await network.getChildren('hasBmsDevice')
      for (const device of devices) {
        if (device.getName().get() === serial) {
          const endpoints = await device.getChildren('hasBmsEndpoint');
          var _endpoint: SpinalNode<any>;
          for (const endpoint of endpoints) {
            if (endpoint.getName().get() === ' Occupation') {
              _endpoint = endpoint
            } else if (network.getName().get() === "SmartFlow" && endpoint.getName().get() === ' Counter') {
              _endpoint = endpoint;
            }
          }
          const elementEndpoint = await _endpoint.getElement(true);

          let objDevice: InputDataDevice = {
            name: device.getName().get(),
            type: 'device',
            id: device.info.idNetwork.get(),
            path: '',
            serial: device.getName().get(),
            refInstallation: "",
            customerReference: "",
            ubigreenReference: "",
            positionReference: "",
            address: "",
            nodeTypeName: SpinalBmsDevice.nodeTypeName,
            children: [{
              id: _endpoint.info.idNetwork.get(),
              typeId: '',
              name: _endpoint.getName().get(),
              path: elementEndpoint.path.get(),
              currentValue: newvalue,
              unit: elementEndpoint.unit.get(),
              dataType: elementEndpoint.dataType.get(),
              type: elementEndpoint.type.get(),
              nodeTypeName: SpinalBmsEndpoint.nodeTypeName,
              timeseries: [],
              idx: 0
            }]
          }
          return { objDevice, generateData };
        }
      }
    }
  }

  public async waitSync() {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        return resolve()
      }, 2000);
    })
  }
}
