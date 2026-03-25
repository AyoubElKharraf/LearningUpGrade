import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type AuthUser, getAuthToken, getAuthUser } from "@/lib/auth";

type LessonType = "video" | "quiz";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

type LessonDetails = {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  videoUrl?: string | null;
  completed: boolean | number;
  type: string;
  position: number;
};

type LessonDetailsResponse = { lesson: LessonDetails };

const AdminLessonEditPage = () => {
  const { lessonId } = useParams();
  const user = useMemo(() => getAuthUser(), []);
  const token = getAuthToken();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  const [form, setForm] = useState<{
    id: string;
    course_id: string;
    title: string;
    duration: string;
    video_url: string;
    completed: boolean;
    type: LessonType;
    position: number;
  }>({
    id: "",
    course_id: "",
    title: "",
    duration: "",
    video_url: "",
    completed: false,
    type: "video",
    position: 1,
  });

  useEffect(() => {
    if (!token || !user || (user as AuthUser).role !== "admin") return;
    if (!lessonId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [coursesRes, lessonRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/courses`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/admin/lessons/${encodeURIComponent(lessonId)}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (!coursesRes.ok || !lessonRes.ok) {
          const text = await (coursesRes.ok ? lessonRes.text() : coursesRes.text()).catch(() => "");
          throw new Error(text || `Request failed`);
        }

        const coursesData = (await coursesRes.json()) as { courses: Array<{ id: string; title: string }> };
        const lessonData = (await lessonRes.json()) as LessonDetailsResponse;

        const l = lessonData.lesson;
        if (cancelled) return;

        setCourses(coursesData.courses.map((c) => ({ id: c.id, title: c.title })));
        setForm({
          id: l.id,
          course_id: l.courseId,
          title: l.title || "",
          duration: l.duration || "",
          video_url: l.videoUrl || "",
          completed: Boolean(l.completed),
          type: (l.type as LessonType) || "video",
          position: Number(l.position || 1),
        });
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Erreur chargement lesson");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId, token, user]);

  async function submit() {
    if (!token || !lessonId) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        course_id: form.course_id,
        title: form.title.trim(),
        duration: form.duration.trim(),
        video_url: form.video_url.trim(),
        completed: Boolean(form.completed),
        type: form.type,
        position: Number(form.position || 0),
      };

      const res = await fetch(`${API_BASE_URL}/admin/lessons/${encodeURIComponent(lessonId)}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }
      navigate("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur sauvegarde lesson");
    } finally {
      setSaving(false);
    }
  }

  const uploadVideoFile = async (file: File) => {
    if (!token) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch(`${API_BASE_URL}/admin/uploads/video`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Upload failed: ${res.status}`);
      }
      const data = (await res.json()) as { file: { url: string } };
      const publicBase = API_BASE_URL.replace(/\/api\/?$/, "");
      const finalUrl = data.file.url.startsWith("http") ? data.file.url : `${publicBase}${data.file.url}`;
      setForm((d) => ({ ...d, video_url: finalUrl }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload video");
    } finally {
      setUploading(false);
    }
  };

  if (!token || !user || (user as AuthUser).role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Admin</h1>
          <p className="mt-2 text-muted-foreground">Connexion admin requise.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold">Modifier la lesson</h1>
            <p className="mt-1 text-sm text-muted-foreground">Change toutes les infos disponibles.</p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/admin">Retour admin</Link>
          </Button>
        </div>

        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center text-muted-foreground">Chargement...</div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">ID</label>
                <Input value={form.id} disabled className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-semibold">Course</label>
                <select
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.course_id}
                  onChange={(e) => setForm((d) => ({ ...d, course_id: e.target.value }))}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Titre</label>
                <Input value={form.title} onChange={(e) => setForm((d) => ({ ...d, title: e.target.value }))} className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-semibold">Durée</label>
                <Input value={form.duration} onChange={(e) => setForm((d) => ({ ...d, duration: e.target.value }))} className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-semibold">Video URL / Path</label>
                <Input
                  value={form.video_url}
                  onChange={(e) => setForm((d) => ({ ...d, video_url: e.target.value }))}
                  className="mt-2"
                  placeholder="ex: /videos/lesson1.mp4 ou https://..."
                />
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadVideoFile(file).catch(() => {});
                      e.currentTarget.value = "";
                    }}
                    disabled={uploading}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{uploading ? "Upload en cours..." : "Tu peux charger une video depuis ton PC."}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Position</label>
                <Input
                  type="number"
                  value={form.position}
                  onChange={(e) => setForm((d) => ({ ...d, position: Number(e.target.value || 0) }))}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Type</label>
                <select
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm((d) => ({ ...d, type: e.target.value as LessonType }))}
                >
                  <option value="video">video</option>
                  <option value="quiz">quiz</option>
                </select>
              </div>

              <div className="sm:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.completed}
                  onChange={(e) => setForm((d) => ({ ...d, completed: e.target.checked }))}
                />
                <span className="text-sm font-semibold">Completed</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button type="button" onClick={submit} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
              <Button type="button" variant="secondary" asChild>
                <Link to="/admin">Annuler</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLessonEditPage;

