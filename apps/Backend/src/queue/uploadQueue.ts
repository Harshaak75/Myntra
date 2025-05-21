// queues/uploadQueue.ts
import { Queue } from "bullmq";
import Redis from "ioredis";
import { redis_url } from "../config";

const redis = new Redis(redis_url || "", {
  maxRetriesPerRequest: null,
});

export const uploadQueue = new Queue("upload-queue", {
  connection: redis,
});
