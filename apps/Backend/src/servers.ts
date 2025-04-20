import app from ".";
import http from "http";
import { port } from "./config";
import { initWebSocketServer } from "./Websocket/OrderSocket";

const server = http.createServer(app);

// initWebSocketServer(server);

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
