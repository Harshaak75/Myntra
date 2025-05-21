
//@ts-ignore
import Arena from "bull-arena";
import { createServer } from "http";
import { parse } from "url";

// ✅ Read and parse your Redis URL
const redisUrl = process.env.REDIS_URL!;
const parsed = parse(redisUrl);
const [username, password] = parsed.auth?.split(":") || [];

const arenaConfig = Arena(
  {
    BullMQ: require("bullmq"),
    queues: [
      {
        type: "bullmq",
        name: "upload-queue",
        hostId: "Upload Queue",
        redis: {
          host: parsed.hostname,
          port: Number(parsed.port),
          username,
          password,
        },
      },
    ],
  },
  {
    basePath: "/arena",
    disableListen: true,
  }
);

// ✅ Serve Arena
const server = createServer(arenaConfig);
server.listen(4567, () => {
  console.log("✅ Arena dashboard running at http://localhost:4567/arena");
});
