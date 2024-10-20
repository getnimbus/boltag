import axios, { type AxiosInstance } from "axios";

interface IOption {
  baseURL: string;
  getHeaderAuthorize: () => void;
}

interface IReqOption {
  params?: Record<string, any>;
  headers?: Record<string, any>;
}

const createAxiosInterface = ({ baseURL, getHeaderAuthorize }: IOption) => {
  return {
    get<T>(url: string, config?: IReqOption): Promise<T> {
      const apiUrl = new URL(`${baseURL}${url}`);
      if (config?.params) {
        Object.keys(config.params)
          .filter((_) => _)
          .forEach((key) =>
            apiUrl.searchParams.append(key, config.params[key]),
          );
      }
      const authorization: any = getHeaderAuthorize();
      return fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(config?.headers || {}),
          ...authorization,
        },
      }).then(async (response) => {
        if (response.status === 403) {
          throw new Error(await response.json());
        }
        return await response.json();
      });
    },
    post<T>(url: string, body: any, config?: IReqOption): Promise<T> {
      const apiUrl = new URL(`${baseURL}${url}`);
      if (config?.params) {
        Object.keys(config.params)
          .filter((_) => _)
          .forEach((key) =>
            apiUrl.searchParams.append(key, config.params[key]),
          );
      }
      const authorization: any = getHeaderAuthorize();
      return fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(config?.headers || {}),
          ...authorization,
        },
        body: JSON.stringify(body),
      }).then((response) => response.json());
    },
    put(url: string, body: any, config?: any) {
      const apiUrl = new URL(`${baseURL}${url}`);
      if (config?.params) {
        Object.keys(config.params).forEach((key) =>
          apiUrl.searchParams.append(key, config.params[key]),
        );
      }
      const authorization: any = getHeaderAuthorize();
      return fetch(apiUrl, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(config?.headers || {}),
          ...authorization,
        },
        body: JSON.stringify(body),
      }).then((response) => response.json());
    },
    delete(url: string, body: any, config?: any) {
      const apiUrl = new URL(`${baseURL}${url}`);
      if (config?.params) {
        Object.keys(config.params).forEach((key) =>
          apiUrl.searchParams.append(key, config.params[key]),
        );
      }
      const authorization: any = getHeaderAuthorize();
      return fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(config?.headers || {}),
          ...authorization,
        },
        body: JSON.stringify(body),
      }).then((response) => response.json());
    },
  };
};

export const API_URL =
  import.meta.env.VITE_API_URL || "https://api-staging.getnimbus.io";

export const internalNimbus = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-key": import.meta.env.VITE_API_KEY,
  },
  timeout: 5 * 60 * 1000, // 5 min
});

export const userAPICreate = async (
  token: string,
  owner: string,
): Promise<{ api: AxiosInstance; owner: string }> => {
  return {
    api: axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token,
      },
    }),
    owner: owner,
  };
};

export const nimbus = createAxiosInterface({
  baseURL: API_URL,
  getHeaderAuthorize: () => {
    const token = localStorage.getItem("token");
    if (token) {
      return {
        Authorization: `${token}`,
      };
    }
  },
});

export const defillama = createAxiosInterface({
  baseURL: "https://coins.llama.fi",
  getHeaderAuthorize: () => {},
});

export const mixpanel = createAxiosInterface({
  baseURL: "https://api.mixpanel.com",
  getHeaderAuthorize: () => {},
});
