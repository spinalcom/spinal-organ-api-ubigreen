import { ForgeFileItem } from "spinal-lib-forgefile";
import { InputData } from "./InputData/InputData";
import { NetworkService } from "spinal-model-bmsnetwork";
import { InputDataDevice } from "./InputData/InputDataModel/InputDataModel";
import { ConfigOrgan } from "../Utils/ConfigOrgan";
export declare class NetworkProcess {
    private inputData;
    nwService: NetworkService;
    contextId: string;
    constructor(inputData: InputData);
    init(forgeFile: ForgeFileItem, configOrgan: ConfigOrgan): Promise<void>;
    updateAttr(dataDevice: InputDataDevice): Promise<void>;
    updateData(obj: InputDataDevice): Promise<void>;
}
