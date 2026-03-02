import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Film,
  Layers,
  Play,
  Sparkles,
  Timer,
  TrendingUp,
  Video,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Duration, Status, Style } from "../backend.d";
import { StatusBadge } from "../components/StatusBadge";
import { useLatestJobs, usePublicStats } from "../hooks/useQueries";

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

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate stunning AI videos in seconds, not hours. Our optimized pipeline delivers results at unprecedented speed.",
    color: "text-[oklch(0.78_0.18_85)]",
    bg: "bg-[oklch(0.78_0.18_85/0.1)]",
    border: "border-[oklch(0.78_0.18_85/0.25)]",
  },
  {
    icon: Layers,
    title: "5 Unique Styles",
    description:
      "Choose from Cinematic, Animated, Realistic, Cartoon, or Abstract. Each style unlocks a completely different visual universe.",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/25",
  },
  {
    icon: Film,
    title: "HD Quality",
    description:
      "Every frame rendered at full high definition. Crisp details, vibrant colors, and professional-grade output every time.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/25",
  },
  {
    icon: Sparkles,
    title: "Prompt to Video",
    description:
      "Just describe what you want in plain language. Our AI understands context, mood, and nuance to create exactly your vision.",
    color: "text-[oklch(0.72_0.18_145)]",
    bg: "bg-[oklch(0.72_0.18_145/0.1)]",
    border: "border-[oklch(0.72_0.18_145/0.25)]",
  },
];

// Sample jobs for landing page gallery (shown alongside real data)
const sampleJobs = [
  {
    id: -1n,
    prompt:
      "A drone flies over neon-lit Tokyo streets at midnight, rain reflecting city lights",
    style: Style.cinematic,
    duration: Duration.medium,
    status: Status.completed,
  },
  {
    id: -2n,
    prompt:
      "Cartoon animals having a dance party in a magical forest with fireflies",
    style: Style.cartoon,
    duration: Duration.short_,
    status: Status.completed,
  },
  {
    id: -3n,
    prompt:
      "Abstract fluid geometry morphing through deep space, cosmic colors",
    style: Style.abstract_,
    duration: Duration.long_,
    status: Status.completed,
  },
  {
    id: -4n,
    prompt: "Majestic eagle soaring over snow-capped mountain peaks at sunrise",
    style: Style.realistic,
    duration: Duration.medium,
    status: Status.processing,
  },
  {
    id: -5n,
    prompt: "Vibrant animated underwater world with bioluminescent creatures",
    style: Style.animated,
    duration: Duration.medium,
    status: Status.completed,
  },
  {
    id: -6n,
    prompt:
      "Slow-motion cinematic shot of a city awakening at dawn, fog over glass towers",
    style: Style.cinematic,
    duration: Duration.long_,
    status: Status.pending,
  },
];

function StatCard({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-6 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 glow-violet">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <p className="font-display font-bold text-3xl gradient-text">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const { data: stats, isLoading: statsLoading } = usePublicStats();
  const { data: latestJobs, isLoading: jobsLoading } = useLatestJobs(6n);

  // Merge real jobs with sample fallbacks
  const displayJobs =
    latestJobs && latestJobs.length > 0 ? latestJobs : sampleJobs;

  return (
    <main className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/hero-bg.dim_1600x900.jpg"
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background" />
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] bg-primary/20 pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full blur-[100px] bg-accent/15 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 border mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Powered by Advanced AI
              </span>
            </div>

            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6">
              <span className="gradient-text glow-text-violet block">
                Generate
              </span>
              <span className="text-foreground block">Stunning Videos</span>
              <span className="text-muted-foreground block text-4xl sm:text-5xl md:text-6xl mt-2">
                with AI
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Transform your imagination into cinematic masterpieces. Just
              describe your vision — our AI handles the rest in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/create">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base glow-violet rounded-xl group"
                >
                  Start Creating
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/library">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-border/60 hover:border-primary/40 hover:bg-primary/5 text-foreground px-8 py-6 text-base rounded-xl"
                >
                  <Play className="w-4 h-4 mr-2" />
                  View Gallery
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-pulse" />
        </motion.div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statsLoading ? (
              <>
                <Skeleton className="h-24 w-full shimmer rounded-2xl" />
                <Skeleton className="h-24 w-full shimmer rounded-2xl" />
              </>
            ) : (
              <>
                <StatCard
                  icon={TrendingUp}
                  value={stats ? stats.totalJobsCreated.toLocaleString() : "0"}
                  label="Videos Generated"
                  delay={0}
                />
                <StatCard
                  icon={Video}
                  value={stats ? stats.totalCompleted.toLocaleString() : "0"}
                  label="Successfully Completed"
                  delay={0.1}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 text-foreground">
              Everything you need to{" "}
              <span className="gradient-text">create</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Professional-grade AI video generation with features designed for
              creators at every level.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-border/80 transition-all duration-300 group"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${feature.bg} border ${feature.border} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-display font-semibold text-base mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Gallery ────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mb-2 text-foreground">
                Recent <span className="gradient-text">Creations</span>
              </h2>
              <p className="text-muted-foreground">
                See what other creators are generating right now.
              </p>
            </div>
            <Link to="/create">
              <Button
                variant="outline"
                className="hidden sm:flex border-border/60 hover:border-primary/40 hover:bg-primary/5 rounded-xl"
              >
                Create Yours
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {jobsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }, (_, i) => `skel-${i}`).map((key) => (
                <div key={key} className="glass rounded-xl overflow-hidden">
                  <Skeleton className="aspect-video shimmer" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4 shimmer" />
                    <Skeleton className="h-4 w-1/2 shimmer" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayJobs.map((job, i) => {
                const thumb =
                  styleThumbs[job.style] ?? styleThumbs[Style.cinematic];
                const dur = durationLabel[job.duration];
                return (
                  <motion.div
                    key={job.id.toString()}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="glass rounded-xl overflow-hidden group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted/30">
                      <img
                        src={thumb}
                        alt={job.prompt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <StatusBadge status={job.status} />
                      </div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md glass text-xs text-muted-foreground">
                        <Timer className="w-3 h-3" />
                        {dur}
                      </div>
                      {/* Play icon overlay on completed */}
                      {job.status === Status.completed && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full glass-strong flex items-center justify-center glow-violet">
                            <Play className="w-5 h-5 text-primary ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                        {job.prompt}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative glass-strong rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
          >
            {/* Glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/20 blur-[60px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-48 h-24 bg-accent/15 blur-[50px] pointer-events-none" />

            <div className="relative z-10">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-5 animate-pulse-glow" />
              <h2 className="font-display font-black text-4xl sm:text-5xl mb-4 gradient-text">
                Ready to Create?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Join thousands of creators turning their ideas into stunning AI
                videos. Start for free today.
              </p>
              <Link to="/create">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-10 py-6 text-base glow-violet rounded-xl"
                >
                  Generate Your First Video
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
