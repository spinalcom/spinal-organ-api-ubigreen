"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConnector = void 0;
const axios_1 = __importDefault(require("axios"));
const TokenManager_1 = require("./TokenManager");
const querystring = require('querystring');
class ApiConnector {
    constructor() {
        this.TokenManager = new TokenManager_1.TokenManager();
    }
    async getConfig() {
        return {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Bearer " + await this.TokenManager.getToken()
            }
        };
    }
    async get(url) {
        const config = await this.getConfig();
        return axios_1.default.get(url, config);
    }
    async post(url, data) {
        const config = await this.getConfig();
        return axios_1.default.post(url, data, config);
    }
}
exports.ApiConnector = ApiConnector;
//# sourceMappingURL=ApiConnector.js.map