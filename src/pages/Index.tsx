import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Brain, Zap, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/CourseCard";
import { Navbar } from "@/components/Navbar";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { Reveal } from "@/components/Reveal";
import { type Course } from "@/data/courses";
import { fetchCourses } from "@/lib/api";
import heroImg from "@/assets/hero-illustration.jpg";

const stats = [
  { label: "Active Learners", value: "12,400+", icon: Users },
  { label: "Courses", value: "48", icon: BookOpen },
  { label: "Completion Rate", value: "87%", icon: Trophy },
  { label: "AI Interactions", value: "1.2M", icon: Brain },
];

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, []);

  const enrolledCourses = courses.filter((c) => c.progress != null);
  const exploreCourses = courses.filter((c) => c.progress == null);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="container grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                <Zap className="h-3.5 w-3.5" /> AI-Powered Learning
              </span>
              <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance md:text-5xl lg:text-6xl">
                Learn to code with an AI tutor by your side
              </h1>
              <p className="max-w-lg text-lg text-muted-foreground text-pretty leading-relaxed">
                Interactive courses, real-time feedback, and a personal AI tutor that adapts to how you learn. From fundamentals to system design.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="hero" asChild>
                  <Link to="/dashboard">
                    Start Learning <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-2xl" />
              <img
                src={heroImg}
                alt="AI-powered learning illustration"
                className="relative rounded-2xl shadow-elevated"
                width={1280}
                height={720}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-card">
        <div className="container py-10">
          <Reveal>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold tabular-nums">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <section className="py-14">
          <div className="container">
            <Reveal>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold">Continue Learning</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off</p>
                </div>
                <Link to="/courses" className="text-sm font-medium text-primary hover:underline">
                  View all →
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course, i) => (
                <Reveal key={course.id} delay={i * 80}>
                  <CourseCard {...course} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Explore Courses */}
      <section className="bg-muted/50 py-14">
        <div className="container">
          <Reveal>
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold">Explore Courses</h2>
              <p className="mt-1 text-sm text-muted-foreground">Discover new skills to master</p>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exploreCourses.map((course, i) => (
              <Reveal key={course.id} delay={i * 80}>
                <CourseCard {...course} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-balance">
                Ready to accelerate your learning?
              </h2>
              <p className="mt-3 text-muted-foreground text-pretty">
                Join thousands of developers leveling up with AI-assisted courses.
              </p>
              <Button variant="hero" className="mt-6" asChild>
                <Link to="/dashboard">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <AIChatSidebar />
    </div>
  );
};

export default Index;
