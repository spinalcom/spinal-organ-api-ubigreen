import { InputDataEndpoint as idEndpoint, InputDataEndpointDataType, InputDataEndpointType } from "spinal-model-bmsnetwork";
export declare class InputDataEndpoint implements idEndpoint {
    id: string;
    typeId: string;
    name: string;
    path: string;
    currentValue: number | string | boolean;
    unit: string;
    dataType: InputDataEndpointDataType;
    type: InputDataEndpointType;
    nodeTypeName: string;
    timeseries: any[];
    idx: number;
    constructor(name?: string, currentValue?: number | string | boolean, unit?: string, dataType?: InputDataEndpointDataType, type?: InputDataEndpointType, id?: string, path?: string);
}
