import qs from "qs";

const apiUrl = process.env.VUE_APP_API_URL;

interface Config extends RequestInit {
  data?: object;
}

export const http = async (
  endpoint: string,
  { data, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      version: "2.1.2",
      token: localStorage.getItem("token") || "",
      "Content-Type": data ? "application/x-www-form-urlencoded" : "",
      ...headers,
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    if (endpoint.includes("?r=")) {
      endpoint += `${qs.stringify(data)}`;
    } else {
      endpoint += `?${qs.stringify(data)}`;
    }
  } else {
    config.body = qs.stringify(data || {});
  }

  return window.fetch(`${apiUrl}${endpoint}`, config).then(async (response) => {
    const data = await response.json();
    if (response.ok && (data.code === 1001 || data.code === "200"))
      return data.data;
    else return Promise.reject(data);
  });
};
