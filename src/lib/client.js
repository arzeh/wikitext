/**
 * @typedef {Object} ClientOptions
 * @property {RequestInit['headers']} [headers]
 */

export class Client {
  /**
   * @readonly
   * @type {URL}
   * @since 1.0.0
   */
  api;

  /**
   * @type {string[]}
   * @since 1.0.0
   */
  cookies = [];

  /**
   * @readonly
   * @type {ClientOptions}
   * @since 1.0.0
   */
  options;

  /**
   * @param {URL | string} api
   * @param {ClientOptions} [options]
   * @since 1.0.0
   */
  constructor(api, options) {
    if (typeof api === 'string') {
      this.api = new URL(api);
    } else {
      this.api = api;
    }
    this.options = options || {};
  }

  /**
   * @param {Record<string, unknown>} params
   * @returns {FormData}
   * @since 1.0.0
   */
  static formData(params) {
    return Object.entries(params).reduce((form, [key, value]) => {
      form.set(key, value);
      return form;
    }, new FormData);
  }

  /**
   * @param {Record<string, unknown>} params
   * @returns {URLSearchParams}
   * @since 1.0.0
   */
  static searchParams(params) {
    return Object.entries(params).reduce((result, [key, value]) => {
      if (Array.isArray(value)) value = value.join('|');

      switch (typeof value) {
        case 'string':
          result.set(key, value);
          break;

        case 'boolean':
          result.set(key, value ? '1' : '0');
          break;

        default:
          result.set(key, `${value}`);
      }
      return result;
    }, new URLSearchParams());
  }

  /**
   * @template [T=unknown]
   * @param {Record<string, unknown>} params
   * @param {RequestInit} [options]
   * @returns {Promise<T>}
   * @since 1.0.0
   */
  async get(params, options) {
    const searchParams = Client.searchParams(params);
    const req = await this.request(`${this.api}?${searchParams}`, options);
    return /** @type {T} */ await req.json();
  }

  /**
   * @template [T=unknown]
   * @param {Record<string, unknown>} params
   * @param {RequestInit} [options]
   * @returns {Promise<T>}
   * @since 1.0.0
   */
  async post(params, options = {}) {
    /** @type RequestInit['body'] */
    let body;

    // @ts-expect-error content-type exists in headers
    switch (options.headers['content-type']) {
      case 'application/x-www-form-urlencoded':
        body = Client.searchParams(params);
        break;

      case 'multipart/form-data':
        body = Client.formData(params);
        break;

      default:
        body = JSON.stringify(params);
        break;
    }
    options = Object.assign({}, options, {
      body,
      method: 'post',
    });

    const req = await this.request(this.api, options);
    return /** @type {T} */ await req.json();
  }

  /**
   * @param {string | URL} url
   * @param {RequestInit} [options]
   * @returns {Promise<Response>}
   * @since 1.0.0
   */
  async request(url, options = {}) {
    const headers = Object.assign(
      {},
      this.options.headers || {},
      options.headers || {},
      { cookie: this.cookies.join(',') },
    );

    options = Object.assign({}, options, { headers });

    const req = await fetch(url, options);
    this.cookies = this.cookies.concat(req.headers.getSetCookie());

    return req;
  }
}

