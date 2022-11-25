import { InputDataDevice } from "./InputDataModel/InputDataModel";
import { ApiConnector } from '../ApiConnector';
declare type onDataFunctionType = (obj: InputDataDevice) => void;
declare class InputData {
    private onData;
    private devices;
    private apiConnector;
    constructor(apiConnector: ApiConnector);
    updateDevice(obj: InputDataDevice, value: number): Promise<void>;
    getDeviceBySerial(serial: string): InputDataDevice;
    setOnDataCBFunc(onData: onDataFunctionType): void;
    private generateData;
    private generateDataDevice;
}
export { InputData };
