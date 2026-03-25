// In-memory analytics for course views and client engagement.
// This resets when the backend restarts (fine for a learning project).

function toUTCDateKey(ts = Date.now()) {
  const d = new Date(ts);
  // YYYY-MM-DD in UTC
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

// courseId -> total view count
const courseTotalViews = new Map(); // courseId => number

// courseId -> Set(userId)
const courseUniqueUsers = new Map(); // courseId => Set

// courseId -> dayKey => count
const courseDailyViews = new Map(); // courseId => Map(dayKey => count)

// userId -> courseId -> { views, firstViewedAt, lastViewedAt }
const userCourseViews = new Map(); // userId => Map(courseId => {...})

function getOrCreateCourseMaps(courseId) {
  if (!courseTotalViews.has(courseId)) courseTotalViews.set(courseId, 0);
  if (!courseUniqueUsers.has(courseId)) courseUniqueUsers.set(courseId, new Set());
  if (!courseDailyViews.has(courseId)) courseDailyViews.set(courseId, new Map());
}

export function recordCourseView({ courseId, userId, timestamp } = {}) {
  if (!courseId || !userId) return;
  const ts = timestamp ?? Date.now();
  const dayKey = toUTCDateKey(ts);

  getOrCreateCourseMaps(courseId);

  // total views
  courseTotalViews.set(courseId, (courseTotalViews.get(courseId) ?? 0) + 1);

  // unique users
  courseUniqueUsers.get(courseId).add(userId);

  // daily views
  const daily = courseDailyViews.get(courseId);
  daily.set(dayKey, (daily.get(dayKey) ?? 0) + 1);

  // user-course engagement
  if (!userCourseViews.has(userId)) userCourseViews.set(userId, new Map());
  const byCourse = userCourseViews.get(userId);

  if (!byCourse.has(courseId)) {
    byCourse.set(courseId, { views: 0, firstViewedAt: ts, lastViewedAt: ts });
  }

  const entry = byCourse.get(courseId);
  entry.views += 1;
  entry.lastViewedAt = ts;
}

export function resetCourseViews() {
  courseTotalViews.clear();
  courseUniqueUsers.clear();
  courseDailyViews.clear();
  userCourseViews.clear();
}

export function getTopCoursesByViews({ limit = 8 } = {}) {
  const courses = Array.from(courseTotalViews.entries()).map(([courseId, views]) => {
    const uniqueUsers = courseUniqueUsers.get(courseId)?.size ?? 0;
    return { id: courseId, views, uniqueUsers };
  });

  courses.sort((a, b) => b.views - a.views);
  return courses.slice(0, limit);
}

export function getCourseSeriesByDays({ courseId, days = 7 } = {}) {
  const daily = courseDailyViews.get(courseId);
  if (!daily) return [];

  const now = Date.now();
  const series = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const ts = now - i * 24 * 60 * 60 * 1000;
    const dayKey = toUTCDateKey(ts);
    series.push({ day: dayKey, views: daily.get(dayKey) ?? 0 });
  }
  return series;
}

export function getClientCourseViews({ userId } = {}) {
  if (!userId) return [];
  const byCourse = userCourseViews.get(userId);
  if (!byCourse) return [];

  const rows = Array.from(byCourse.entries()).map(([courseId, v]) => ({
    courseId,
    views: v.views,
    firstViewedAt: v.firstViewedAt,
    lastViewedAt: v.lastViewedAt,
  }));

  rows.sort((a, b) => b.views - a.views);
  return rows;
}

export function getClientEngagementSummary({ userId } = {}) {
  const byCourse = userCourseViews.get(userId);
  if (!byCourse) {
    return { uniqueCourses: 0, totalViews: 0 };
  }

  let uniqueCourses = 0;
  let totalViews = 0;
  for (const v of byCourse.values()) {
    uniqueCourses += 1;
    totalViews += v.views;
  }
  return { uniqueCourses, totalViews };
}

