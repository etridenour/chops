import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";
import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;

app.use(
  cors({
    origin: [
      process.env.WEB_URL || "http://localhost:3000",
      ...(process.env.MOBILE_URL ? [process.env.MOBILE_URL] : []),
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/health", healthRouter);
app.use("/auth", authRouter);

// Error handling (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[api] Server running on http://localhost:${PORT}`);
});
