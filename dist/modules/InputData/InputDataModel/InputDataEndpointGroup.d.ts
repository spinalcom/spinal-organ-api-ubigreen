import { InputDataEndpointGroup as idEndpointGroup } from 'spinal-model-bmsnetwork';
import { InputDataEndpoint } from './InputDataEndpoint';
export declare class InputDataEndpointGroup implements idEndpointGroup {
    id: string;
    name: string;
    type: string;
    path: string;
    children: (InputDataEndpoint)[];
    nodeTypeName: string;
    constructor(name?: string, type?: string, id?: string, path?: string);
}
