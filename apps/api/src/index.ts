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
import { pmRouter } from "./routes/pm.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnv = path.resolve(__dirname, "../../../.env");
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
}

const app = express();
const port = Number(process.env.API_PORT ?? 4070);
const host = process.env.HOST ?? "0.0.0.0";
const origin = process.env.WEB_ORIGIN ?? "http://localhost:5173";
const serveWeb =
  process.env.SERVE_WEB === "true" || process.env.NODE_ENV === "production";
const webDist =
  process.env.WEB_DIST ?? path.resolve(__dirname, "../../web/dist");

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
app.use("/api/pm", pmRouter);

if (serveWeb && fs.existsSync(webDist)) {
  app.use(express.static(webDist, { index: false }));
  app.get(/^(?!\/api(?:\/|$)).*/, (_req, res) => {
    res.sendFile(path.join(webDist, "index.html"));
  });
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, host, () => {
  console.log(`GYAM API listening on http://${host}:${port}`);
  if (serveWeb && fs.existsSync(webDist)) {
    console.log(`Serving web from ${webDist}`);
  }
});
