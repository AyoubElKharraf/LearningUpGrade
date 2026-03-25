import { useEffect, useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { Reveal } from "@/components/Reveal";
import { type Course } from "@/data/courses";
import { fetchCourses } from "@/lib/api";
import { Flame, TrendingUp, Clock, BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getAuthUser, type AuthUser } from "@/lib/auth";

const statCards = [
  { label: "Courses In Progress", value: "3", icon: BookOpen, color: "bg-primary/10 text-primary" },
  { label: "Hours Learned", value: "47.5", icon: Clock, color: "bg-secondary/10 text-secondary" },
  { label: "Current Streak", value: "12 days", icon: Flame, color: "bg-destructive/10 text-destructive" },
  { label: "Weekly Goal", value: "82%", icon: TrendingUp, color: "bg-success/10 text-success" },
];

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, []);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const normalized = searchQuery.trim().toLowerCase();
  const filteredCourses = useMemo(() => {
    if (!normalized) return courses;
    return courses.filter((c) => c.title.toLowerCase().includes(normalized) || c.category.toLowerCase().includes(normalized));
  }, [courses, normalized]);

  const enrolledCount = useMemo(() => courses.filter((c) => c.progress != null).length, [courses]);
  const statValues = [
    String(enrolledCount || 0),
    "47.5",
    "12 days",
    "82%",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl py-8">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4a4a4a] px-4 py-2 text-sm font-semibold text-white shadow-sm">
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
            Dashboard
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
            {user ? `Welcome back, ${user.name} 👋` : "Welcome back 👋"}
          </h1>
          <p className="mt-2 text-muted-foreground">Here's your learning summary</p>
        </Reveal>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 60}>
              <div className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-4 shadow-card">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-xl font-bold tabular-nums">{statValues[i]}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Search */}
        <div className="mt-8">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-card">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un cours..."
              className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Courses from DB */}
        <div className="mt-12">
          <Reveal>
            <h2 className="font-display text-xl font-bold mb-5">All Courses</h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course, i) => (
              <Reveal key={course.id} delay={i * 80}>
                <CourseCard {...course} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <AIChatSidebar />
    </div>
  );
};

export default Dashboard;
