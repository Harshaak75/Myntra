// // src/queues/workers/uploadWorker.ts
// import { Worker, Job } from "bullmq";
// import Redis from "ioredis";
// import { uploadWorker } from "../../jobs/uploadQueue";

// // ✅ Improved Redis connection with auto-reconnect
// const redis = new Redis(process.env.REDIS_URL || "", {
//   maxRetriesPerRequest: null,
//   reconnectOnError: (err) => {
//     console.error("🔁 Redis reconnecting on error:", err);
//     return true; // Always retry connection
//   },
//   retryStrategy: (times) => {
//     const delay = Math.min(times * 50, 2000);
//     console.warn(`🔁 Redis retry attempt #${times}, waiting ${delay}ms`);
//     return delay;
//   },
// });

// // ✅ BullMQ worker setup
// const worker = new Worker(
//   "upload-queue",
//   async (job: Job) => {
//     console.log(`📥 Processing job ${job.id}`);
//     await uploadWorker(job.data);
//   },
//   { connection: redis }
// );

// // ✅ Worker event handlers
// worker.on("completed", (job) => {
//   console.log(`✅ Job ${job.id} completed`);
// });

// worker.on("failed", (job, err) => {
//   console.error(`❌ Job ${job?.id} failed:`, err);
// });

// worker.on("error", (err) => {
//   console.error("❌ Worker-level error (will try to recover):", err);
// });

// // ✅ Global process-level crash protection
// process.on("unhandledRejection", (reason) => {
//   console.error("🧨 Unhandled Promise Rejection:", reason);
// });

// process.on("uncaughtException", (err) => {
//   console.error("💥 Uncaught Exception:", err);
// });

// src/queues/workers/uploadWorker.ts
import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import { uploadWorker } from "../../jobs/uploadQueue";

// ✅ Improved Redis connection with auto-reconnect
const redis = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null,
  reconnectOnError: (err) => {
    console.error("🔁 Redis reconnecting on error:", err);
    return true; // Always retry connection
  },
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    console.warn(`🔁 Redis retry attempt #${times}, waiting ${delay}ms`);
    return delay;
  },
});

// ✅ BullMQ worker setup
const worker = new Worker(
  "upload-queue",
  async (job: Job) => {
    console.log(`📥 Processing job ${job.id}`);
    await uploadWorker(job.data);
  },
  { connection: redis }
);

// ✅ Worker event handlers
worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

worker.on("error", (err) => {
  console.error("❌ Worker-level error (will try to recover):", err);
});

// ✅ Global process-level crash protection
process.on("unhandledRejection", (reason) => {
  console.error("🧨 Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});
