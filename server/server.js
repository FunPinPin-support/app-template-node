import "@babel/polyfill";
import semver from "semver";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createFppAuth, { verifyRequest } from "koa-fpp-auth";
import Fpp, { ApiVersion } from "fpp-node-api";
import RedisStorage from "./session/redisStorage";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
// import cors from '@koa/cors';
import koaBody from "koa-body";
import cookieBarRouter from "./routes";
import koaStatic from "koa-static";
import path from "path";
import { embeddedPrefix, IS_EMBEDDED_APP } from "../config";
import { appHookHandler } from "../server/webhook";
// import { createScript, getScriptList, updateScript, deleteScript } from "./api";
const { engines } = require("../package.json");
if (!semver.satisfies(process.version, engines.node)) {
  console.log(
    `Required node version ${engines.node}, but got ${process.version}`
  );
  process.exit(1);
}
const deployEnv = process.env.DEPLOY_ENV || "test";
const ENV_PATH =
  process.env.NODE_ENV === "production" ? `../.env.${deployEnv}` : "../.env";
dotenv.config({ path: path.resolve(__dirname, ENV_PATH) });
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});

const handle = app.getRequestHandler();
const sessionStorage = RedisStorage.getInstance();

Fpp.Context.initialize({
  API_KEY: process.env.FPP_API_KEY,
  API_SECRET_KEY: process.env.FPP_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.February22,
  IS_EMBEDDED_APP: IS_EMBEDDED_APP,
  // we supported redis storage , it can be replaced with your preferred storage strategy or memeory storage: new Fpp.Session.MemmorySessionStorage
  SESSION_STORAGE: new Fpp.Session.CustomSessionStorage(
    sessionStorage.storeCallback.bind(sessionStorage),
    sessionStorage.loadCallback.bind(sessionStorage),
    sessionStorage.deleteCallback.bind(sessionStorage)
  ),
});

appHookHandler();
app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Fpp.Context.API_SECRET_KEY];
  // server.use(cors());
  server.use(
    createFppAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.fpp
        const { shop, accessToken, scope } = ctx.state.fpp;
        console.log("token", shop, accessToken);
        const host = ctx.query.host;
        // Storing the currently active shops in memory will force them to re-login when your server restarts. You should
        // persist this object in your app.
        await sessionStorage.storeCallback({
          id: IS_EMBEDDED_APP ? embeddedPrefix + shop : shop,
          shop: shop,
          accessToken,
          scope,
        });
        // You should replace scriptName with your own javascript file name
        const scriptName = "demo";
        const scriptSrc = `${process.env.HOST}/${scriptName}.js`;

        //  creating scriptTags. If you need it open the next comments.
        /*const data = {
          script_tag: {
            event: "onload",
            src: scriptSrc,
            display_scope: "online_store"
          },
        };
        try {
          const scriptList = await getScriptList(shop, accessToken);
          const { script_tags } = scriptList;
          if (script_tags) {
            const matchedScriptIndex = script_tags.findIndex((tag) =>
              tag.src.endsWith(`${scriptName}.js`)
            );
            if (matchedScriptIndex < 0 || script_tags.length <= 0) {
              console.log("没有匹配的name");
              const scriptData = await createScript(shop, accessToken, data);
              //  如果后缀不相等而且整个url不相等才更新
            } else if (
              script_tags.findIndex((tag) => tag.src === scriptSrc) < 0
            ) {
              console.log("没有匹配的url");
              const id = script_tags[matchedScriptIndex].id;
              const scriptData = await updateScript(
                shop,
                accessToken,
                id,
                data
              );
            }
            // 删除掉旧的js
            if (script_tags.length) {
              for (const oldScript of script_tags) {
                await deleteScript(shop, accessToken, oldScript.id);
              }
            }
          } else {
            console.log("else 没有匹配的name");
            const scriptData = await createScript(shop, accessToken, data);
          }
        } catch (e) {
          console.log("scriptTagError", e);
        }*/

        // deal with webhooks
        const response = await Fpp.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
        });
        console.log("webhooks register:", response);
        if (!response["APP_UNINSTALLED"].success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response["APP_UNINSTALLED"].result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );
  server.use(async (ctx, next) => {
    if (!ctx.request.url.includes("/webhooks")) {
      await koaBody({
        parsedMethods: ["POST", "PUT", "PATCH", "DELETE"],
      })(ctx, next);
    } else {
      await next();
    }
  });
  server.use(koaStatic(path.join(__dirname, "../public")));
  server.use(async (ctx, next) => {
    const currentSession = await Fpp.Utils.loadCurrentSession(ctx.req, ctx.res);
    if (currentSession) {
      ctx.currentSession = currentSession;
    }
    await next();
  });

  server.use(async (ctx, next) => {
    if (ctx.currentSession) {
      if (IS_EMBEDDED_APP) {
        const res = await sessionStorage.loadCallback(
          embeddedPrefix + ctx.currentSession.shop
        );
        if (res) {
          await verifyRequest({
            returnHeader: true,
          })(ctx, next);
        } else {
          await next();
        }
      } else {
        await verifyRequest({
          returnHeader: false,
          fallbackRoute: `/auth?shop=${ctx.currentSession.shop}`,
        })(ctx, next);
      }
    } else {
      await next();
    }
  });

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Fpp.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Fpp.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );
  router.post("/delete-key", async (ctx) => {
    const data = ctx.request.body;
    const res = await sessionStorage.deleteCallback(data.shop);
    ctx.body = res;
  });

  router.get("/get-oauth-data", async (ctx) => {
    const shop = ctx.query.shop;
    const res = await sessionStorage.loadCallback(shop);
    ctx.body = res;
  });
  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    try {
      let shop = ctx.query.shop;

      if (!IS_EMBEDDED_APP) {
        if (ctx.currentSession && ctx.currentSession.id) {
          if (!shop) {
            shop = ctx.currentSession.shop;
          } else {
            if (shop !== ctx.currentSession.shop) {
              await sessionStorage.deleteCallback(shop);
            }
          }
        }
        if (!ctx.currentSession && shop) {
          await sessionStorage.deleteCallback(shop);
        }
      }
      const res = await sessionStorage.loadCallback(
        IS_EMBEDDED_APP ? embeddedPrefix + shop : shop
      );
      // This shop hasn't been seen yet, go through OAuth to create a session
      if (!res) {
        ctx.redirect(`/auth?shop=${shop}`);
      } else {
        await handleRequest(ctx);
      }
    } catch (e) {
      console.log("get * catch: ", e);
    }
  });
  server.use(router.allowedMethods());
  server.use(cookieBarRouter.routes());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
