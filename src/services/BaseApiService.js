import axios from "axios";
import { getEnvVariableValues } from "../utils/commonUtils";

const BASE_URL = `${getEnvVariableValues("VITE_BASE_API")}` + "/employee";

class BaseApiService {
  constructor() {}

  getAxios() {
    return axios;
  }

  makeGetRequest(url, headers) {
    url = `${BASE_URL}${url}`;
    const headersObj = {
      headers: {
        ...(headers || {}),
      },
    };
    return this.getAxios().get(url, headersObj);
  }

  makePostRequest(url, body, headers) {
    url = `${BASE_URL}${url}`;
    const headersObj = {
      headers: {
        ...(headers || {}),
      },
    };
    return this.getAxios().post(url, body, headersObj);
  }

  makePutRequest(url, body, headers) {
    url = `${BASE_URL}${url}`;
    const headersObj = {
      headers: {
        ...(headers || {}),
      },
    };
    return this.getAxios().put(url, body, headersObj);
  }

  makePatchRequest(url, body, headers) {
    url = `${BASE_URL}${url}`;
    const headersObj = {
      headers: {
        ...(headers || {}),
      },
    };
    return this.getAxios().patch(url, body, headersObj);
  }

  makeDeleteRequest(url, headers) {
    url = `${BASE_URL}${url}`;
    const headersObj = {
      headers: {
        ...(headers || {}),
      },
    };
    return this.getAxios().delete(url, headersObj);
  }
}

export default BaseApiService;
