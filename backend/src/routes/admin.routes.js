import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import {
  getClientCourseViews,
  getClientEngagementSummary,
  getCourseSeriesByDays,
  getTopCoursesByViews,
  resetCourseViews,
} from "../services/courseViews.service.js";

const adminRouter = Router();

function requireAdmin(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice("bearer ".length).trim();
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";

  try {
    const decoded = jwt.verify(token, secret);
    const role = decoded && typeof decoded === "object" ? decoded.role : undefined;
    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

adminRouter.get("/clients", requireAdmin, async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, email, role, name, created_at
       FROM users
       WHERE role = 'client'
       ORDER BY created_at DESC`,
    );
    res.json({ clients: rows });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/course-stats/top", requireAdmin, async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 8);
    const top = getTopCoursesByViews({ limit });

    if (top.length === 0) return res.json({ topCourses: [] });

    const ids = top.map((t) => t.id);
    const [courses] = await pool.query(`SELECT id, title FROM courses WHERE id IN (${ids.map(() => "?").join(",")})`, ids);
    const byId = new Map(courses.map((c) => [c.id, c.title]));

    res.json({
      topCourses: top.map((t) => ({
        id: t.id,
        title: byId.get(t.id) || t.id,
        views: t.views,
        uniqueUsers: t.uniqueUsers,
      })),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/course-stats/series", requireAdmin, async (req, res, next) => {
  try {
    const courseId = String(req.query.courseId || "");
    const days = Number(req.query.days || 7);
    if (!courseId) return res.status(400).json({ message: "courseId requis" });

    const series = getCourseSeriesByDays({ courseId, days });
    const [rows] = await pool.query(`SELECT id, title FROM courses WHERE id = ? LIMIT 1`, [courseId]);
    res.json({
      courseId,
      title: rows[0]?.title || courseId,
      series,
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get("/client-stats", requireAdmin, async (req, res, next) => {
  try {
    const userId = String(req.query.userId || "");
    if (!userId) return res.status(400).json({ message: "userId requis" });

    const summary = getClientEngagementSummary({ userId });
    const views = getClientCourseViews({ userId });

    const courseIds = views.map((v) => v.courseId);
    let byCourse = new Map();
    if (courseIds.length > 0) {
      const [courses] = await pool.query(
        `SELECT id, title FROM courses WHERE id IN (${courseIds.map(() => "?").join(",")})`,
        courseIds,
      );
      byCourse = new Map(courses.map((c) => [c.id, c.title]));
    }

    res.json({
      userId,
      summary,
      courses: views.map((v) => ({
        id: v.courseId,
        title: byCourse.get(v.courseId) || v.courseId,
        views: v.views,
        firstViewedAt: v.firstViewedAt,
        lastViewedAt: v.lastViewedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/course-stats/reset", requireAdmin, async (_req, res, next) => {
  try {
    resetCourseViews();
    res.json({ status: "ok" });
  } catch (error) {
    next(error);
  }
});

export { adminRouter };

