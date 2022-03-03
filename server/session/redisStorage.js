import { createClient } from "redis";

class RedisStore {
  constructor() {
    console.log();
    this.client = createClient({
      url:
        process.env.NODE_ENV === "development"
          ? "redis://localhost:6379"
          : "redis://10.61.177.35:6379/0",
    });
    this.client.on("error", (err) => console.log("Redis Client Error", err));
    this.client.connect();
  }
  async storeCallback(session) {
    try {
      console.log(session);
      await this.client.set(session.id, JSON.stringify(session));
      return await this.client.expire(session.id, 60 * 60 * 24 * 30);
    } catch (err) {
      throw new Error(err);
    }
  }
  async loadCallback(id) {
    try {
      let reply = await this.client.get(id);
      if (reply) {
        return JSON.parse(reply);
      } else {
        return undefined;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  async deleteCallback(id) {
    try {
      return await this.client.del(id);
    } catch (err) {
      throw new Error(err);
    }
  }
}
export default RedisStore;
