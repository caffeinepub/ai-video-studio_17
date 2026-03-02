import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Duration, Status, Style } from "../backend.d";
import { useActor } from "./useActor";

// ── Public Stats ──────────────────────────────────────────────────────────────
export function usePublicStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["publicStats"],
    queryFn: async () => {
      if (!actor) return { totalCompleted: 0n, totalJobsCreated: 0n };
      return actor.getPublicStats();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30_000,
  });
}

// ── Latest Jobs (landing gallery) ─────────────────────────────────────────────
export function useLatestJobs(limit = 6n) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["latestJobs", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLatestJobs(limit);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });
}

// ── My Jobs ────────────────────────────────────────────────────────────────────
export function useMyJobs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myJobs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyJobs();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Single Job ─────────────────────────────────────────────────────────────────
export function useVideoJob(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["videoJob", id.toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      return actor.getVideoJob(id);
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Create Job ─────────────────────────────────────────────────────────────────
export function useCreateVideoJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      prompt,
      style,
      duration,
    }: {
      prompt: string;
      style: Style;
      duration: Duration;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createVideoJob(prompt, style, duration);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myJobs"] });
      void queryClient.invalidateQueries({ queryKey: ["latestJobs"] });
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to create video job");
    },
  });
}

// ── Delete Job ─────────────────────────────────────────────────────────────────
export function useDeleteJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteJob(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["myJobs"] });
      void queryClient.invalidateQueries({ queryKey: ["latestJobs"] });
      toast.success("Video deleted");
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to delete job");
    },
  });
}

// ── Simulate Progress ──────────────────────────────────────────────────────────
export function useSimulateProgress() {
  const { actor } = useActor();
  return async () => {
    if (!actor) return;
    await actor.simulateProgress();
  };
}

// ── Status helpers ─────────────────────────────────────────────────────────────
export type { Status, Style, Duration };
