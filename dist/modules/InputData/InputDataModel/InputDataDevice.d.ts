import { InputDataDevice as idDevice } from 'spinal-model-bmsnetwork';
import { InputDataEndpoint } from './InputDataEndpoint';
import { InputDataEndpointGroup } from './InputDataEndpointGroup';
export declare class InputDataDevice implements idDevice {
    id: string;
    name: string;
    type: string;
    path: string;
    serial: string;
    refZone?: string;
    refInstallation: string;
    customerReference: string;
    ubigreenReference: string;
    positionReference: string;
    address: string;
    children: (InputDataDevice | InputDataEndpoint | InputDataEndpointGroup)[];
    nodeTypeName: string;
    constructor(name?: string, type?: string, id?: string, path?: string, serial?: string, refInstallation?: string, customerReference?: string, ubigreenReference?: string, positionReference?: string);
}
