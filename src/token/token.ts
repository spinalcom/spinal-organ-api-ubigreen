/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 *
 * Token file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 *
 * Token Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 *
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with Token file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import request from 'request';
const querystring = require('querystring');
const dotenv = require('dotenv');
dotenv.config();



export class Token {
  public static token: {
    access_token: string,
    token_type: string,
    expires_in: number
  } = null;
  private static USERNAME = process.env.USERNAMEA;
  private static PASSWORD = process.env.PASSWORD;
  private static HOST = process.env.HOST
  private static VIRTUALNETWORK = process.env.VIRTUALNETWORK
  private static TOKEN_PROCESS: boolean = false;
  private static REFRESH_TOKEN_PROCESS: boolean = false;

  private static tokenExpiredDate: number;

  public static async *getTokenacc(): AsyncGenerator<typeof Token.token, never, unknown> {
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



  static it = Token.getTokenacc()
  public static async getToken(): Promise<typeof Token.token> {
    return (await Token.it.next()).value
  }


  public static sendTokenRequest(): Promise<typeof Token.token> {
    Token.TOKEN_PROCESS = true;
    return new Promise((resolve, reject) => {
      console.log("new token");
      const options = {
        url: `${Token.HOST}/${Token.VIRTUALNETWORK}/authentication`,
        method: 'post',
        json: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },

        form: querystring.stringify({
          userName: Token.USERNAME, //gave the values directly for testing
          password: Token.PASSWORD,
          grant_type: 'password'
        }),
      }

      request(options, (error, response, body) => {
        if (error) {
          console.error("erreur de recuperation de token", error);
          Token.TOKEN_PROCESS = false;
          return reject(error)
        } else if (response.statusCode != 200) {
          Token.TOKEN_PROCESS = false;
          console.log("erreur dans le sendTokenRequest", `Expected status code 200 but received ${response.statusCode}`)
          return reject(response);
        } else {
          Token.token = body;
          const date = Date.now();
          Token.tokenExpiredDate = date + (4 * 60 * 1000);
          Token.TOKEN_PROCESS = false;
          resolve(Token.token);
        }
      })
    })
  }

  public static getRefreshToken(): Promise<typeof Token.token> {

    console.log("access function refresh");
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
            userName: 'smartdesk-api', //gave the values directly for testing
            password: 'ZpycfU7yUtX55$zb',
            grant_type: 'password'
          }),
        }

        request(options, (error, response, body) => {
          console.log("access request");
          if (error) {
            console.error("error refresh token", error);
            Token.REFRESH_TOKEN_PROCESS = false;
            return reject(error);
          } if (response.statusCode != 200) {
            Token.REFRESH_TOKEN_PROCESS = false;
            return Token.sendTokenRequest();
          } else {
            Token.token = body;
            Token.REFRESH_TOKEN_PROCESS = false;
            resolve(body);
          }

        })
      });

    } else {
      console.log("wating refresh token");
    }
  }

  public static tokenIsExpired() {
    return Date.now() >= Token.tokenExpiredDate;
  }

}
