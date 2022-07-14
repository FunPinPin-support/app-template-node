import Router from "koa-router";
import {getProductsCount} from "../api";

const router = new Router();

router.get("/products-count", async (ctx) => {
  const data = await getProductsCount(ctx);
  ctx.body = data;
});

export default router;
