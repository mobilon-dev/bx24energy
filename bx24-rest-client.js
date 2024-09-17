// @ts-check

const axios = require('axios');
const {requestLogger, responseLogger} = require('axios-logger');

class BX24RestClient {
  /**
  *  @param {string} domain
  *  @param {string} auth
  *  @param {object} options
  */
  constructor(domain, auth, options = null) {
    // this.domain = domain;
    // this.auth = auth;
    // @ts-ignore
    this.axios = axios.create({
      baseURL: 'https://' + domain,
      params: {
        auth,
      },
    });


    if (options?.debug) {
      const config = {
        prefixText: 'BX24RestClient',
        // status: true,
        headers: false,
        params: true,
      };
      this.axios.interceptors.request.use((request) => {
        return requestLogger(request, config);
      });
      this.axios.interceptors.response.use((response) => {
        return responseLogger(response, config);
      });
    }
  }

  /**
   *
   * @param {string} method
   * @param {object} params
   * @returns
   */
  async callMethod(method, params = null) {
    const url = `/rest/${method}.json`;
    const response = await this.axios.post(url, params);
    return response.data;
  }
}


class BX24AuthService {
  constructor({clientId, clientSecret, redirectUri}, options) {
    // @ts-ignore
    this.axios = axios.create({
      baseURL: 'https://oauth.bitrix.info',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'refresh_token',
      },
    },
    );
    if (options?.debug) {
      const config = {
        prefixText: 'BX24AuthService',
        // status: true,
        headers: false,
        params: true,
      };
      this.axios.interceptors.request.use((request) => {
        return requestLogger(request, config);
      });
      this.axios.interceptors.response.use((response) => {
        return responseLogger(response, config);
      });
    }
  }

  async refreshToken(refreshToken) {
    const response = await this.axios.get('/oauth/token', {
      params: {
        refresh_token: refreshToken,
      },
    });
    return response.data;
  }
}

module.exports = {BX24RestClient, BX24AuthService};
