import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Film, Library, Loader2, LogOut, Plus, User } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Navbar() {
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/create", label: "Create" },
    { to: "/library", label: "My Library" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-violet transition-all group-hover:bg-primary/30">
              <Film className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight gradient-text">
              AI Video Studio
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  currentPath === to
                    ? "text-foreground bg-muted/60"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <Link to="/create">
                <Button
                  size="sm"
                  className="hidden sm:flex gap-2 bg-primary/90 hover:bg-primary text-primary-foreground glow-violet"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create
                </Button>
              </Link>
            )}

            {isInitializing ? (
              <div className="w-9 h-9 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9 rounded-full border border-border/60 hover:border-primary/40 hover:bg-primary/10"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="glass border-border/60 w-48"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/library"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Library className="w-4 h-4" />
                      My Library
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => clear()}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="sm"
                className="bg-primary/90 hover:bg-primary text-primary-foreground glow-violet"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
