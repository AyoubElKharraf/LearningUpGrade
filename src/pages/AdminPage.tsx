import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { type AuthUser, getAuthToken, getAuthUser } from "@/lib/auth";
import { AdminCatalogPanel } from "@/components/AdminCatalogPanel";

type Client = {
  id: string;
  email: string;
  role: string;
  name: string;
  created_at: string;
};

type TopCourse = {
  id: string;
  title: string;
  views: number;
  uniqueUsers: number;
};

type SeriesPoint = {
  day: string;
  views: number;
};

type ClientCourseStat = {
  id: string;
  title: string;
  views: number;
  firstViewedAt: number;
  lastViewedAt: number;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function adminFetch<T>(token: string, path: string) {
  return fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed: ${res.status}`);
    }
    return (await res.json()) as T;
  });
}

const AdminPage = () => {
  const user = useMemo(() => getAuthUser(), []);
  const token = getAuthToken();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const [topCourses, setTopCourses] = useState<TopCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [courseSeries, setCourseSeries] = useState<SeriesPoint[]>([]);

  const [clientSummary, setClientSummary] = useState<{ uniqueCourses: number; totalViews: number } | null>(null);
  const [clientCourses, setClientCourses] = useState<ClientCourseStat[]>([]);

  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user) {
      setLoading(false);
      return;
    }
    if ((user as AuthUser).role !== "admin") {
      setLoading(false);
      setError("Acces admin requis.");
      return;
    }

    let cancelled = false;

    (async () => {
      setError(null);
      setLoading(true);
      try {
        const [{ clients: clientsRows }, top] = await Promise.all([
          adminFetch<{ clients: Client[] }>(token, `/admin/clients`),
          adminFetch<{ topCourses: TopCourse[] }>(token, `/admin/course-stats/top?limit=8`),
        ]);

        if (cancelled) return;

        setClients(clientsRows);
        setTopCourses(top.topCourses);

        const firstClient = clientsRows[0]?.id || "";
        setSelectedClientId(firstClient);

        const firstCourse = top.topCourses[0]?.id || "";
        setSelectedCourseId(firstCourse);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Erreur chargement admin");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, user]);

  useEffect(() => {
    if (!token) return;
    if (!selectedClientId) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await adminFetch<{ userId: string; summary: { uniqueCourses: number; totalViews: number }; courses: ClientCourseStat[] }>(
          token,
          `/admin/client-stats?userId=${encodeURIComponent(selectedClientId)}`,
        );
        if (cancelled) return;
        setClientSummary(data.summary);
        setClientCourses(data.courses.slice(0, 8));
      } catch {
        if (cancelled) return;
        setClientSummary(null);
        setClientCourses([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedClientId, token]);

  useEffect(() => {
    if (!token) return;
    if (!selectedCourseId) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await adminFetch<{ series: SeriesPoint[] }>(token, `/admin/course-stats/series?courseId=${encodeURIComponent(selectedCourseId)}&days=7`);
        if (cancelled) return;
        setCourseSeries(data.series);
      } catch {
        if (cancelled) return;
        setCourseSeries([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedCourseId, token]);

  const topCourseChartData = useMemo(() => {
    return topCourses.map((c) => ({ name: c.title, views: c.views }));
  }, [topCourses]);

  const selectedCourseLabel = useMemo(() => topCourses.find((c) => c.id === selectedCourseId)?.title || selectedCourseId, [topCourses, selectedCourseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-20 text-center text-muted-foreground">Chargement admin...</div>
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
          <Button className="mt-6" variant="secondary" asChild>
            <Link to="/dashboard">Retour au Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-7xl py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Gestion clients + stats d’engagement (cours les plus vus) en temps réel (mémoire).
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={resetLoading}
            onClick={async () => {
              setResetLoading(true);
              try {
                await adminFetch<{ status: "ok" }>(token, `/admin/course-stats/reset`);
                // Soft reset UI
                setTopCourses([]);
                setCourseSeries([]);
                setClientSummary(null);
                setClientCourses([]);
              } finally {
                setResetLoading(false);
              }
            }}
          >
            {resetLoading ? "Reset..." : "Reset stats (cours vues)"}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <h2 className="font-display text-lg font-bold">Clients</h2>
              <p className="mt-1 text-sm text-muted-foreground">Clique pour voir l’activité.</p>

              <div className="mt-4 space-y-2 max-h-[520px] overflow-auto pr-1">
                {clients.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                    Aucun client.
                  </div>
                ) : (
                  clients.map((c) => {
                    const active = c.id === selectedClientId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedClientId(c.id)}
                        className={`w-full rounded-xl border p-3 text-left transition-colors ${
                          active ? "border-primary/40 bg-primary/10" : "border-border bg-background hover:bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate font-semibold">{c.name}</div>
                            <div className="truncate text-xs text-muted-foreground">{c.email}</div>
                          </div>
                          <div className="text-xs font-semibold text-muted-foreground">Client</div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-card md:col-span-2">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg font-bold">Top cours les plus vus</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Bar chart (total views depuis le dernier restart).</p>
                    </div>
                    <div className="text-xs text-muted-foreground">Sélection actuelle : {selectedCourseLabel}</div>
                  </div>

                  <div className="mt-4 h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topCourseChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="views" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={36} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {topCourses.length > 1 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {topCourses.slice(0, 6).map((c) => {
                        const active = c.id === selectedCourseId;
                        return (
                          <Button
                            key={c.id}
                            type="button"
                            size="sm"
                            variant={active ? "default" : "outline"}
                            onClick={() => setSelectedCourseId(c.id)}
                          >
                            {c.title}
                          </Button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-card md:col-span-2">
                  <h2 className="font-display text-lg font-bold">Courbe vues : {selectedCourseLabel}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Derniers 7 jours (UTC).</p>
                  <div className="mt-4 h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={courseSeries}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 shadow-card md:col-span-2">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h2 className="font-display text-lg font-bold">Progression du client</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Ici : engagement via vues (cours consultés).</p>
                    </div>
                    {clientSummary ? (
                      <div className="text-right text-xs text-muted-foreground">
                        {clientSummary.uniqueCourses} cours • {clientSummary.totalViews} vues
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    {clientCourses.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                        Aucun cours vu pour ce client (depuis le dernier restart).
                      </div>
                    ) : (
                      <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={clientCourses.map((c) => ({ name: c.title, views: c.views }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis tickLine={false} axisLine={false} />
                            <Tooltip />
                            <Bar dataKey="views" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={36} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <AdminCatalogPanel token={token as string} />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

