import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on(
  "error",
  (err) => console.error("Redis Client Error", err)
  // 1
);

(async () => {
  await client.connect();
})();

export default client;
