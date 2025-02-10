import app from ".";
import http from "http";
import { port } from "./config";

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
