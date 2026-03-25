import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  progress: string; // nullable
  color: string;
};

type AdminCourseResponse = { created: { id: string } };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const AdminCourseCreatePage = () => {
  const user = useMemo(() => getAuthUser(), []);
  const token = getAuthToken();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState<CourseDraft>({
    id: `course-${Date.now()}`,
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

  async function submit() {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        id: draft.id.trim(),
        title: draft.title.trim(),
        description: draft.description.trim(),
        image: draft.image.trim(),
        category: draft.category.trim(),
        lessons_count: Number(draft.lessons_count || 0),
        duration: draft.duration.trim(),
        rating: Number(draft.rating || 0),
        students: Number(draft.students || 0),
        progress: parseNullableNumber(draft.progress),
        color: draft.color.trim(),
      };

      const res = await fetch(`${API_BASE_URL}/admin/courses`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }
      await res.json().catch(() => ({} as AdminCourseResponse));
      navigate("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur création cours");
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
            <h1 className="font-display text-3xl font-bold">Nouveau cours</h1>
            <p className="mt-1 text-sm text-muted-foreground">Créer un cours avec toutes les infos.</p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/admin">Retour admin</Link>
          </Button>
        </div>

        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="text-sm font-semibold">ID</label>
              <Input value={draft.id} onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))} className="mt-2" />
            </div>
            <div className="sm:col-span-1">
              <label className="text-sm font-semibold">Catégorie</label>
              <Input
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                className="mt-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Titre</label>
              <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} className="mt-2" />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Description</label>
              <Textarea value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} className="mt-2" />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Image (URL)</label>
              <Input value={draft.image} onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))} className="mt-2" />
            </div>

            <div>
              <label className="text-sm font-semibold">Durée</label>
              <Input value={draft.duration} onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))} className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold">Leçons count</label>
              <Input
                type="number"
                value={draft.lessons_count}
                onChange={(e) => setDraft((d) => ({ ...d, lessons_count: Number(e.target.value || 0) }))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Rating</label>
              <Input
                type="number"
                step="0.1"
                value={draft.rating}
                onChange={(e) => setDraft((d) => ({ ...d, rating: Number(e.target.value || 0) }))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Students</label>
              <Input
                type="number"
                value={draft.students}
                onChange={(e) => setDraft((d) => ({ ...d, students: Number(e.target.value || 0) }))}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Progress (%)</label>
              <Input value={draft.progress} onChange={(e) => setDraft((d) => ({ ...d, progress: e.target.value }))} className="mt-2" placeholder="vide = NULL" />
            </div>
            <div>
              <label className="text-sm font-semibold">Color</label>
              <Input value={draft.color} onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))} className="mt-2" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={submit} disabled={saving} className="gap-2">
              <Save className="h-4 w-4" />
              {saving ? "Création..." : "Créer"}
            </Button>
            <Button type="button" variant="secondary" asChild>
              <Link to="/admin">Annuler</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseCreatePage;

