import { Router } from "express";
import {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  listLessonsByCourseId,
  createLesson,
  updateLesson,
  deleteLesson,
  getLessonById,
} from "../services/adminCatalog.service.js";
import { requireAdmin } from "../utils/adminAuth.js";

const adminCatalogRouter = Router();

adminCatalogRouter.get("/courses", requireAdmin, async (_req, res, next) => {
  try {
    const courses = await listCourses();
    res.json({ courses });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.post("/courses", requireAdmin, async (req, res, next) => {
  try {
    const created = await createCourse(req.body);
    res.status(201).json({ created });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.put("/courses/:courseId", requireAdmin, async (req, res, next) => {
  try {
    const updated = await updateCourse(req.params.courseId, req.body);
    res.json({ updated });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.delete("/courses/:courseId", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await deleteCourse(req.params.courseId);
    res.json({ deleted });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.get("/courses/:courseId/lessons", requireAdmin, async (req, res, next) => {
  try {
    const lessons = await listLessonsByCourseId(req.params.courseId);
    res.json({ lessons });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.get("/courses/:courseId", requireAdmin, async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ course });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.post("/courses/:courseId/lessons", requireAdmin, async (req, res, next) => {
  try {
    const created = await createLesson({ courseId: req.params.courseId, lesson: req.body });
    res.status(201).json({ created });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.put("/lessons/:lessonId", requireAdmin, async (req, res, next) => {
  try {
    const updated = await updateLesson(req.params.lessonId, req.body);
    res.json({ updated });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.delete("/lessons/:lessonId", requireAdmin, async (req, res, next) => {
  try {
    const deleted = await deleteLesson(req.params.lessonId);
    res.json({ deleted });
  } catch (error) {
    next(error);
  }
});

adminCatalogRouter.get("/lessons/:lessonId", requireAdmin, async (req, res, next) => {
  try {
    const lesson = await getLessonById(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json({ lesson });
  } catch (error) {
    next(error);
  }
});

export { adminCatalogRouter };

