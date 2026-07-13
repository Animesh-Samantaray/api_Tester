import axios from "axios";

import createAxiosConfig from "../utils/createAxiosConfig.js";

export const executeRequest = async (requestData) => {

  const config =
    createAxiosConfig(requestData);

  const start = Date.now();

  const response =
    await axios(config);

  const end = Date.now();

  const responseTime =
    end - start;

  return {

    status: response.status,

    statusText: response.statusText,

    headers: response.headers,

    body: response.data,

    responseTime,

  };

};