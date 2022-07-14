import request from "./request";
import RedisStore from "../session/redisStorage";
import { embeddedPrefix, IS_EMBEDDED_APP } from "../../config";
// B
export const GET = async (ctx) => await request(ctx, ctx.url);

export const POST = async (ctx, data, headers = {}) =>
  await request(ctx, ctx.url, "POST", data, headers);

export const PATCH = async (ctx, data) =>
  await request(ctx, ctx.url, "PATCH", data);

export const PUT = async (ctx, data) =>
  await request(ctx, ctx.url, "PUT", data);

export const DELETE = async (ctx, data) =>
  await request(ctx, ctx.url, "DELETE", data);

export const getProductsCount = async (ctx) => {
  try {
    const {shop, accessToken} = ctx.currentSession;
    const res = await fetch(
      `https://${shop}/admin/api/2022-02/products.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${accessToken}`,
        },
      }
    );
    const products = await res.json();
    return {
      code: 0,
      products: products.products.length
    }
  } catch (err) {
    return {
      code: 1,
      msg: err
    }
  }

}

export const createScript = async (shop, accessToken, data) => {
  const res = await fetch(
    `https://${shop}/admin/api/2022-02/script_tags.json`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const scriptData = await res.json();
  console.log("scriptData", scriptData);
  return scriptData;
};

export const getScriptList = async (shop, accessToken) => {
  const scriptResponse = await fetch(
    `https://${shop}/admin/api/2022-02/script_tags.json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const scriptList = await scriptResponse.json();
  console.log("script_tags_list", scriptList);
  return scriptList;
};
export const updateScript = async (shop, accessToken, id, data) => {
  const res = await fetch(
    `https://${shop}/admin/api/2022-02/script_tags/${id}.json`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const scriptData = await res.json();
  console.log("scriptData updated", scriptData);
  return scriptData;
};

export const deleteScript = async (shop, accessToken, id) => {
  try {
    const res = await fetch(
      `https://${shop}/admin/api/2022-02/script_tags/${id}.json`,
      {
        method: "DELETE",
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );
    console.log("scriptData deleted，id: ", id);
  } catch (err) {
    console.log("scriptData deleted，err", err);
  }
};

//代码编辑相关
export const GetThemeList = async (shop, accessToken) => {
  const themeListResponse = await fetch(
    `https://${shop}/admin/api/2022-02/themes.json`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const themeListList = await themeListResponse.json();
  return themeListList;
};
export const GetThemeInfo = async (shop, accessToken, id, path) => {
  const themeInfoResponse = await fetch(
    `https://${shop}/admin/api/2022-02/themes/${id}/assets.json?asset[key]=${path}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const themeInfo = await themeInfoResponse.json();
  return themeInfo;
};
export const UpdateThemeInfo = async (shop, accessToken, id, data) => {
  const res = await fetch(
    `https://${shop}/admin/api/2022-02/themes/${id}/assets.json`,
    {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `token ${accessToken}`,
      },
    }
  );
  const updatedInfo = await res.json();
  return updatedInfo;
};

const coreBaseUrl = process.env.DEPLOY_ENV
  ? process.env.DEPLOY_ENV === "test"
    ? "http://core-api.test.gaea.papaya"
    : "http://core-api.prod.gaea.papaya"
  : "https://gaea-core-api-test-7qy5ieof5a-uc.a.run.app";

export async function getCustomerOrders(ctx) {
  try {
    const sessionStorage = RedisStore.getInstance();
    const { token, shop } = ctx.query;
    if (!token) return null;
    const customerRes = await fetch(
      `${coreBaseUrl}/accounts/consumer/check-token?domain=${shop}&token=${token}`,
      {
        method: "GET",
      }
    );
    const customerInfo = await customerRes.json();
    const id = customerInfo.id;
    const { accessToken } = await sessionStorage.loadCallback(
      IS_EMBEDDED_APP ? embeddedPrefix + shop : shop
    );
    if (accessToken) {
      const ordersRes = await fetch(
        `https://${shop}/admin/api/2022-02/customers/${id}.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${accessToken}`,
          },
        }
      );
      const orderInfo = await ordersRes.json();
      return orderInfo.customer.orders_count;
    } else {
      return "accessToken 已过期";
    }
  } catch (err) {
    console.log("getCustomerOrders error", err);
    return null;
  }
}
