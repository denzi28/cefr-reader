import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  // The parent PIN gates switching *back* from a child profile to the
  // parent dashboard (Netflix-style profile lock). Stored in Supabase
  // Auth's own user_metadata rather than a new table - it's a UX gate to
  // stop a curious kid from wandering into settings, not a security
  // boundary against another adult with access to the device, so a
  // plain 4-digit code is enough and needs no separate hashing scheme.
  hasParentPin: boolean;
  setParentPin: (pin: string) => Promise<{ error: string | null }>;
  verifyParentPin: (pin: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function signUpWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error: error?.message ?? null };
  }

  async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  const user = session?.user ?? null;

  async function setParentPin(pin: string) {
    const { error } = await supabase.auth.updateUser({ data: { parent_pin: pin } });
    return { error: error?.message ?? null };
  }

  function verifyParentPin(pin: string) {
    return !!user?.user_metadata?.parent_pin && user.user_metadata.parent_pin === pin;
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        signOut,
        hasParentPin: !!user?.user_metadata?.parent_pin,
        setParentPin,
        verifyParentPin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
