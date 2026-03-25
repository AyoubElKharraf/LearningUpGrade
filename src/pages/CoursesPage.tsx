import { useEffect, useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { Reveal } from "@/components/Reveal";
import { type Course } from "@/data/courses";
import { fetchCourses } from "@/lib/api";

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchCourses().then(setCourses);
  }, []);

  const enrolled = useMemo(() => courses.filter((c) => c.progress != null), [courses]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl py-8">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#4a4a4a] px-4 py-2 text-sm font-semibold text-white shadow-sm">
            <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
            My Courses
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Course catalog</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Continue ton apprentissage en cours.
          </p>
        </Reveal>

        {enrolled.length > 0 ? (
          <section className="mt-12">
            <Reveal>
              <h2 className="font-display text-xl font-bold">In progress</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pick up where you left off.</p>
            </Reveal>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {enrolled.map((course, i) => (
                <Reveal key={course.id} delay={i * 60}>
                  <CourseCard {...course} />
                </Reveal>
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-12">
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
              <h2 className="font-display text-xl font-bold">Aucun cours commencé</h2>
              <p className="mt-2 text-sm text-muted-foreground">Commence un cours depuis Dashboard pour le voir ici.</p>
            </div>
          </section>
        )}
      </div>
      <AIChatSidebar />
    </div>
  );
};

export default CoursesPage;
