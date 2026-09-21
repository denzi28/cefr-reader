import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import type { ChildProfile } from "../data/profiles";
import { listProfiles } from "../data/profiles";

const STORAGE_KEY = "cefr-reader:activeProfileId";

interface ActiveProfileContextValue {
  activeProfile: ChildProfile | null;
  setActiveProfileId: (id: number | null) => void;
  // Re-fetches the active profile's own row - used after a write that
  // changes it server-side but isn't reflected in local state yet, e.g.
  // unlocking the next level after passing a level-up quiz.
  refreshActiveProfile: () => void;
}

const ActiveProfileContext = createContext<ActiveProfileContextValue | null>(null);

export function ActiveProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeProfile, setActiveProfile] = useState<ChildProfile | null>(null);

  useEffect(() => {
    if (!user) {
      setActiveProfile(null);
      return;
    }
    // A per-viewer convenience (remembering which child was reading last) -
    // never state that must be shared or reliably persisted, so
    // localStorage is fine here even though it's per-browser only.
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // ignore - private browsing / blocked storage
    }
    const storedId = stored ? Number(stored) : null;
    listProfiles()
      .then((profiles) => {
        const match = storedId ? profiles.find((p) => p.id === storedId) : null;
        setActiveProfile(match ?? null);
      })
      .catch(() => setActiveProfile(null));
  }, [user]);

  function setActiveProfileId(id: number | null) {
    try {
      if (id === null) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, String(id));
    } catch {
      // ignore
    }
    if (id === null) {
      setActiveProfile(null);
      return;
    }
    listProfiles()
      .then((profiles) => setActiveProfile(profiles.find((p) => p.id === id) ?? null))
      .catch(() => setActiveProfile(null));
  }

  function refreshActiveProfile() {
    if (!activeProfile) return;
    const id = activeProfile.id;
    listProfiles()
      .then((profiles) => {
        const match = profiles.find((p) => p.id === id);
        if (match) setActiveProfile(match);
      })
      .catch(() => {});
  }

  return (
    <ActiveProfileContext.Provider value={{ activeProfile, setActiveProfileId, refreshActiveProfile }}>
      {children}
    </ActiveProfileContext.Provider>
  );
}

export function useActiveProfile() {
  const ctx = useContext(ActiveProfileContext);
  if (!ctx) throw new Error("useActiveProfile must be used within ActiveProfileProvider");
  return ctx;
}
