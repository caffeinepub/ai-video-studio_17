import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { Clock, Film, Loader2, PenLine, Sparkles, Wand2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Duration, Style } from "../backend.d";
import { AuthGuard } from "../components/AuthGuard";
import { useCreateVideoJob } from "../hooks/useQueries";

const styleOptions: {
  value: Style;
  label: string;
  emoji: string;
  description: string;
  thumb: string;
}[] = [
  {
    value: Style.cinematic,
    label: "Cinematic",
    emoji: "🎬",
    description: "Film-like quality with dramatic lighting & depth",
    thumb: "/assets/generated/thumb-cinematic.dim_600x340.jpg",
  },
  {
    value: Style.animated,
    label: "Animated",
    emoji: "✨",
    description: "Fluid animation with vibrant, dynamic motion",
    thumb: "/assets/generated/thumb-animated.dim_600x340.jpg",
  },
  {
    value: Style.realistic,
    label: "Realistic",
    emoji: "📷",
    description: "Photorealistic scenes with natural textures",
    thumb: "/assets/generated/thumb-realistic.dim_600x340.jpg",
  },
  {
    value: Style.cartoon,
    label: "Cartoon",
    emoji: "🎨",
    description: "Colorful cartoon with bold outlines & bright hues",
    thumb: "/assets/generated/thumb-cartoon.dim_600x340.jpg",
  },
  {
    value: Style.abstract_,
    label: "Abstract",
    emoji: "🌀",
    description: "Fluid geometric shapes & experimental visuals",
    thumb: "/assets/generated/thumb-abstract.dim_600x340.jpg",
  },
];

const durationOptions: {
  value: Duration;
  label: string;
  seconds: string;
  description: string;
}[] = [
  {
    value: Duration.short_,
    label: "Short",
    seconds: "5s",
    description: "Quick take",
  },
  {
    value: Duration.medium,
    label: "Medium",
    seconds: "15s",
    description: "Standard clip",
  },
  {
    value: Duration.long_,
    label: "Long",
    seconds: "30s",
    description: "Full scene",
  },
];

const examplePrompts = [
  "A futuristic city floating above the clouds at golden hour, with flying vehicles weaving between glass towers",
  "Timelapse of a flower blooming in a misty forest, soft morning light filtering through the canopy",
  "An astronaut discovers an ancient alien structure on a distant red planet, dramatic atmosphere",
  "A jazz musician performs in a smoky vintage club, spotlights casting long shadows on the stage",
];

function CreateForm() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<Style>(Style.cinematic);
  const [selectedDuration, setSelectedDuration] = useState<Duration>(
    Duration.medium,
  );
  const { mutateAsync: createJob, isPending } = useCreateVideoJob();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }
    if (prompt.trim().length < 10) {
      toast.error("Prompt must be at least 10 characters");
      return;
    }
    try {
      await createJob({
        prompt: prompt.trim(),
        style: selectedStyle,
        duration: selectedDuration,
      });
      toast.success("Video generation started!");
      void navigate({ to: "/library" });
    } catch {
      // Error handled in mutation
    }
  };

  const applyExample = (p: string) => setPrompt(p);

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-10">
      {/* Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-3"
      >
        <Label
          htmlFor="prompt"
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <PenLine className="w-4 h-4 text-primary" />
          Describe your video
        </Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your video in detail... e.g. 'A dramatic timelapse of storm clouds rolling over a mountain range at dusk, lightning flashing in the distance'"
          className="min-h-32 bg-muted/30 border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none text-sm leading-relaxed placeholder:text-muted-foreground/50"
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground/60">
            {prompt.length}/500 characters
          </p>
          {prompt.length === 0 && (
            <p className="text-xs text-muted-foreground/50">
              Be specific for best results
            </p>
          )}
        </div>

        {/* Example prompts */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => applyExample(p)}
                className="text-xs px-3 py-1.5 rounded-lg glass border-border/50 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all line-clamp-1 max-w-xs text-left"
              >
                {p.length > 50 ? `${p.slice(0, 50)}…` : p}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Style picker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-3"
      >
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Film className="w-4 h-4 text-primary" />
          Visual Style
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {styleOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setSelectedStyle(opt.value)}
              className={cn(
                "relative rounded-xl overflow-hidden border-2 transition-all duration-200 group text-left",
                selectedStyle === opt.value
                  ? "border-primary shadow-glow scale-[1.02]"
                  : "border-border/40 hover:border-border/80",
              )}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={opt.thumb}
                  alt={opt.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-background/90 to-background/10 transition-opacity",
                    selectedStyle === opt.value ? "opacity-80" : "opacity-60",
                  )}
                />
                {selectedStyle === opt.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-base">{opt.emoji}</span>
                  <span
                    className={cn(
                      "text-sm font-semibold transition-colors",
                      selectedStyle === opt.value
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {opt.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-tight hidden sm:block">
                  {opt.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Duration picker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-3"
      >
        <Label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          Duration
        </Label>
        <div className="flex gap-3">
          {durationOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setSelectedDuration(opt.value)}
              className={cn(
                "flex-1 rounded-xl border-2 p-4 text-center transition-all duration-200",
                selectedDuration === opt.value
                  ? "border-primary bg-primary/10 shadow-glow"
                  : "border-border/40 hover:border-border/80 glass",
              )}
            >
              <div
                className={cn(
                  "text-2xl font-display font-black mb-1 transition-colors",
                  selectedDuration === opt.value
                    ? "gradient-text"
                    : "text-foreground",
                )}
              >
                {opt.seconds}
              </div>
              <div
                className={cn(
                  "text-sm font-medium transition-colors",
                  selectedDuration === opt.value
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {opt.label}
              </div>
              <div className="text-xs text-muted-foreground/60 mt-0.5">
                {opt.description}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Button
          type="submit"
          disabled={isPending || !prompt.trim()}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-base glow-violet rounded-xl group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
              Queuing your video…
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-3 transition-transform group-hover:rotate-12" />
              Generate Video
            </>
          )}
        </Button>
        <p className="text-center text-xs text-muted-foreground/50 mt-3">
          Video generation usually takes 15–60 seconds
        </p>
      </motion.div>
    </form>
  );
}

export function CreatePage() {
  return (
    <AuthGuard>
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-violet">
                <Wand2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-black text-3xl sm:text-4xl gradient-text">
                  Create Video
                </h1>
                <p className="text-muted-foreground text-sm">
                  Describe your vision and let AI bring it to life
                </p>
              </div>
            </div>
          </motion.div>

          <div className="glass-strong rounded-2xl p-6 sm:p-8">
            <CreateForm />
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
