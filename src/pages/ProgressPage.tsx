import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, BookOpen, CheckCircle2, Flame, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Navbar } from "@/components/Navbar";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { type Course } from "@/data/courses";
import { fetchCourseById, fetchCourses } from "@/lib/api";

function lessonCompletionPercent(course: Course): number {
  const lessons = course.lessons ?? [];
  if (!lessons.length) return 0;
  const done = lessons.filter((l) => l.completed).length;
  return Math.round((done / lessons.length) * 100);
}

const ProgressPage = () => {
  const [enrolled, setEnrolled] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const fetchedCourses = await fetchCourses();
      const baseEnrolled = fetchedCourses.filter((c) => c.progress != null);

      try {
        const detailed = await Promise.all(baseEnrolled.map((c) => fetchCourseById(c.id)));
        if (cancelled) return;
        setEnrolled(detailed.filter((c): c is Course => Boolean(c)));
      } catch {
        // Fallback: if lessons are missing/unavailable, keep UI working.
        if (cancelled) return;
        setEnrolled(
          baseEnrolled.map((c) => ({
            ...c,
            lessons: [] as Course["lessons"],
          })),
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo(
    () =>
      enrolled.map((c) => ({
        name: c.title.length > 18 ? `${c.title.slice(0, 16)}…` : c.title,
        fullTitle: c.title,
        percent: lessonCompletionPercent(c),
        id: c.id,
      })),
    [enrolled],
  );

  const totals = useMemo(() => {
    let lessonsTotal = 0;
    let lessonsDone = 0;
    for (const c of enrolled) {
      const lessons = c.lessons ?? [];
      lessonsTotal += lessons.length;
      lessonsDone += lessons.filter((l) => l.completed).length;
    }
    const avgProgress =
      enrolled.length === 0
        ? 0
        : Math.round(
            enrolled.reduce((acc, c) => acc + (c.progress ?? lessonCompletionPercent(c)), 0) /
              enrolled.length,
          );
    return { lessonsTotal, lessonsDone, avgProgress };
  }, [enrolled]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-5xl py-8">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#fff4ed] px-4 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-primary/10">
            <BarChart3 className="h-4 w-4 shrink-0" aria-hidden />
            Progress
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Your learning progress</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Track completion across your enrolled courses, lessons finished, and how you compare to your
            weekly goals.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={40}>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Courses in progress</p>
                  <p className="font-display text-2xl font-bold tabular-nums">{enrolled.length}</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Lessons completed</p>
                  <p className="font-display text-2xl font-bold tabular-nums">
                    {totals.lessonsDone}
                    <span className="text-base font-semibold text-muted-foreground">
                      {" "}
                      / {totals.lessonsTotal}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Average progress</p>
                  <p className="font-display text-2xl font-bold tabular-nums">{totals.avgProgress}%</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Current streak</p>
                  <p className="font-display text-2xl font-bold tabular-nums">12 days</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold">Progress by course</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Share of lessons marked complete in each enrolled course.
            </p>
            <div className="mt-6 h-[280px] w-full">
              {loading ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                  Loading…
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                  No enrolled courses yet.{" "}
                  <Button variant="link" className="px-1 text-primary" asChild>
                    <Link to="/courses">Browse courses</Link>
                  </Button>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(v) => `${v}%`}
                      width={40}
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted) / 0.35)" }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const row = payload[0].payload as (typeof chartData)[0];
                        return (
                          <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
                            <p className="font-medium">{row.fullTitle}</p>
                            <p className="text-muted-foreground">{row.percent}% lessons done</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="percent" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-10">
            <h2 className="font-display text-lg font-bold">Course breakdown</h2>
            <p className="mt-1 text-sm text-muted-foreground">Detailed completion for each course.</p>
            <ul className="mt-5 flex flex-col gap-3">
              {enrolled.length === 0 ? (
                <li className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
                  Enroll in a course from the dashboard to see progress here.
                </li>
              ) : (
                enrolled.map((course, i) => {
                  const pct = lessonCompletionPercent(course);
                  const done = (course.lessons ?? []).filter((l) => l.completed).length;
                  return (
                    <li key={course.id}>
                      <Reveal delay={i * 40}>
                        <Link
                          to={`/course/${course.id}`}
                          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold leading-tight">{course.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {done} / {(course.lessons ?? []).length} lessons · {pct}% complete
                            </p>
                          </div>
                          <div className="flex w-full flex-col gap-1 sm:max-w-xs sm:flex-none">
                            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        </Link>
                      </Reveal>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </Reveal>
      </div>

      <AIChatSidebar />
    </div>
  );
};

export default ProgressPage;
