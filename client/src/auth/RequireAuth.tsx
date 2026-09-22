import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// The library now sits behind the front door: a visitor has to sign up or
// sign in before any of it is reachable, including by typing a URL
// directly. Waits for the auth lookup to resolve first, so a signed-in
// reader refreshing the page isn't bounced out mid-load.
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-10 text-center font-body text-stone-400">Loading…</p>;
  }
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}
