import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CoursesPage from "./pages/CoursesPage.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import CourseDetail from "./pages/CourseDetail.tsx";
import LessonPage from "./pages/LessonPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import AdminCourseCreatePage from "./pages/AdminCourseCreatePage.tsx";
import AdminCourseEditPage from "./pages/AdminCourseEditPage.tsx";
import AdminLessonCreatePage from "./pages/AdminLessonCreatePage.tsx";
import AdminLessonEditPage from "./pages/AdminLessonEditPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/catalog/courses/new" element={<AdminCourseCreatePage />} />
          <Route path="/admin/catalog/courses/:courseId" element={<AdminCourseEditPage />} />
          <Route path="/admin/catalog/courses/:courseId/lessons/new" element={<AdminLessonCreatePage />} />
          <Route path="/admin/catalog/lessons/:lessonId" element={<AdminLessonEditPage />} />
          <Route path="/course/:courseId" element={<CourseDetail />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
