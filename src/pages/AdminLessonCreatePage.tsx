import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type AuthUser, getAuthToken, getAuthUser } from "@/lib/auth";

type LessonType = "video" | "quiz" | "reading";

type LessonPayload = {
  id: string;
  title: string;
  duration: string;
  video_url: string;
  completed: boolean;
  type: LessonType;
  position: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const AdminLessonCreatePage = () => {
  const { courseId } = useParams();
  const user = useMemo(() => getAuthUser(), []);
  const token = getAuthToken();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState<LessonPayload>({
    id: `l-${Date.now()}`,
    title: "",
    duration: "",
    video_url: "",
    completed: false,
    type: "video",
    position: 1,
  });

  useEffect(() => {
    if (!token || !user || (user as AuthUser).role !== "admin") {
      setLoading(false);
      return;
    }
    setLoading(false);
  }, [token, user]);

  const submit = async () => {
    if (!token || !courseId) return;
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...draft,
      };

      const res = await fetch(`${API_BASE_URL}/admin/courses/${encodeURIComponent(courseId)}/lessons`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status}`);
      }
      await res.json().catch(() => ({}));
      navigate("/admin");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur création lesson");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !courseId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!token || !user || (user as AuthUser).role !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-3xl font-bold">Admin</h1>
          <p className="mt-2 text-muted-foreground">{error || "Connexion admin requise."}</p>
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
            <h1 className="font-display text-3xl font-bold">Nouvelle lesson</h1>
            <p className="mt-1 text-sm text-muted-foreground">Course : {courseId}</p>
          </div>
          <Button variant="secondary" asChild>
            <Link to="/admin">Retour admin</Link>
          </Button>
        </div>

        {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">ID</label>
              <Input value={draft.id} onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))} className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold">Position</label>
              <Input
                type="number"
                value={draft.position}
                onChange={(e) => setDraft((d) => ({ ...d, position: Number(e.target.value || 0) }))}
                className="mt-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold">Titre</label>
              <Input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold">Durée</label>
              <Input value={draft.duration} onChange={(e) => setDraft((d) => ({ ...d, duration: e.target.value }))} className="mt-2" />
            </div>
            <div>
              <label className="text-sm font-semibold">Video URL / Path</label>
              <Input
                value={draft.video_url}
                onChange={(e) => setDraft((d) => ({ ...d, video_url: e.target.value }))}
                className="mt-2"
                placeholder="ex: /videos/lesson1.mp4 ou https://..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Type</label>
              <select
                value={draft.type}
                onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as LessonType }))}
                className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="video">video</option>
                <option value="quiz">quiz</option>
                <option value="reading">reading</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input type="checkbox" checked={draft.completed} onChange={(e) => setDraft((d) => ({ ...d, completed: e.target.checked }))} />
              <span className="text-sm font-semibold">Completed</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={submit} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Sauvegarde..." : "Créer"}
            </Button>
            <Button type="button" variant="secondary" asChild disabled={saving}>
              <Link to="/admin">Annuler</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLessonCreatePage;

