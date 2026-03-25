import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Quiz } from "@/components/Quiz";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { Reveal } from "@/components/Reveal";
import { type Course, type QuizQuestion } from "@/data/courses";
import { fetchCourseById, fetchQuizQuestions } from "@/lib/api";

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    if (!courseId) return;
    fetchCourseById(courseId).then(setCourse);
  }, [courseId]);

  useEffect(() => {
    fetchQuizQuestions().then(setQuestions);
  }, []);

  const lesson = course?.lessons.find((l) => l.id === lessonId);

  if (!course || !lesson) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Lesson not found</h1>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const lessonIndex = course.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = course.lessons[lessonIndex + 1];
  const prevLesson = course.lessons[lessonIndex - 1];

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`Quiz completed: ${score}/${total}`);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container py-6">
        {/* Breadcrumb */}
        <Reveal>
          <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to={`/course/${courseId}`} className="hover:text-foreground transition-colors">
              {course.title}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{lesson.title}</span>
          </div>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Reveal>
              {lesson.type === "quiz" ? (
                <div>
                  <h1 className="mb-5 font-display text-2xl font-bold">{lesson.title}</h1>
                  <Quiz questions={questions} onComplete={handleQuizComplete} />
                </div>
              ) : (
                <div>
                  <VideoPlayer title={lesson.title} />
                  <h1 className="mt-5 font-display text-2xl font-bold">{lesson.title}</h1>
                  <p className="mt-2 text-muted-foreground text-pretty leading-relaxed">
                    In this lesson, we'll cover the core concepts and work through practical examples.
                    Follow along with the code and try the exercises at the end.
                  </p>
                </div>
              )}
            </Reveal>

            {/* Navigation */}
            <Reveal delay={100}>
              <div className="flex items-center justify-between border-t border-border pt-5">
                {prevLesson ? (
                  <Button variant="outline" asChild>
                    <Link to={`/course/${courseId}/lesson/${prevLesson.id}`}>
                      <ArrowLeft className="h-4 w-4" /> Previous
                    </Link>
                  </Button>
                ) : <div />}
                {nextLesson ? (
                  <Button variant="default" asChild>
                    <Link to={`/course/${courseId}/lesson/${nextLesson.id}`}>
                      Next Lesson <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="success" asChild>
                    <Link to={`/course/${courseId}`}>Complete Course 🎉</Link>
                  </Button>
                )}
              </div>
            </Reveal>
          </div>

          {/* Sidebar: lesson list */}
          <div>
            <Reveal delay={100}>
              <div className="sticky top-20 rounded-xl border border-border bg-card p-4 shadow-card">
                <h3 className="mb-3 font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">Lessons</h3>
                <div className="flex flex-col gap-1">
                  {course.lessons.map((l, i) => (
                    <Link
                      key={l.id}
                      to={`/course/${courseId}/lesson/${l.id}`}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                        l.id === lessonId
                          ? "bg-primary/10 text-primary font-medium"
                          : l.completed
                          ? "text-success hover:bg-muted"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold bg-muted">
                        {i + 1}
                      </span>
                      <span className="truncate">{l.title}</span>
                    </Link>
                  ))}
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

export default LessonPage;
