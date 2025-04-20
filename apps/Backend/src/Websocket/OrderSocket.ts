import { WebSocketServer } from "ws";
import { Client } from "pg";

const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
});

export const initWebSocketServer = async (server: any) => {
  await pgClient.connect();
  console.log("✅ PostgreSQL connected");

  await pgClient.query("LISTEN new_order");
  console.log("👂 Listening for new_order events...");

  const wss = new WebSocketServer({ server });

  console.log("🚀 WebSocket server is running");

  pgClient.on("notification", (msg) => {
    const data = JSON.parse(msg.payload || "{}");

    console.log("📦 New order:", data);

    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({ type: "Order_Placed", data }));
      }
    });
  });

  wss.on("connection", (ws) => {
    console.log("🔌 Client connected to WebSocket");

    ws.on("close", () => {
      console.log("❌ Client disconnected");
    });
  });
};
