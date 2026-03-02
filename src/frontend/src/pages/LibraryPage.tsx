import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Library, Plus, RefreshCw, Wand2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { AuthGuard } from "../components/AuthGuard";
import { JobCard, JobCardSkeleton } from "../components/JobCard";
import { useActor } from "../hooks/useActor";
import { useMyJobs, useSimulateProgress } from "../hooks/useQueries";

function LibraryContent() {
  const { data: jobs, isLoading, isError, refetch } = useMyJobs();
  const simulateProgress = useSimulateProgress();
  const queryClient = useQueryClient();
  const { actor } = useActor();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll every 4 seconds
  useEffect(() => {
    if (!actor) return;

    intervalRef.current = setInterval(async () => {
      await simulateProgress();
      void queryClient.invalidateQueries({ queryKey: ["myJobs"] });
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [actor, simulateProgress, queryClient]);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-violet">
            <Library className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-display font-black text-3xl sm:text-4xl gradient-text">
              My Library
            </h1>
            <p className="text-muted-foreground text-sm">
              {jobs
                ? `${jobs.length} video${jobs.length !== 1 ? "s" : ""}`
                : "Your video collection"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void refetch()}
            className="w-9 h-9 text-muted-foreground hover:text-foreground"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Link to="/create">
            <Button
              size="sm"
              className="bg-primary/90 hover:bg-primary text-primary-foreground glow-violet gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              New Video
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
            <JobCardSkeleton key={key} />
          ))}
        </div>
      ) : isError ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-10 text-center"
        >
          <p className="text-muted-foreground mb-4">
            Failed to load your videos
          </p>
          <Button
            variant="outline"
            onClick={() => void refetch()}
            className="border-border/60 hover:border-primary/40"
          >
            Try Again
          </Button>
        </motion.div>
      ) : !jobs || jobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-strong rounded-2xl p-14 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-6">
            <Wand2 className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-display font-bold text-xl mb-3 text-foreground">
            No videos yet
          </h3>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs mx-auto">
            Create your first AI-generated video and it will appear here.
          </p>
          <Link to="/create">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground glow-violet gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Video
            </Button>
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, i) => (
              <JobCard key={job.id.toString()} job={job} index={i} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

export function LibraryPage() {
  return (
    <AuthGuard>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LibraryContent />
        </div>
      </main>
    </AuthGuard>
  );
}
