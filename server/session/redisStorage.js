import { createClient } from "redis";

class RedisStore {
  constructor() {
    let url = process.env.DEPLOY_ENV
      ? process.env.DEPLOY_ENV === "test"
        ? "redis://xxxxx"
        : "redis://xxxxxx"
      : "redis://localhost:6379";
    this.client = createClient({
      url: url,
    });
    this.client.on("error", (err) => console.log("Redis Client Error", err));
    this.client.connect();
  }

  static getInstance(name, creator, products) {
    if (!this.instance) {
      this.instance = new RedisStore(name, creator, products);
    }
    return this.instance;
  }

  async storeCallback(session) {
    try {
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
        let parsed = "";
        try {
          parsed = JSON.parse(reply);
        } catch (err) {
          parsed = reply;
        }
        return parsed;
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
