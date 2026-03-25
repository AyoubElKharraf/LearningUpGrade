import { Play, Pause, Volume2, Maximize, SkipForward, SkipBack } from "lucide-react";
import { useState } from "react";

interface VideoPlayerProps {
  title: string;
  videoUrl?: string | null;
  thumbnailUrl?: string;
}

export const VideoPlayer = ({ title, videoUrl, thumbnailUrl }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(32);

  if (videoUrl) {
    return (
      <div className="overflow-hidden rounded-xl bg-black aspect-video">
        <video className="h-full w-full" src={videoUrl} controls preload="metadata">
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-foreground aspect-video">
      {/* Thumbnail / Video area */}
      <div className="absolute inset-0 flex items-center justify-center">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover opacity-60" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-primary-foreground/60">
            <Play className="h-12 w-12" />
            <span className="text-sm font-medium">{title}</span>
          </div>
        )}
      </div>

      {/* Play overlay */}
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-colors hover:bg-foreground/30"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-elevated transition-transform hover:scale-110 active:scale-95">
            <Play className="h-7 w-7 ml-1" />
          </div>
        </button>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4 pt-8">
        {/* Progress bar */}
        <div className="mb-3 h-1 w-full rounded-full bg-primary-foreground/20 cursor-pointer group">
          <div
            className="h-full rounded-full bg-primary transition-all group-hover:h-1.5"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-primary-foreground">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-md p-1.5 hover:bg-primary-foreground/10 transition-colors"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button className="rounded-md p-1.5 hover:bg-primary-foreground/10 transition-colors">
              <SkipBack className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 hover:bg-primary-foreground/10 transition-colors">
              <SkipForward className="h-4 w-4" />
            </button>
            <span className="ml-2 text-xs font-medium text-primary-foreground/70">
              12:34 / 38:20
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded-md p-1.5 hover:bg-primary-foreground/10 transition-colors">
              <Volume2 className="h-4 w-4" />
            </button>
            <button className="rounded-md p-1.5 hover:bg-primary-foreground/10 transition-colors">
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
