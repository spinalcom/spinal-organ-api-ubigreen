"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const request_1 = __importDefault(require("request"));
const querystring = require('querystring');
class Token {
    static async *getTokenacc() {
        yield Token.sendTokenRequest();
        while (true) {
            const tokenExpired = Token.tokenIsExpired();
            if (Token.token && tokenExpired) {
                yield Token.getRefreshToken();
            }
            else {
                yield Token.token;
            }
        }
    }
    static async getToken() {
        return (await Token.it.next()).value;
    }
    static sendTokenRequest() {
        Token.TOKEN_PROCESS = true;
        return new Promise((resolve, reject) => {
            const options = {
                url: `${Token.HOST}/${Token.VIRTUALNETWORK}/authentication`,
                method: 'post',
                json: true,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                form: querystring.stringify({
                    userName: Token.USERNAME,
                    password: Token.PASSWORD,
                    grant_type: 'password'
                }),
            };
            (0, request_1.default)(options, (error, response, body) => {
                if (error) {
                    console.error("erreur de recuperation de token", error);
                    Token.TOKEN_PROCESS = false;
                    return reject(error);
                }
                else if (response.statusCode != 200) {
                    Token.TOKEN_PROCESS = false;
                    console.log("erreur dans le sendTokenRequest", `Expected status code 200 but received ${response.statusCode}`);
                    return reject(response);
                }
                else {
                    Token.token = body;
                    const date = Date.now();
                    Token.tokenExpiredDate = date + (4 * 60 * 1000);
                    Token.TOKEN_PROCESS = false;
                    resolve(Token.token);
                }
            });
        });
    }
    static getRefreshToken() {
        if (!Token.REFRESH_TOKEN_PROCESS) {
            Token.REFRESH_TOKEN_PROCESS = true;
            return new Promise((resolve, reject) => {
                const options = {
                    url: 'https://sd-api-preprod-cnp.ubigreen.com/smartdesk/authentication',
                    method: 'post',
                    json: true,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    form: querystring.stringify({
                        userName: 'smartdesk-api',
                        password: 'ZpycfU7yUtX55$zb',
                        grant_type: 'password'
                    }),
                };
                (0, request_1.default)(options, (error, response, body) => {
                    console.log("access request");
                    if (error) {
                        console.error("error refresh token", error);
                        Token.REFRESH_TOKEN_PROCESS = false;
                        return reject(error);
                    }
                    if (response.statusCode != 200) {
                        Token.REFRESH_TOKEN_PROCESS = false;
                        return Token.sendTokenRequest();
                    }
                    else {
                        Token.token = body;
                        Token.REFRESH_TOKEN_PROCESS = false;
                        resolve(body);
                    }
                });
            });
        }
        else {
            console.log("wating refresh token");
        }
    }
    static tokenIsExpired() {
        return Date.now() >= Token.tokenExpiredDate;
    }
}
exports.Token = Token;
Token.token = null;
Token.USERNAME = process.env.USERNAMEA;
Token.PASSWORD = process.env.PASSWORD;
Token.HOST = process.env.HOST;
Token.VIRTUALNETWORK = process.env.VIRTUALNETWORK;
Token.TOKEN_PROCESS = false;
Token.REFRESH_TOKEN_PROCESS = false;
Token.it = Token.getTokenacc();
//# sourceMappingURL=token.js.map