import { PropsWithChildren } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MinimalDots from "@/components/ui/loaders/MinimalDots";
import ProgressBarSplash from "@/components/ui/loaders/ProgressBarSplash";
import LogoReveal from "@/components/ui/loaders/LogoReveal";

/**
 * Displays a minimalist startup loader until the app is ready.
 * Readiness criteria: auth initialized (extend if needed with data prefetch signals).
 */
export default function AppStartupGate({ children }: PropsWithChildren) {
  const { isLoading } = useAuth();
  const isAppReady = !isLoading;

  // Select loader via env or fallback
  const variant = (import.meta.env.VITE_STARTUP_LOADER as string) || "dots";
  const brand = "JD MARC";

  return (
    <>
      {variant === "bar" && (
        <ProgressBarSplash isReady={isAppReady} brand={brand} />
      )}
      {variant === "logo" && <LogoReveal isReady={isAppReady} brand={brand} />}
      {variant !== "bar" && variant !== "logo" && (
        <MinimalDots isReady={isAppReady} brand={brand} />
      )}
      {isAppReady ? children : null}
    </>
  );
}
