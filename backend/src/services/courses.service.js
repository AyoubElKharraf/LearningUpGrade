import { pool } from "../db.js";

const toLesson = (row) => ({
  id: row.id,
  title: row.title,
  duration: row.duration,
  videoUrl: row.video_url ?? null,
  completed: Boolean(row.completed),
  type: row.type,
});

export async function getCourses() {
  const [rows] = await pool.query(
    `SELECT id, title, description, image, category, lessons_count AS lessonsCount, duration, rating, students, progress, color
     FROM courses
     ORDER BY title`
  );
  return rows;
}

export async function getCourseById(courseId) {
  const [courses] = await pool.query(
    `SELECT id, title, description, image, category, lessons_count AS lessonsCount, duration, rating, students, progress, color
     FROM courses
     WHERE id = ?`,
    [courseId]
  );

  if (courses.length === 0) {
    return null;
  }

  const [lessonRows] = await pool.query(
    `SELECT id, title, duration, video_url, completed, type
     FROM lessons
     WHERE course_id = ?
     ORDER BY position`,
    [courseId]
  );

  return { ...courses[0], lessons: lessonRows.map(toLesson) };
}

export async function getLessonById(courseId, lessonId) {
  const [rows] = await pool.query(
    `SELECT l.id, l.title, l.duration, l.video_url, l.completed, l.type
     FROM lessons l
     WHERE l.course_id = ? AND l.id = ?`,
    [courseId, lessonId]
  );
  return rows.length ? toLesson(rows[0]) : null;
}

export async function getQuizQuestions() {
  const [rows] = await pool.query(
    `SELECT id, question, options_json AS options, correct_answer AS correctAnswer, explanation
     FROM quiz_questions
     ORDER BY id`
  );

  return rows.map((row) => ({
    ...row,
    options: JSON.parse(row.options),
  }));
}

