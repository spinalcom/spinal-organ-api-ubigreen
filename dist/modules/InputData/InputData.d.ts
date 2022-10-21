import { InputDataDevice } from "./InputDataModel/InputDataModel";
import { ApiConnector } from '../ApiConnector';
declare type onDataFunctionType = (obj: InputDataDevice) => void;
declare class InputData {
    private onData;
    private devices;
    private apiConnector;
    constructor(apiConnector: ApiConnector);
    private onDataInterval;
    setOnDataCBFunc(onData: onDataFunctionType): void;
    private generateData;
    private generateDataDevice;
    private updateDevice;
    private getAndUpdateOneRandomDevice;
}
export { InputData };
