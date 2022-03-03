import request from "./request";

export const getCookieBar = async (ctx) => await request(ctx, "/cookie-bar/");

export const createCookieBar = async (ctx, data) =>
  await request(ctx, "/cookie-bar/", "POST", data);

export const updateCookieBar = async (ctx, id, data) =>
  await request(ctx, `/cookie-bar/${id}`, "PUT", data);
