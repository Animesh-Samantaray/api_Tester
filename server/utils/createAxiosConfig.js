const createAxiosConfig = ({
  method,
  url,
  headers = {},
  body = {},
  params = {},
  auth = {},
}) => {

  const axiosHeaders = { ...headers };

  if (
    auth.type === "bearer" &&
    auth.token
  ) {
    axiosHeaders.Authorization = `Bearer ${auth.token}`;
  }

  if (
    auth.type === "apikey" &&
    auth.key &&
    auth.value
  ) {
    axiosHeaders[auth.key] = auth.value;
  }

  return {
    method,
    url,
    headers: axiosHeaders,
    data: body,
    params,
    validateStatus: () => true,
  };
};

export default createAxiosConfig;