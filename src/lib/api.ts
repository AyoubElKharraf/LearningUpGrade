import { demoCourses, demoQuizQuestions, type Course, type QuizQuestion } from "@/data/courses";
import { getAuthToken, getAuthUser } from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

async function safeJsonFetch<T>(url: string): Promise<T> {
  const user = getAuthUser();
  const token = getAuthToken();
  const response = await fetch(url, {
    headers: {
      "x-user-id": user?.id || "",
      "x-user-email": user?.email || "",
      "x-user-role": user?.role || "",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchCourses(): Promise<Course[]> {
  try {
    return await safeJsonFetch<Course[]>(`${API_BASE_URL}/courses`);
  } catch (_error) {
    return demoCourses;
  }
}

export async function fetchCourseById(courseId: string): Promise<Course | null> {
  try {
    return await safeJsonFetch<Course>(`${API_BASE_URL}/courses/${courseId}`);
  } catch (_error) {
    return demoCourses.find((c) => c.id === courseId) || null;
  }
}

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    return await safeJsonFetch<QuizQuestion[]>(`${API_BASE_URL}/quiz-questions`);
  } catch (_error) {
    return demoQuizQuestions;
  }
}

