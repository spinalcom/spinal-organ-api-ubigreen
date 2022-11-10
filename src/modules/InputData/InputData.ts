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

import {
  InputDataDevice,
  InputDataEndpoint,
  InputDataEndpointGroup,
  InputDataEndpointDataType,
  InputDataEndpointType
} from "./InputDataModel/InputDataModel";

import axios from 'axios';
import iconv from 'iconv-lite';
import { ApiConnector } from '../ApiConnector';
type onDataFunctionType = (obj: InputDataDevice) => void;

/**
 * Simulation Class to generate data from an extrenal source
 *
 * @class InputData
 */

class InputData {
  /**
    * @private
    * @type {onDataFunctionType}
    * @memberof InputData
    */
  private onData: onDataFunctionType;

  /**
   * @private
   * @type {InputDataDevice[]}
   * @memberof InputData
   */
  private devices: InputDataDevice[];


  private apiConnector: ApiConnector;

  /**
   *Creates an instance of InputData.
   * @memberof InputData
   */
  constructor(apiConnector: ApiConnector) {
    const intervalTest = 2000;
    this.apiConnector = apiConnector;
    this.devices = [];
    this.onData = null;
    this.generateData();
    // setInterval(this.onDataInterval.bind(this), intervalTest);
  }



  /**
   * @private
   * @memberof InputData
   */
  /**
   *
   *
   * @private
   * @memberof InputData
   */
  public updateDevice(obj: InputDataDevice, value: number) {
    //@ts-ignore
    obj.children[0]?.currentValue = value
    if (this.onData !== null) {
      this.onData(obj);
    }
  }

  public getDeviceBySerial(serial: string): InputDataDevice {
    for (const device of this.devices) {
      if (device.serial === serial) {
        return device;
      }
    }
  }

  /**
    * @param {onDataFunctionType} onData
    * @memberof InputData
    */
  public setOnDataCBFunc(onData: onDataFunctionType): void {
    this.onData = onData;
  }


  /**
   * @private
   * @memberof InputData
   */
  private async generateData() {
    try {
      let equipments = []
      const response = await this.apiConnector.get('https://sd-api-preprod-cnp.ubigreen.com/smartdesk/api/installations/CNP-SIEGE/refdevices');
      equipments = response.data.elements;
      if (response.data.paging.pageCount > 1) {
        for (let index = 2; index <= response.data.paging.pageCount; index++) {
          const rep = await this.apiConnector.get(`https://sd-api-preprod-cnp.ubigreen.com/smartdesk/api/installations/CNP-SIEGE/refdevices?pageNumber=${index}`);
          equipments.concat(rep.data.elements)
        }
      }

      for (const equipment of equipments) {
        const device = await this.generateDataDevice(equipment);
        this.devices.push(device);
      }
    } catch (error) {
      console.error(error);
    }
  }


  /**
 * @private
 * @returns {InputDataDevice}
 * @memberof InputData
 */
  private async generateDataDevice(equipement): Promise<InputDataDevice> {

    // Function to create a device or Endpoint Group
    function createFunc(
      str: string,
      type: string,
      constructor: typeof InputDataDevice | typeof InputDataEndpointGroup,
    ): any {
      return new constructor(str, type, str, '', equipement.serial, equipement.refInstallation, equipement.customerReference, equipement.ubigreenReference, equipement.positionReference);
      // return new constructor(str, type, str, '');
    }
    const device: InputDataDevice = createFunc(
      `DEVICE-${equipement.serial}`,
      'device',
      InputDataDevice,
    );
    const occupationEventType: InputDataEndpoint = new InputDataEndpoint(
      ` Occupation-DEVICE-${equipement.serial}`,
      0,
      '',
      InputDataEndpointDataType.String,
      InputDataEndpointType.Other,
      `DEVICE-${equipement.serial} Occupation`,
      '',
    );
    device.children.push(occupationEventType);
    return device;
  }

}
export { InputData };
