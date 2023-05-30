"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const axios_1 = __importDefault(require("axios"));
const config = require("../../config.json5");
const querystring = require('querystring');
class TokenManager {
    constructor() {
        this.token = null;
        this.auth_url = config.auth_url_smartdesk;
    }
    isExpired() {
        const now = new Date().getTime();
        return now - this.obtained_time > this.expire_in;
    }
    async getToken() {
        try {
            if (this.token && !this.isExpired()) {
                return this.token;
            }
            const response = await axios_1.default.post(this.auth_url, querystring.stringify({ username: config.username, password: config.password, grant_type: config.grant_type }));
            this.token = response.data.access_token;
            this.expire_in = response.data.expires_in * 1000;
            this.obtained_time = new Date().getTime();
            return this.token;
        }
        catch (error) {
            console.error(error);
        }
    }
}
exports.TokenManager = TokenManager;
//# sourceMappingURL=TokenManager.js.map