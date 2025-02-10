import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

// Start Server
export default app;
