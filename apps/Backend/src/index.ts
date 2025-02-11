import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./Routes/auth.route"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// console.log(PORT)

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Test Route
app.get("/", (req, res) => {
  res.send("Hello from Express Backend!");
});

app.use("/api/auth", auth)

// Start Server
export default app;
