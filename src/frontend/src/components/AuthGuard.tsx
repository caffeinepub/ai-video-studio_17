import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-strong rounded-2xl p-10 max-w-md w-full mx-4 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-6 glow-violet">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display font-bold text-2xl mb-3 gradient-text">
            Sign In Required
          </h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            You need to sign in to access this feature. Create videos, manage
            your library, and track your generations.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-violet"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing in…
              </>
            ) : (
              "Sign In to Continue"
            )}
          </Button>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
