import Router from "koa-router";
import { getCookieBar, createCookieBar, updateCookieBar } from "../api";

const router = new Router();

router.get("/cookie-bar", async (ctx) => {
  const data = await getCookieBar(ctx);
  console.log("cookie-bar111", data);
  ctx.body = data;
});

router.get("/client/cookie-bar", async (ctx) => {
  const data = await getCookieBar(ctx);
  console.log("cookie-bar111", data);
  let callbackName = ctx.query.callback || "callback";
  let jsonpStr = `;${callbackName}(${
    data ? JSON.stringify(data) : JSON.stringify({})
  })`;
  // 用text/javascript，让请求支持跨域获取
  ctx.type = "text/javascript";
  ctx.body = jsonpStr;
});

router.post("/cookie-bar", async (ctx) => {
  const data = await createCookieBar(ctx, ctx.request.body);
  console.log("post222", data);
  ctx.body = data;
});

router.put("/cookie-bar", async (ctx) => {
  const data = ctx.request.body;
  console.log(data);
  ctx.body = await updateCookieBar(ctx, data.id, data);
});

export default router;
