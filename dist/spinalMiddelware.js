"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_core_connectorjs_type_1 = require("spinal-core-connectorjs_type");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const config_1 = require("./config");
const spinal_lib_organ_monitoring_1 = require("spinal-lib-organ-monitoring");
class SpinalAPIMiddleware {
    static getInstance() {
        if (SpinalAPIMiddleware.instance === null) {
            SpinalAPIMiddleware.instance = new SpinalAPIMiddleware();
        }
        return SpinalAPIMiddleware.instance;
    }
    constructor() {
        this.iteratorGraph = this.geneGraph();
        this.loadedPtr = new Map();
        const protocol = config_1.SPINALHUB_PROTOCOL ? config_1.SPINALHUB_PROTOCOL : 'http';
        const host = config_1.SPINALHUB_IP + (config_1.SPINALHUB_PORT ? `:${config_1.SPINALHUB_PORT}` : '');
        const login = `${config_1.SPINAL_USER_ID}:${config_1.SPINAL_PASSWORD}`;
        const connect_opt = `${protocol}://${login}@${host}/`;
        console.log(`start connect to hub: ${protocol}://${host}/`);
        this.conn = spinal_core_connectorjs_type_1.spinalCore.connect(connect_opt);
        spinal_lib_organ_monitoring_1.configFile.init(this.conn, `${config_1.SPINAL_MONITORING_FILE_NAME}`, 'Connector', config_1.SPINALHUB_IP, parseInt(config_1.SPINALHUB_PORT));
    }
    async *geneGraph() {
        const init = new Promise((resolve, reject) => {
            spinal_core_connectorjs_type_1.spinalCore.load(this.conn, config_1.SPINAL_DIGITALTWIN_PATH, (graph) => {
                spinal_env_viewer_graph_service_1.SpinalGraphService.setGraph(graph)
                    .then(() => {
                    resolve(graph);
                })
                    .catch((e) => {
                    console.error(e);
                    reject();
                });
            }, () => {
                console.error(`File does not exist in location ${config_1.SPINAL_DIGITALTWIN_PATH}`);
                reject();
            });
        });
        const graph = await init;
        while (true) {
            yield graph;
        }
    }
    async getGraph() {
        const g = await this.iteratorGraph.next();
        return g.value;
    }
    load(server_id) {
        if (!server_id) {
            return Promise.reject('Invalid serverId');
        }
        if (typeof spinal_core_connectorjs_type_1.FileSystem._objects[server_id] !== 'undefined') {
            return Promise.resolve(spinal_core_connectorjs_type_1.FileSystem._objects[server_id]);
        }
        return new Promise((resolve, reject) => {
            this.conn.load_ptr(server_id, (model) => {
                if (!model) {
                    reject('loadptr failed...!');
                }
                else {
                    resolve(model);
                }
            });
        });
    }
    loadPtr(ptr) {
        if (ptr instanceof spinal_core_connectorjs_type_1.spinalCore._def['File'])
            return this.loadPtr(ptr._ptr);
        const server_id = ptr.data.value;
        if (this.loadedPtr.has(server_id)) {
            return this.loadedPtr.get(server_id);
        }
        const prom = new Promise((resolve, reject) => {
            try {
                this.conn.load_ptr(server_id, (model) => {
                    if (!model) {
                        reject(new Error(`LoadedPtr Error server_id: '${server_id}'`));
                    }
                    else {
                        resolve(model);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
        this.loadedPtr.set(server_id, prom);
        return prom;
    }
}
SpinalAPIMiddleware.instance = null;
exports.default = SpinalAPIMiddleware;
//# sourceMappingURL=spinalMiddelware.js.map