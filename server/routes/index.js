import Router from "koa-router";
import { getSetting } from "../api";

const router = new Router();

router.get("/setting", async (ctx) => {
  const data = await getSetting(ctx);
  ctx.body = data;
});

export default router;
