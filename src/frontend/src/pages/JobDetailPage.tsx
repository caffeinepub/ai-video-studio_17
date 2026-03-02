import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  Film,
  Loader2,
  RefreshCw,
  Timer,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Duration, Status, Style } from "../backend.d";
import { AuthGuard } from "../components/AuthGuard";
import { StatusBadge } from "../components/StatusBadge";
import { useActor } from "../hooks/useActor";
import {
  useDeleteJob,
  useSimulateProgress,
  useVideoJob,
} from "../hooks/useQueries";

const styleThumbs: Record<Style, string> = {
  [Style.cinematic]: "/assets/generated/thumb-cinematic.dim_600x340.jpg",
  [Style.animated]: "/assets/generated/thumb-animated.dim_600x340.jpg",
  [Style.realistic]: "/assets/generated/thumb-realistic.dim_600x340.jpg",
  [Style.abstract_]: "/assets/generated/thumb-abstract.dim_600x340.jpg",
  [Style.cartoon]: "/assets/generated/thumb-cartoon.dim_600x340.jpg",
};

const styleLabel: Record<Style, string> = {
  [Style.cinematic]: "Cinematic",
  [Style.animated]: "Animated",
  [Style.realistic]: "Realistic",
  [Style.abstract_]: "Abstract",
  [Style.cartoon]: "Cartoon",
};

const durationLabel: Record<Duration, string> = {
  [Duration.short_]: "5 seconds",
  [Duration.medium]: "15 seconds",
  [Duration.long_]: "30 seconds",
};

const DEMO_VIDEO_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

function VideoPlayer({
  style,
  videoUrl,
}: {
  style: Style;
  videoUrl?: string;
}) {
  const thumb = styleThumbs[style] ?? styleThumbs[Style.cinematic];
  const src =
    videoUrl && videoUrl !== "https://example.com/mockvideo.mp4"
      ? videoUrl
      : DEMO_VIDEO_URL;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
      <video
        key={src}
        className="w-full h-full object-contain"
        controls
        autoPlay={false}
        poster={thumb}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

function JobDetailContent({ jobId }: { jobId: bigint }) {
  const { data: job, isLoading, isError, refetch } = useVideoJob(jobId);
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteJob();
  const navigate = useNavigate();
  const simulateProgress = useSimulateProgress();
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progress, setProgress] = useState(0);

  // Poll for active jobs
  useEffect(() => {
    if (!actor || !job) return;
    if (job.status === Status.pending || job.status === Status.processing) {
      intervalRef.current = setInterval(async () => {
        await simulateProgress();
        void queryClient.invalidateQueries({
          queryKey: ["videoJob", jobId.toString()],
        });
      }, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, job, jobId, simulateProgress, queryClient]);

  // Animate progress for processing state
  useEffect(() => {
    if (!job) return;
    if (job.status === Status.processing) {
      const interval = setInterval(() => {
        setProgress((p) => (p >= 90 ? 90 : p + Math.random() * 5));
      }, 500);
      return () => clearInterval(interval);
    }
    if (job.status === Status.completed) setProgress(100);
    if (job.status === Status.pending) setProgress(0);
  }, [job]);

  const handleDelete = () => {
    deleteJob(jobId, {
      onSuccess: () => void navigate({ to: "/library" }),
    });
  };

  const formatDate = (timestamp: bigint) =>
    new Date(Number(timestamp / 1_000_000n)).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-video w-full shimmer rounded-2xl" />
        <Skeleton className="h-6 w-1/2 shimmer" />
        <Skeleton className="h-4 w-3/4 shimmer" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 shimmer rounded-xl" />
          <Skeleton className="h-20 shimmer rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">
          Failed to load video details
        </p>
        <Button
          variant="outline"
          onClick={() => void refetch()}
          className="border-border/60"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Video player / status area */}
      {job.status === Status.completed ? (
        <VideoPlayer style={job.style} videoUrl={job.videoUrl} />
      ) : job.status === Status.processing ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden glass flex flex-col items-center justify-center gap-6">
          <div className="absolute inset-0 opacity-20">
            <img
              src={styleThumbs[job.style]}
              alt=""
              className="w-full h-full object-cover blur-sm"
            />
          </div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">
              Generating your video…
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              This usually takes 15–60 seconds
            </p>
            <div className="w-64 mx-auto">
              <Progress value={progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-2">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>
        </div>
      ) : job.status === Status.pending ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden glass flex flex-col items-center justify-center gap-4">
          <div className="absolute inset-0 opacity-10">
            <img
              src={styleThumbs[job.style]}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center">
            <Loader2 className="w-12 h-12 text-[oklch(0.78_0.18_85)] animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground">
              Waiting in queue…
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your job will start processing soon
            </p>
          </div>
        </div>
      ) : (
        // Failed
        <div className="relative aspect-video rounded-2xl overflow-hidden glass flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <div className="text-center">
            <p className="text-sm font-semibold text-destructive mb-1">
              Generation Failed
            </p>
            {job.errorMessage && (
              <p className="text-xs text-muted-foreground max-w-xs">
                {job.errorMessage}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Job info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-5"
      >
        {/* Prompt & status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-foreground text-base leading-relaxed font-medium">
              {job.prompt}
            </p>
          </div>
          <StatusBadge status={job.status} className="shrink-0 mt-0.5" />
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: Film,
              label: "Style",
              value: styleLabel[job.style],
            },
            {
              icon: Timer,
              label: "Duration",
              value: durationLabel[job.duration],
            },
            {
              icon: Calendar,
              label: "Created",
              value: formatDate(job.createdAt),
            },
            {
              icon: Clock,
              label: "Updated",
              value: formatDate(job.updatedAt),
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-xs">{label}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Job ID */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground/50 font-mono">
          <span>Job ID:</span>
          <span>{job.id.toString()}</span>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 flex-wrap">
        {job.status === Status.completed &&
          (() => {
            const downloadUrl =
              job.videoUrl &&
              job.videoUrl !== "https://example.com/mockvideo.mp4"
                ? job.videoUrl
                : DEMO_VIDEO_URL;
            return (
              <a
                href={downloadUrl}
                download="ai-video.mp4"
                target="_blank"
                rel="noreferrer"
              >
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="w-4 h-4" />
                  Download Video
                </Button>
              </a>
            );
          })()}
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="gap-2"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          Delete
        </Button>
        <Button
          variant="ghost"
          onClick={() => void refetch()}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}

export function JobDetailPage() {
  const params = useParams({ from: "/job/$id" });

  let jobId: bigint;
  try {
    jobId = BigInt(params.id);
  } catch {
    return (
      <main className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Invalid job ID</p>
          <Link to="/library">
            <Button variant="outline">Back to Library</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <Link to="/library">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Library
              </Button>
            </Link>
          </motion.div>

          <div className="glass-strong rounded-2xl p-6 sm:p-8">
            <JobDetailContent jobId={jobId} />
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
