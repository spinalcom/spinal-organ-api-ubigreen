import { SpinalGraph } from "spinal-env-viewer-graph-service";
import { GenerateData } from "src/modules/generateData";
declare function buildBmsNetworks(networkName: string, generateData: GenerateData, graph: SpinalGraph): Promise<string>;
export default buildBmsNetworks;
