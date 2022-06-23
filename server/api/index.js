import request from "./request";

export const getSetting = async (ctx) => await request(ctx, "/setting/");
