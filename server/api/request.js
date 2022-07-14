import fetch from "node-fetch";
//
const baseUrl = process.env.DEPLOY_ENV
  ? process.env.DEPLOY_ENV === "test"
    ? "http://test-url"
    : "http://prod-url"
  : "https://your-url";
const request = async (
  ctx,
  path,
  method = "GET",
  requestData = {},
  headers = {}
) => {
  let query = "?";
  const customerHeaders = {};
  if (ctx.currentSession && ctx.currentSession.shop) {
    customerHeaders["X-FPP-Shop"] = ctx.currentSession.shop;
    customerHeaders["X-FPP-Token"] = ctx.currentSession.accessToken;
  } else if (ctx.query.shop) {
    customerHeaders["X-FPP-Shop"] = ctx.query.shop;
  }
  const data = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...customerHeaders,
      ...headers,
    },
  };
  if (
    method.toLowerCase() === "post" ||
    method.toLowerCase() === "put" ||
    method.toLowerCase() === "delete"
  ) {
    data.body = ["/img/upload", "/import"].includes(path)
      ? requestData
      : JSON.stringify(requestData);
  } else {
    Object.entries(requestData).forEach((item) => {
      query += `${item[0]}=${item[1]}&`;
    });
    query = query.substr(0, query.length - 1);
  }
  const url = query === "?" ? baseUrl + path : baseUrl + path + query;
  const res = await fetch(url, data);
  console.log(">>>res", url, data);
  return res.json();
};

export default request;
