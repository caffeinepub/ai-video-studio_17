import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Clock, Film, Timer, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { VideoJob } from "../backend.d";
import { Duration, Status, Style } from "../backend.d";
import { useDeleteJob } from "../hooks/useQueries";
import { StatusBadge } from "./StatusBadge";

const styleThumbs: Record<Style, string> = {
  [Style.cinematic]: "/assets/generated/thumb-cinematic.dim_600x340.jpg",
  [Style.animated]: "/assets/generated/thumb-animated.dim_600x340.jpg",
  [Style.realistic]: "/assets/generated/thumb-realistic.dim_600x340.jpg",
  [Style.abstract_]: "/assets/generated/thumb-abstract.dim_600x340.jpg",
  [Style.cartoon]: "/assets/generated/thumb-cartoon.dim_600x340.jpg",
};

const durationLabel: Record<Duration, string> = {
  [Duration.short_]: "5s",
  [Duration.medium]: "15s",
  [Duration.long_]: "30s",
};

const styleLabel: Record<Style, string> = {
  [Style.cinematic]: "Cinematic",
  [Style.animated]: "Animated",
  [Style.realistic]: "Realistic",
  [Style.abstract_]: "Abstract",
  [Style.cartoon]: "Cartoon",
};

interface JobCardProps {
  job: VideoJob;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();
  const navigate = useNavigate();
  const thumb = styleThumbs[job.style] ?? styleThumbs[Style.cinematic];
  const createdDate = new Date(
    Number(job.createdAt / 1_000_000n),
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteJob(job.id);
  };

  const handleClick = () => {
    void navigate({ to: "/job/$id", params: { id: job.id.toString() } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group glass rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300 hover:shadow-card-lift"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        <img
          src={thumb}
          alt={job.prompt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={job.status} />
        </div>

        {/* Processing overlay */}
        {job.status === Status.processing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md glass text-xs text-muted-foreground">
          <Timer className="w-3 h-3" />
          {durationLabel[job.duration]}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm text-foreground font-medium line-clamp-2 leading-relaxed flex-1">
            {job.prompt}
          </p>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50 text-xs text-muted-foreground">
              <Film className="w-3 h-3" />
              {styleLabel[job.style]}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
              <Clock className="w-3 h-3" />
              {createdDate}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <Skeleton className="aspect-video w-full shimmer" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4 shimmer" />
        <Skeleton className="h-4 w-1/2 shimmer" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 shimmer rounded-md" />
          <Skeleton className="h-6 w-16 shimmer rounded-md" />
        </div>
      </div>
    </div>
  );
}
