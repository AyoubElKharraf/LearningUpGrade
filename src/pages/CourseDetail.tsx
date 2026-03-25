import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle2, Circle, FileText, HelpCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { Reveal } from "@/components/Reveal";
import { type Course } from "@/data/courses";
import { fetchCourseById } from "@/lib/api";

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!courseId) return;
    fetchCourseById(courseId).then(setCourse);
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Course not found</h1>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const completedCount = course.lessons.filter((l) => l.completed).length;
  const progress = Math.round((completedCount / course.lessons.length) * 100);

  const typeIcon = (type: string) => {
    switch (type) {
      case "video": return Play;
      case "quiz": return HelpCircle;
      default: return FileText;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="border-b border-border" style={{ backgroundColor: course.color }}>
        <div className="container py-10">
          <Reveal>
            <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to courses
            </Link>
            <div className="mt-2 flex flex-col gap-3">
              <span className="w-fit rounded-md bg-card/20 px-2.5 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
                {course.category}
              </span>
              <h1 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl" style={{ lineHeight: 1.1 }}>
                {course.title}
              </h1>
              <p className="max-w-xl text-primary-foreground/80 text-pretty">
                {course.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
                <span>{course.lessonsCount} lessons</span>
                <span>•</span>
                <span>{course.duration}</span>
                <span>•</span>
                <span>⭐ {course.rating}</span>
                <span>•</span>
                <span>{course.students.toLocaleString()} students</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Content */}
      <div className="container py-10">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Lessons list */}
          <div className="lg:col-span-2">
            <Reveal>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Course Content</h2>
                <span className="text-sm text-muted-foreground">
                  {completedCount} / {course.lessons.length} completed
                </span>
              </div>
            </Reveal>

            <div className="flex flex-col gap-2">
              {course.lessons.map((lesson, i) => {
                const Icon = typeIcon(lesson.type);
                return (
                  <Reveal key={lesson.id} delay={i * 60}>
                    <Link
                      to={`/course/${courseId}/lesson/${lesson.id}`}
                      className={`group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-card hover:border-primary/20 ${
                        lesson.completed ? "bg-success/5 border-success/20" : "border-border"
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        lesson.completed ? "bg-success/10 text-success" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                      } transition-colors`}>
                        {lesson.completed ? <CheckCircle2 className="h-4.5 w-4.5" /> : <Icon className="h-4.5 w-4.5" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold">{lesson.title}</h3>
                        <span className="text-xs text-muted-foreground capitalize">{lesson.type} • {lesson.duration}</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Sidebar info */}
          <div>
            <Reveal delay={100}>
              <div className="sticky top-20 rounded-xl border border-border bg-card p-5 shadow-card">
                <h3 className="font-display text-lg font-bold mb-3">Your Progress</h3>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">{progress}% complete</span>
                  <span className="font-medium">{completedCount}/{course.lessons.length}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-success transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>

                <Button className="mt-5 w-full" variant="default" asChild>
                  <Link to={`/course/${courseId}/lesson/${course.lessons.find(l => !l.completed)?.id || course.lessons[0].id}`}>
                    {progress > 0 ? "Continue Learning" : "Start Course"}
                  </Link>
                </Button>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lessons</span>
                    <span className="font-medium">{course.lessonsCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">⭐ {course.rating}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <AIChatSidebar />
    </div>
  );
};

export default CourseDetail;
