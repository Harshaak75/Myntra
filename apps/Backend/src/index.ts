import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import auth from "./Routes/auth.route";

import cookieParser from "cookie-parser";
import userRouter from "./Routes/user.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser())

// console.log(PORT)

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.send("Hello from Express Backend!");
});

app.use("/userAuth", auth);
app.use("/user",userRouter);

// Start Server
export default app;
