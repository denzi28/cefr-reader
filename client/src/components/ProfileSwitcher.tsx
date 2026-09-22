import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { useActiveProfile } from "../auth/ActiveProfileContext";
import { listProfiles, type ChildProfile } from "../data/profiles";
import { ParentPinModal } from "./ParentPinModal";
import { SignOutConfirmModal } from "./SignOutConfirmModal";

// A Netflix-style "who's reading?" switcher: tapping the current identity
// slides up a list of Parent + every child profile. Picking a child just
// switches (no lock, matches the old "Read as X" flow). Picking Parent
// while currently reading as a child asks for the PIN first - that's the
// fix for not being able to get back to Parent mode once in a child's
// profile, since nothing used to ever clear activeProfile except signing
// out entirely.
function PowerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 3v9" />
      <path d="M6.6 6.6a8 8 0 1 0 10.8 0" />
    </svg>
  );
}

export function ProfileSwitcher() {
  const { user, loading, signOut } = useAuth();
  const { activeProfile, setActiveProfileId } = useActiveProfile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [signOutConfirmOpen, setSignOutConfirmOpen] = useState(false);

  useEffect(() => {
    if (!user || !open) return;
    listProfiles()
      .then(setProfiles)
      .catch(() => setProfiles([]));
  }, [user, open]);

  // Every page this renders on is behind RequireAuth, so there's no
  // signed-out state to show here.
  if (loading || !user) return null;

  async function handleConfirmSignOut() {
    setSignOutConfirmOpen(false);
    await signOut();
    navigate("/");
  }

  function handleSelectChild(profile: ChildProfile) {
    setActiveProfileId(profile.id);
    setOpen(false);
    navigate("/levels");
  }

  function handleSelectParent() {
    if (!activeProfile) {
      setOpen(false);
      navigate("/dashboard");
      return;
    }
    setPinModalOpen(true);
  }

  function handleUnlock() {
    setActiveProfileId(null);
    setPinModalOpen(false);
    setOpen(false);
    navigate("/dashboard");
  }

  return (
    <>
      {/* Sits in normal flow rather than fixed to the corner - overlaid on
          a narrow phone it covered the page heading underneath it. */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border-2 border-stone-200 bg-white px-4 py-2 font-body text-sm font-extrabold text-stone-600 shadow-sm transition hover:border-sky-300 hover:text-sky-600"
        >
          {activeProfile ? (
            <>
              <span>{activeProfile.avatar_emoji}</span>
              {activeProfile.name}
            </>
          ) : (
            <>🧑 Parent</>
          )}
          <span className="text-stone-400">▾</span>
        </button>

        {/* Confirms first, but deliberately not behind the parent PIN - that
            lock exists to keep a child out of the dashboard, not to keep
            anyone signed in. */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => setSignOutConfirmOpen(true)}
          aria-label="Log out"
          title="Log out"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-stone-200 bg-white text-stone-400 shadow-sm transition hover:border-rose-300 hover:text-rose-500"
        >
          <PowerIcon />
        </motion.button>
      </div>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                className="fixed inset-0 z-30 bg-stone-900/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:pb-6"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 60 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
              >
                <div className="w-full max-w-md rounded-3xl border-4 border-stone-200 bg-white p-3 shadow-xl">
                  <div className="flex items-center justify-between px-2 pb-2 pt-1">
                    <p className="font-body text-xs font-extrabold uppercase tracking-wide text-stone-400">
                      Who's reading?
                    </p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close"
                      className="shrink-0 rounded-full bg-stone-100 px-3 py-1 font-bold text-stone-500 hover:bg-stone-200"
                    >
                      ✕
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSelectParent}
                    className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-stone-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xl">
                      🧑
                    </span>
                    <span className="flex-1 font-body font-extrabold text-stone-800">Parent</span>
                    {activeProfile ? (
                      <span className="text-stone-400">🔒</span>
                    ) : (
                      <span className="font-body text-xs font-extrabold text-sky-500">Current</span>
                    )}
                  </button>

                  {profiles.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectChild(p)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-stone-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xl">
                        {p.avatar_emoji}
                      </span>
                      <span className="flex-1 font-body font-extrabold text-stone-800">{p.name}</span>
                      {activeProfile?.id === p.id && (
                        <span className="font-body text-xs font-extrabold text-sky-500">Current</span>
                      )}
                    </button>
                  ))}

                  {profiles.length === 0 && (
                    <p className="px-3 py-2 font-body text-sm text-stone-400">
                      No child profiles yet - add one from the Parent dashboard.
                    </p>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <ParentPinModal open={pinModalOpen} onClose={() => setPinModalOpen(false)} onUnlock={handleUnlock} />

      <SignOutConfirmModal
        open={signOutConfirmOpen}
        onCancel={() => setSignOutConfirmOpen(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}
