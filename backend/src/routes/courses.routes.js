import { Router } from "express";
import {
  getCourseById,
  getCourses,
  getLessonById,
  getQuizQuestions,
} from "../services/courses.service.js";
import { recordCourseView } from "../services/courseViews.service.js";

export const coursesRouter = Router();

coursesRouter.get("/courses", async (_req, res, next) => {
  try {
    const courses = await getCourses();
    res.json(courses);
  } catch (error) {
    next(error);
  }
});

coursesRouter.get("/courses/:courseId", async (req, res, next) => {
  try {
    const course = await getCourseById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // Track course views for admin analytics
    const userId = req.header("x-user-id") || "";
    recordCourseView({ courseId: req.params.courseId, userId });
    res.json(course);
  } catch (error) {
    next(error);
  }
});

coursesRouter.get("/courses/:courseId/lessons/:lessonId", async (req, res, next) => {
  try {
    const lesson = await getLessonById(req.params.courseId, req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json(lesson);
  } catch (error) {
    next(error);
  }
});

coursesRouter.get("/quiz-questions", async (_req, res, next) => {
  try {
    const questions = await getQuizQuestions();
    res.json(questions);
  } catch (error) {
    next(error);
  }
});

