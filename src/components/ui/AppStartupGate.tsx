import { PropsWithChildren } from "react";
import Loader from "@/components/ui/Loader";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Displays the premium loader until the app is ready.
 * Adjust readiness criteria to your app: auth initialized, routes ready, initial data fetched, etc.
 */
export default function AppStartupGate({ children }: PropsWithChildren) {
  const { isLoading } = useAuth();
  // Refine this to your exact boot signal if needed
  const isAppReady = !isLoading;

  return (
    <>
      <Loader isReady={isAppReady} brand="JD MARC" />
      {isAppReady ? children : null}
    </>
  );
}
