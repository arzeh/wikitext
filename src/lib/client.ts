export class Client {
  public readonly api: URL;
  public cookies: string[] = [];
  public readonly options: ClientOptions;

  public constructor(api: URL | string, options?: ClientOptions) {
    if (typeof api === 'string') {
      this.api = new URL(api);
    } else {
      this.api = api;
    }
    this.options = options || {};
  }

  public static formData(params: Record<string, unknown>): FormData {
    return Object.entries(params).reduce((form, [key, value]) => {
      form.set(key, value);
      return form;
    }, new FormData);
  }

  public static searchParams(params: Record<string, unknown>): URLSearchParams {
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

  public async get<T = unknown>(params: Record<string, unknown>, options?: RequestInit): Promise<T> {
    const searchParams = Client.searchParams(params);
    const req = await this.request(`${this.api}?${searchParams}`, options);
    return req.json() as T;
  }

  public async post<T = unknown>(params: Record<string, unknown>, options: RequestInit = {}): Promise<T> {
    let body: RequestInit['body'];

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
    return req.json() as T;
  }

  public async request(url: string | URL, options: RequestInit = {}) {
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

export interface ClientOptions {
  headers?: RequestInit['headers'];
}
