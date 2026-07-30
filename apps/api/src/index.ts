import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { tasksRouter } from "./routes/tasks.js";
import { progressRouter } from "./routes/progress.js";
import { jobsRouter } from "./routes/jobs.js";
import { reviewsRouter } from "./routes/reviews.js";
import { roadmapRouter } from "./routes/roadmap.js";
import { systemRouter } from "./routes/system.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, "../../../.env");
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../../../.env.example") });
}

const app = express();
const port = Number(process.env.API_PORT ?? 4070);
const origin = process.env.WEB_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "gyam-api" });
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/progress", progressRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/roadmap", roadmapRouter);
app.use("/api/system", systemRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`GYAM API listening on http://localhost:${port}`);
});
