/*
 * Copyright 2024 SpinalCom - www.spinalcom.com
 *
 * This file is part of SpinalCore.
 *
 * Please read all of the following terms and conditions
 * of the Software license Agreement ("Agreement")
 * carefully.
 *
 * This Agreement is a legally binding contract between
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
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import axios from 'axios';
import {
  NETWORK_AUTH_URL_SMARTDESK,
  NETWORK_GRANT_TYPE,
  NETWORK_PASSWORD,
  NETWORK_USERNAME,
} from '../config';

import { stringify } from 'querystring';

export class TokenManager {
  private auth_url: string = NETWORK_AUTH_URL_SMARTDESK;

  tokenGenerator = this.generateToken();

  constructor() {}

  public isExpired(obtained_time: number, expire_in: number) {
    return Date.now() - obtained_time > expire_in;
  }

  private async *generateToken(): AsyncGenerator<any, void, void> {
    while (true) {
      try {
        const response = await axios.post(
          this.auth_url,
          stringify({
            username: NETWORK_USERNAME,
            password: NETWORK_PASSWORD,
            grant_type: NETWORK_GRANT_TYPE,
          }),
        );
        const token = response.data.access_token;
        const expire_in = response.data.expires_in * 1000; // convert to ms
        const obtained_time = new Date().getTime();
        while (!this.isExpired(obtained_time, expire_in)) {
          yield token;
        }
      } catch (error) {
        console.log('Error while generating token');
        console.error(error);
        process.exit(-1);
      }
    }
  }

  // Return token if exist or isn't expired, else create a new one
  public async getToken(): Promise<string> {
    return (await this.tokenGenerator.next()).value;
  }
}
