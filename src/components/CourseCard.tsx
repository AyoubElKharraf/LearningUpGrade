import { BookOpen, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  lessonsCount: number;
  duration: string;
  rating: number;
  students: number;
  progress?: number | null;
  color: string;
}

export const CourseCard = ({
  id,
  title,
  description,
  image,
  category,
  lessonsCount,
  duration,
  rating,
  students,
  progress,
  color,
}: CourseCardProps) => {
  const hasImage = Boolean(image && image.trim().length > 0);

  return (
    <Link
      to={`/course/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden" style={{ backgroundColor: color }}>
        {hasImage ? (
          <img
            src={image}
            alt={title}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={(e) => {
              // Avoid showing the broken-image icon; backgroundColor remains as a fallback.
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute left-3 top-3">
          <span className="rounded-md bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
            {category}
          </span>
        </div>
        {progress != null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/10">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1.5 font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2 text-pretty">
          {description}
        </p>

        <div className="mt-auto flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {lessonsCount} lessons
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {duration}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {rating}
          </span>
        </div>
      </div>
    </Link>
  );
};
