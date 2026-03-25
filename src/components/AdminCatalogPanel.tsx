import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type AdminCourseRow = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  lessonsCount: number;
  duration: string;
  rating: number;
  students: number;
  progress: number | null;
  color: string;
};

type AdminLessonRow = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "reading";
  position: number;
};

type TopResponseCourses = { courses: AdminCourseRow[] };
type TopResponseLessons = { lessons: AdminLessonRow[] };

type CourseDraft = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  lessons_count: number;
  duration: string;
  rating: number;
  students: number;
  progress: string; // nullable number as string for UX
  color: string;
};

type LessonDraft = {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "reading";
  position: number;
};

function parseNullableNumber(input: string): number | null {
  const s = input.trim();
  if (!s) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function AdminCatalogPanel({ token }: { token: string }) {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  function adminFetchJson<T>(path: string, init?: RequestInit) {
    return fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }
      return (await res.json()) as T;
    });
  }

  const [courses, setCourses] = useState<AdminCourseRow[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [courseCatalogId, setCourseCatalogId] = useState<string>("");

  const [lessons, setLessons] = useState<AdminLessonRow[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);

  const [courseFormMode, setCourseFormMode] = useState<"create" | "edit" | null>(null);
  const [courseSaving, setCourseSaving] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [courseDraft, setCourseDraft] = useState<CourseDraft>({
    id: "",
    title: "",
    description: "",
    image: "",
    category: "",
    lessons_count: 0,
    duration: "",
    rating: 4.7,
    students: 0,
    progress: "",
    color: "hsl(210 80% 55%)",
  });

  const [lessonFormMode, setLessonFormMode] = useState<"create" | "edit" | null>(null);
  const [lessonSaving, setLessonSaving] = useState(false);
  const [lessonError, setLessonError] = useState<string | null>(null);
  const [lessonDraft, setLessonDraft] = useState<LessonDraft>({
    id: "",
    title: "",
    duration: "",
    completed: false,
    type: "video",
    position: 1,
  });

  const selectedCourse = useMemo(() => courses.find((c) => c.id === courseCatalogId) || null, [courses, courseCatalogId]);

  async function refreshCourses() {
    setCoursesLoading(true);
    try {
      const data = await adminFetchJson<TopResponseCourses>("/admin/courses", { method: "GET" });
      setCourses(data.courses);
      setCourseCatalogId((prev) => prev || data.courses[0]?.id || "");
    } finally {
      setCoursesLoading(false);
    }
  }

  async function refreshLessons(courseId: string) {
    if (!courseId) return;
    setLessonsLoading(true);
    try {
      const data = await adminFetchJson<TopResponseLessons>(`/admin/courses/${encodeURIComponent(courseId)}/lessons`, { method: "GET" });
      setLessons(data.lessons);
    } finally {
      setLessonsLoading(false);
    }
  }

  useEffect(() => {
    refreshCourses().catch((e) => {
      console.error(e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    refreshLessons(courseCatalogId).catch((e) => {
      console.error(e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseCatalogId, token]);

  function resetCourseForm() {
    setCourseFormMode(null);
    setCourseError(null);
    setCourseSaving(false);
    setCourseDraft({
      id: "",
      title: "",
      description: "",
      image: "",
      category: "",
      lessons_count: 0,
      duration: "",
      rating: 4.7,
      students: 0,
      progress: "",
      color: "hsl(210 80% 55%)",
    });
  }

  function resetLessonForm() {
    setLessonFormMode(null);
    setLessonError(null);
    setLessonSaving(false);
    setLessonDraft({
      id: "",
      title: "",
      duration: "",
      completed: false,
      type: "video",
      position: 1,
    });
  }

  async function submitCourse() {
    setCourseSaving(true);
    setCourseError(null);
    try {
      const payload = {
        id: courseDraft.id.trim(),
        title: courseDraft.title.trim(),
        description: courseDraft.description.trim(),
        image: courseDraft.image.trim(),
        category: courseDraft.category.trim(),
        lessons_count: Number(courseDraft.lessons_count || 0),
        duration: courseDraft.duration.trim(),
        rating: Number(courseDraft.rating),
        students: Number(courseDraft.students || 0),
        progress: parseNullableNumber(courseDraft.progress),
        color: courseDraft.color.trim(),
      };

      if (courseFormMode === "create") {
        await adminFetchJson<{ created: { id: string } }>("/admin/courses", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetchJson<{ updated: { id: string } }>(`/admin/courses/${encodeURIComponent(payload.id)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      await refreshCourses();
      resetCourseForm();
    } catch (e) {
      setCourseError(e instanceof Error ? e.message : "Erreur cours");
    } finally {
      setCourseSaving(false);
    }
  }

  async function deleteCourse(courseId: string) {
    if (!confirm(`Supprimer le cours ${courseId} ?`)) return;
    setCourseError(null);
    try {
      await adminFetchJson(`/admin/courses/${encodeURIComponent(courseId)}`, { method: "DELETE" });
      await refreshCourses();
      if (courseCatalogId === courseId) setCourseCatalogId("");
    } catch (e) {
      setCourseError(e instanceof Error ? e.message : "Erreur suppression cours");
    }
  }

  async function submitLesson() {
    if (!courseCatalogId) return;
    setLessonSaving(true);
    setLessonError(null);
    try {
      const payload = {
        id: lessonDraft.id.trim(),
        title: lessonDraft.title.trim(),
        duration: lessonDraft.duration.trim(),
        completed: Boolean(lessonDraft.completed),
        type: lessonDraft.type,
        position: Number(lessonDraft.position || 0),
        course_id: courseCatalogId,
      };

      if (lessonFormMode === "create") {
        await adminFetchJson(`/admin/courses/${encodeURIComponent(courseCatalogId)}/lessons`, {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetchJson(`/admin/lessons/${encodeURIComponent(payload.id)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      }

      await refreshLessons(courseCatalogId);
      resetLessonForm();
    } catch (e) {
      setLessonError(e instanceof Error ? e.message : "Erreur lesson");
    } finally {
      setLessonSaving(false);
    }
  }

  async function deleteLesson(lessonId: string) {
    if (!confirm(`Supprimer la lesson ${lessonId} ?`)) return;
    setLessonError(null);
    try {
      await adminFetchJson(`/admin/lessons/${encodeURIComponent(lessonId)}`, { method: "DELETE" });
      await refreshLessons(courseCatalogId);
      if (lessonDraft.id === lessonId) resetLessonForm();
    } catch (e) {
      setLessonError(e instanceof Error ? e.message : "Erreur suppression lesson");
    }
  }

  return (
    <div className="mt-0 grid gap-6">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Courses CRUD</h2>
            <p className="mt-1 text-sm text-muted-foreground">Créer / modifier / supprimer des cours.</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setCourseFormMode(null);
              setLessonFormMode(null);
              navigate("/admin/catalog/courses/new");
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="mt-4">
          {coursesLoading ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">Chargement…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Cat.</TableHead>
                  <TableHead>Leçons</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCourseCatalogId(c.id)}
                          className={`truncate text-sm font-semibold hover:underline ${
                            c.id === courseCatalogId ? "text-primary" : "text-foreground"
                          }`}
                          title="Sélectionner pour gérer les lessons"
                        >
                          {c.title}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{c.category}</TableCell>
                    <TableCell>{c.lessonsCount}</TableCell>
                    <TableCell>{c.progress == null ? "-" : `${c.progress}%`}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCourseFormMode(null);
                            setLessonFormMode(null);
                            navigate(`/admin/catalog/courses/${encodeURIComponent(c.id)}`);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteCourse(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {courseFormMode ? (
          <div className="mt-6 rounded-xl border border-border bg-muted/10 p-4">
            <h3 className="font-display text-md font-bold">{courseFormMode === "create" ? "Nouveau cours" : "Modifier le cours"}</h3>
            {courseError ? <p className="mt-2 text-sm text-destructive">{courseError}</p> : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {courseFormMode === "create" ? (
                <div className="sm:col-span-1">
                  <label className="text-sm font-semibold">ID</label>
                  <Input value={courseDraft.id} onChange={(e) => setCourseDraft((d) => ({ ...d, id: e.target.value }))} className="mt-2" />
                </div>
              ) : (
                <div className="sm:col-span-1">
                  <label className="text-sm font-semibold">ID</label>
                  <Input value={courseDraft.id} disabled className="mt-2" />
                </div>
              )}

              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">Catégorie</label>
                <Input value={courseDraft.category} onChange={(e) => setCourseDraft((d) => ({ ...d, category: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Titre</label>
                <Input value={courseDraft.title} onChange={(e) => setCourseDraft((d) => ({ ...d, title: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Description</label>
                <Textarea value={courseDraft.description} onChange={(e) => setCourseDraft((d) => ({ ...d, description: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Image (URL)</label>
                <Input value={courseDraft.image} onChange={(e) => setCourseDraft((d) => ({ ...d, image: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">Durée</label>
                <Input value={courseDraft.duration} onChange={(e) => setCourseDraft((d) => ({ ...d, duration: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">Couleur (color)</label>
                <Input value={courseDraft.color} onChange={(e) => setCourseDraft((d) => ({ ...d, color: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">Leçons count</label>
                <Input
                  type="number"
                  value={courseDraft.lessons_count}
                  onChange={(e) => setCourseDraft((d) => ({ ...d, lessons_count: Number(e.target.value || 0) }))}
                  className="mt-2"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">Students</label>
                <Input
                  type="number"
                  value={courseDraft.students}
                  onChange={(e) => setCourseDraft((d) => ({ ...d, students: Number(e.target.value || 0) }))}
                  className="mt-2"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  value={courseDraft.rating}
                  onChange={(e) => setCourseDraft((d) => ({ ...d, rating: Number(e.target.value || 0) }))}
                  className="mt-2"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">Progress (%) (vide = NULL)</label>
                <Input value={courseDraft.progress} onChange={(e) => setCourseDraft((d) => ({ ...d, progress: e.target.value }))} className="mt-2" />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" onClick={submitCourse} disabled={courseSaving}>
                {courseSaving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetCourseForm} disabled={courseSaving}>
                Annuler
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold">Lessons CRUD</h2>
            <p className="mt-1 text-sm text-muted-foreground">Gérer les leçons du cours sélectionné.</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              if (!courseCatalogId) return;
              setCourseFormMode(null);
              setLessonFormMode(null);
              navigate(`/admin/catalog/courses/${encodeURIComponent(courseCatalogId)}/lessons/new`);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold">Cours</label>
            <select
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={courseCatalogId}
              onChange={(e) => setCourseCatalogId(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {selectedCourse ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {selectedCourse.category} • {selectedCourse.lessonsCount} lessons (count)
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4">
          {lessonsLoading ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">Chargement…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs">{l.id}</TableCell>
                    <TableCell>{l.position}</TableCell>
                    <TableCell>{l.title}</TableCell>
                    <TableCell className="capitalize">{l.type}</TableCell>
                    <TableCell>{l.duration}</TableCell>
                    <TableCell>{l.completed ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCourseFormMode(null);
                            setLessonFormMode(null);
                            navigate(`/admin/catalog/lessons/${encodeURIComponent(l.id)}`);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteLesson(l.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {lessonFormMode ? (
          <div className="mt-6 rounded-xl border border-border bg-muted/10 p-4">
            <h3 className="font-display text-md font-bold">
              {lessonFormMode === "create" ? "Nouvelle lesson" : "Modifier la lesson"}
            </h3>
            {lessonError ? <p className="mt-2 text-sm text-destructive">{lessonError}</p> : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {lessonFormMode === "create" ? (
                <div>
                  <label className="text-sm font-semibold">ID</label>
                  <Input value={lessonDraft.id} onChange={(e) => setLessonDraft((d) => ({ ...d, id: e.target.value }))} className="mt-2" />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold">ID</label>
                  <Input value={lessonDraft.id} disabled className="mt-2" />
                </div>
              )}

              <div>
                <label className="text-sm font-semibold">Position</label>
                <Input
                  type="number"
                  value={lessonDraft.position}
                  onChange={(e) => setLessonDraft((d) => ({ ...d, position: Number(e.target.value || 0) }))}
                  className="mt-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Titre</label>
                <Input value={lessonDraft.title} onChange={(e) => setLessonDraft((d) => ({ ...d, title: e.target.value }))} className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-semibold">Durée</label>
                <Input value={lessonDraft.duration} onChange={(e) => setLessonDraft((d) => ({ ...d, duration: e.target.value }))} className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-semibold">Type</label>
                <select
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={lessonDraft.type}
                  onChange={(e) => setLessonDraft((d) => ({ ...d, type: e.target.value as LessonDraft["type"] }))}
                >
                  <option value="video">video</option>
                  <option value="quiz">quiz</option>
                  <option value="reading">reading</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lessonDraft.completed}
                  onChange={(e) => setLessonDraft((d) => ({ ...d, completed: e.target.checked }))}
                />
                <label className="text-sm font-semibold">Completed</label>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" onClick={submitLesson} disabled={lessonSaving}>
                {lessonSaving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetLessonForm} disabled={lessonSaving}>
                Annuler
              </Button>
            </div>
          </div>
        ) : null}

        <div className="mt-4 text-xs text-muted-foreground">
          Astuce : après création/modif de lessons, le backend met à jour automatiquement `courses.lessons_count`.
        </div>
      </div>
    </div>
  );
}

