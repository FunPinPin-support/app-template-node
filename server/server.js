import "@babel/polyfill";
import semver from "semver";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createFppAuth, { verifyRequest } from "koa-fpp-auth";
import Fpp, { ApiVersion } from "fpp-node-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import koaBody from "koa-body";
import customerRouter from "./routes";
import koaStatic from "koa-static";
import path from "path";
const { engines } = require("../package.json");
if (!semver.satisfies(process.version, engines.node)) {
  console.log(
    `Required node version ${engines.node}, but got ${process.version}`
  );
  process.exit(1);
}

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});

const handle = app.getRequestHandler();

Fpp.Context.initialize({
  API_KEY: process.env.FPP_API_KEY,
  API_SECRET_KEY: process.env.FPP_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.February22,
  IS_EMBEDDED_APP: false,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Fpp.Session.MemorySessionStorage(),
});
// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Fpp.Context.API_SECRET_KEY];
  server.use(
    createFppAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.fpp
        const { shop, accessToken, scope } = ctx.state.fpp;
        console.log("token", shop, accessToken);
        const host = ctx.query.host;
        const scriptSrc = `${process.env.HOST}together-buy.js`;
        ACTIVE_SHOPS[shop] = scope;

        try {
          const data = {
            script_tag: {
              event: "onload",
              src: scriptSrc,
            },
          };
        } catch (e) {
          console.log("scriptTagError", e);
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );
  server.use(koaBody());
  server.use(koaStatic(path.join(__dirname, "../public")));
  server.use(async (ctx, next) => {
    const currentSession = await Fpp.Utils.loadCurrentSession(ctx.req, ctx.res);
    if (currentSession) {
      ctx.currentSession = currentSession;
    }
    await next();
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

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;
    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });
  server.use(router.allowedMethods());
  server.use(customerRouter.routes());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
