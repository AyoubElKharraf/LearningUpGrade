import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { pool } from "./db.js";
import { coursesRouter } from "./routes/courses.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { adminCatalogRouter } from "./routes/adminCatalog.routes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const mediaDir = process.env.MEDIA_DIR || path.resolve(process.cwd(), "media");

const userStats = new Map(); // userId -> { email, role, firstSeen, lastSeen, requestCount }

function getOrCreateUser({ userId, email, role }) {
  const now = Date.now();
  let existing = userStats.get(userId);
  if (!existing) {
    existing = {
      email: email || "unknown",
      role: role || "unknown",
      firstSeen: now,
      lastSeen: now,
      requestCount: 0,
    };
    userStats.set(userId, existing);
  }
  return existing;
}

function summarizeRoles() {
  const roles = { admin: 0, client: 0, unknown: 0 };
  for (const u of userStats.values()) {
    if (u.role === "admin") roles.admin += 1;
    else if (u.role === "client") roles.client += 1;
    else roles.unknown += 1;
  }
  return roles;
}

app.use(
  cors({
    origin: true,
    credentials: false,
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-user-email", "x-user-role"],
  }),
);

app.use(express.json());
app.use("/media", express.static(mediaDir));

// Log détaillé sur le terminal (pas côté UI)
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    let userId = req.header("x-user-id") || "anonymous";
    let email = req.header("x-user-email");
    let role = req.header("x-user-role");

    const authHeader = req.header("authorization");
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      try {
        const token = authHeader.slice("bearer ".length).trim();
        const secret = process.env.JWT_SECRET || "dev_secret_change_me";
        const decoded = jwt.verify(token, secret);
        if (decoded && typeof decoded === "object") {
          if (decoded.sub) userId = String(decoded.sub);
          if (decoded.email) email = String(decoded.email);
          if (decoded.role) role = String(decoded.role);
        }
      } catch {
        // Ignore invalid tokens; fall back to x-user headers if provided.
      }
    }

    if (userId !== "anonymous") {
      const u = getOrCreateUser({ userId, email, role });
      u.lastSeen = Date.now();
      u.requestCount += 1;
    }

    const uniqueUsers = userStats.size;
    const roles = summarizeRoles();

    console.log(
      `[API] ${new Date().toISOString()} ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms) user=${userId} role=${role || "unknown"} uniqueUsers=${uniqueUsers} admin=${roles.admin} client=${roles.client} unknown=${roles.unknown}`,
    );
  });

  next();
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok" });
  } catch (_error) {
    res.status(500).json({ status: "error", message: "Database is not reachable" });
  }
});

app.use("/api", coursesRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", adminCatalogRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

