import Fpp from "fpp-node-api";
import RedisStorage from "./session/redisStorage";
import { IS_EMBEDDED_APP, embeddedPrefix } from "../config";

export const appHookHandler = () => {
  Fpp.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
    path: "/webhooks",
    webhookHandler: async (topic, shop, body) => {
      const sessionStorage = RedisStorage.getInstance();
      //清除redis 数据
      await sessionStorage.deleteCallback(
        IS_EMBEDDED_APP ? embeddedPrefix + shop : shop
      );
      console.log("APP_UNINSTALLED", topic, shop, body);
    },
  });
};
