import { pool } from "../db.js";

function toBoolean(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  return String(v).toLowerCase() === "true" || String(v) === "1";
}

async function syncLessonsCount(courseId) {
  const [rows] = await pool.query("SELECT COUNT(*) AS cnt FROM lessons WHERE course_id = ?", [courseId]);
  const lessonsCount = Number(rows[0]?.cnt ?? 0);
  await pool.query("UPDATE courses SET lessons_count = ? WHERE id = ?", [lessonsCount, courseId]);
}

export async function listCourses() {
  const [rows] = await pool.query(
    `SELECT id, title, description, image, category, lessons_count AS lessonsCount, duration, rating, students, progress, color
     FROM courses
     ORDER BY title`,
  );
  return rows;
}

export async function getCourseById(courseId) {
  const [rows] = await pool.query(
    `SELECT id, title, description, image, category, lessons_count AS lessonsCount, duration, rating, students, progress, color
     FROM courses
     WHERE id = ?
     LIMIT 1`,
    [courseId],
  );
  if (!rows[0]) return null;
  return rows[0];
}

export async function createCourse(course) {
  const {
    id,
    title,
    description,
    image,
    category,
    lessons_count,
    duration,
    rating,
    students,
    progress,
    color,
  } = course || {};

  await pool.query(
    `INSERT INTO courses
      (id, title, description, image, category, lessons_count, duration, rating, students, progress, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      title,
      description,
      image,
      category,
      lessons_count,
      duration,
      rating,
      students,
      progress ?? null,
      color,
    ],
  );
  return { id };
}

export async function updateCourse(courseId, course) {
  const {
    title,
    description,
    image,
    category,
    lessons_count,
    duration,
    rating,
    students,
    progress,
    color,
  } = course || {};

  await pool.query(
    `UPDATE courses
     SET title = ?, description = ?, image = ?, category = ?, lessons_count = ?, duration = ?, rating = ?, students = ?, progress = ?, color = ?
     WHERE id = ?`,
    [title, description, image, category, lessons_count, duration, rating, students, progress ?? null, color, courseId],
  );
  return { id: courseId };
}

export async function deleteCourse(courseId) {
  await pool.query("DELETE FROM courses WHERE id = ?", [courseId]);
  return { id: courseId };
}

export async function listLessonsByCourseId(courseId) {
  const [rows] = await pool.query(
    `SELECT id, title, duration, video_url AS videoUrl, completed, type, position
     FROM lessons
     WHERE course_id = ?
     ORDER BY position`,
    [courseId],
  );
  return rows.map((r) => ({
    ...r,
    completed: Boolean(r.completed),
  }));
}

export async function createLesson({ courseId, lesson }) {
  const { id, title, duration, video_url, completed, type, position } = lesson || {};

  await pool.query(
    `INSERT INTO lessons (id, course_id, title, duration, video_url, completed, type, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, courseId, title, duration, video_url || null, toBoolean(completed) ? 1 : 0, type, position],
  );
  await syncLessonsCount(courseId);
  return { id };
}

export async function updateLesson(lessonId, lesson) {
  const { title, duration, video_url, completed, type, position, course_id } = lesson || {};

  // Keep old course_id so we can re-sync lesson counts correctly.
  const [oldRows] = await pool.query("SELECT course_id FROM lessons WHERE id = ? LIMIT 1", [lessonId]);
  const oldCourseId = oldRows[0]?.course_id;
  const newCourseId = course_id ?? oldCourseId;

  await pool.query(
    `UPDATE lessons
     SET course_id = ?, title = ?, duration = ?, video_url = ?, completed = ?, type = ?, position = ?
     WHERE id = ?`,
    [newCourseId, title, duration, video_url || null, toBoolean(completed) ? 1 : 0, type, position, lessonId],
  );

  if (oldCourseId) await syncLessonsCount(oldCourseId);
  if (newCourseId && newCourseId !== oldCourseId) await syncLessonsCount(newCourseId);

  return { id: lessonId };
}

export async function getLessonById(lessonId) {
  const [rows] = await pool.query(
    `SELECT id, course_id AS courseId, title, duration, video_url AS videoUrl, completed, type, position
     FROM lessons
     WHERE id = ?
     LIMIT 1`,
    [lessonId],
  );
  if (!rows[0]) return null;
  return { ...rows[0], completed: Boolean(rows[0].completed) };
}

export async function deleteLesson(lessonId) {
  // Derive course_id before deleting for lessons_count sync.
  const [rows] = await pool.query("SELECT course_id FROM lessons WHERE id = ? LIMIT 1", [lessonId]);
  const courseId = rows[0]?.course_id;

  await pool.query("DELETE FROM lessons WHERE id = ?", [lessonId]);
  if (courseId) await syncLessonsCount(courseId);
  return { id: lessonId };
}

