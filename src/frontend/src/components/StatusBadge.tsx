import { cn } from "@/lib/utils";
import { Status } from "../backend.d";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; classes: string; dotClass: string }
> = {
  [Status.pending]: {
    label: "Pending",
    classes:
      "bg-[oklch(0.78_0.18_85/0.15)] text-[oklch(0.88_0.18_85)] border border-[oklch(0.78_0.18_85/0.4)]",
    dotClass: "bg-[oklch(0.78_0.18_85)]",
  },
  [Status.processing]: {
    label: "Processing",
    classes:
      "bg-[oklch(0.65_0.18_220/0.15)] text-[oklch(0.75_0.18_220)] border border-[oklch(0.65_0.18_220/0.4)]",
    dotClass: "bg-[oklch(0.65_0.18_220)] animate-pulse",
  },
  [Status.completed]: {
    label: "Completed",
    classes:
      "bg-[oklch(0.72_0.18_145/0.15)] text-[oklch(0.82_0.18_145)] border border-[oklch(0.72_0.18_145/0.4)]",
    dotClass: "bg-[oklch(0.72_0.18_145)]",
  },
  [Status.failed]: {
    label: "Failed",
    classes:
      "bg-[oklch(0.58_0.22_25/0.15)] text-[oklch(0.72_0.20_25)] border border-[oklch(0.58_0.22_25/0.4)]",
    dotClass: "bg-[oklch(0.58_0.22_25)]",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig[Status.pending];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium font-body",
        config.classes,
        className,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
