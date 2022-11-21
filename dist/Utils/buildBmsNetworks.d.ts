import { NetworkProcess } from "../modules/NetworkProcess";
import { ForgeFileItem } from "spinal-lib-forgefile";
declare function buildBmsNetworks(networkName: string, networkProcess: NetworkProcess, forgeFile: ForgeFileItem): Promise<string>;
export default buildBmsNetworks;
