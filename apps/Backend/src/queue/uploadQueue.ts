// queues/uploadQueue.ts
import { Queue } from "bullmq";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null,
});

export const uploadQueue = new Queue("upload-queue", {
  connection: redis,
});
