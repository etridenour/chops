import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;

app.use(
  cors({
    origin: process.env.WEB_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/health", healthRouter);
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`[api] Server running on http://localhost:${PORT}`);
});
