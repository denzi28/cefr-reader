import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Supabase's client exchanges the OAuth redirect code for a session
// automatically on load; this page just waits for that to land, then
// moves on to the dashboard.
export function AuthCallbackPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      navigate(session ? "/dashboard" : "/login", { replace: true });
    }
  }, [loading, session, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-body text-stone-400">Signing you in…</p>
    </div>
  );
}
