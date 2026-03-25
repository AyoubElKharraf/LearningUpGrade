import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type AuthUser, getAuthToken, getAuthUser } from "@/lib/auth";

function parseNullableNumber(s: string): number | null {
  const v = s.trim();
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return n;
}

type CourseForm = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  lessons_count: number;
  duration: string;
  rating: number;
  students: number;
  progress: string;
  color: string;
};

type CourseDetails = {
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const AdminCourseEditPage = () => {
  const { courseId } = useParams();
  const user = useMemo(() => getAuthUser(), []);
  const token = getAuthToken();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CourseForm>({
    id: courseId || "",
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

  useEffect(() => {
    if (!token || !user || (user as AuthUser).role !== "admin") return;
    if (!courseId) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/admin/courses/${encodeURIComponent(courseId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Request failed: ${res.status}`);
        }
        const data = (await res.json()) as { course: CourseDetails };
        const c = data.course;
        if (cancelled) return;
        setForm({
          id: c.id,
          title: c.title || "",
          description: c.description || "",
          image: c.image || "",
          category: c.category || "",
          lessons_count: Number(c.lessonsCount || 0),
          duration: c.duration || "",
          rating: Number(c.rating || 0),
          students: Number(c.students || 0),
          progress: c.progress == null ? "" : String(c.progress),
          color: c.color || "",
        });
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Erreur chargement cours");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user, courseId]);

  async function submit() {
    if (!token || !courseId) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        category: form.category.trim(),
        lessons_count: Number(form.lessons_count || 0),
        duration: form.duration.trim(),
        rating: Number(form.rating || 0),
        students: Number(form.students || 0),
        progress: parseNullableNumber(form.progress),
        color: form.color.trim(),
      };

      const res = await fetch(`${API_BASE_URL}/admin/courses/${encodeURIComponent(courseId)}`, {
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
      setError(e instanceof Error ? e.message : "Erreur sauvegarde cours");
    } finally {
      setSaving(false);
    }
  }

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
            <h1 className="font-display text-3xl font-bold">Modifier le cours</h1>
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
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">ID</label>
                <Input value={form.id} disabled className="mt-2" />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold">Catégorie</label>
                <Input value={form.category} onChange={(e) => setForm((d) => ({ ...d, category: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Titre</label>
                <Input value={form.title} onChange={(e) => setForm((d) => ({ ...d, title: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm((d) => ({ ...d, description: e.target.value }))} className="mt-2" />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm font-semibold">Image (URL)</label>
                <Input value={form.image} onChange={(e) => setForm((d) => ({ ...d, image: e.target.value }))} className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-semibold">Durée</label>
                <Input value={form.duration} onChange={(e) => setForm((d) => ({ ...d, duration: e.target.value }))} className="mt-2" />
              </div>

              <div>
                <label className="text-sm font-semibold">Leçons count</label>
                <Input
                  type="number"
                  value={form.lessons_count}
                  onChange={(e) => setForm((d) => ({ ...d, lessons_count: Number(e.target.value || 0) }))}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => setForm((d) => ({ ...d, rating: Number(e.target.value || 0) }))}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Students</label>
                <Input
                  type="number"
                  value={form.students}
                  onChange={(e) => setForm((d) => ({ ...d, students: Number(e.target.value || 0) }))}
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Progress (%)</label>
                <Input
                  value={form.progress}
                  onChange={(e) => setForm((d) => ({ ...d, progress: e.target.value }))}
                  className="mt-2"
                  placeholder="vide = NULL"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Color</label>
                <Input value={form.color} onChange={(e) => setForm((d) => ({ ...d, color: e.target.value }))} className="mt-2" />
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

export default AdminCourseEditPage;

