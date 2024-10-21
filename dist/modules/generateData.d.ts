import { InputDataDevice } from './InputData/InputDataModel/InputDataModel';
import { NetworkService } from 'spinal-model-bmsnetwork';
import type { ConfigOrgan } from '../Utils/ConfigOrgan';
import { type SpinalContext, type SpinalGraph, type SpinalNode } from 'spinal-env-viewer-graph-service';
import { ApiConnector } from './ApiConnector';
export declare class GenerateData {
    nwService: NetworkService;
    contextId: string;
    networkId: string;
    networkName: string;
    private apiConnector;
    constructor(apiConnector: ApiConnector);
    init(graph: SpinalGraph, configOrgan: ConfigOrgan): Promise<void>;
    discoverData(context: SpinalContext | SpinalNode, networkName: string): Promise<void>;
    updateUdevices(UDevices: InputDataDevice[], serialArray: any[], networkName?: string): Promise<void>;
    generateDataDevice(equipement: InputDataDevice, networkName?: string): Promise<InputDataDevice>;
    generateDataZone(zone: InputDataDevice): Promise<InputDataDevice>;
    updateData(obj: InputDataDevice): Promise<void>;
    updateAttr(dataDevice: InputDataDevice, networkName?: string): Promise<void>;
    static getDeviceBySerialOrByRefZone(serial: string, newvalue: number, tabGenerateData: GenerateData[]): Promise<{
        objDevice: InputDataDevice;
        generateData: GenerateData;
    }>;
    waitSync(): Promise<void>;
}
