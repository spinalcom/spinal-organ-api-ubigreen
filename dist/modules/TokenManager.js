"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenManager = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const querystring_1 = require("querystring");
class TokenManager {
    constructor() {
        this.auth_url = config_1.NETWORK_AUTH_URL_SMARTDESK;
        this.tokenGenerator = this.generateToken();
    }
    isExpired(obtained_time, expire_in) {
        return Date.now() - obtained_time > expire_in;
    }
    async *generateToken() {
        while (true) {
            try {
                const response = await axios_1.default.post(this.auth_url, (0, querystring_1.stringify)({
                    username: config_1.NETWORK_USERNAME,
                    password: config_1.NETWORK_PASSWORD,
                    grant_type: config_1.NETWORK_GRANT_TYPE,
                }));
                const token = response.data.access_token;
                const expire_in = response.data.expires_in * 1000;
                const obtained_time = new Date().getTime();
                while (!this.isExpired(obtained_time, expire_in)) {
                    yield token;
                }
            }
            catch (error) {
                console.log('Error while generating token');
                console.error(error);
                process.exit(-1);
            }
        }
    }
    async getToken() {
        return (await this.tokenGenerator.next()).value;
    }
}
exports.TokenManager = TokenManager;
//# sourceMappingURL=TokenManager.js.map