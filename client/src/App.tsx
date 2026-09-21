import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./auth/AuthContext";
import { ActiveProfileProvider } from "./auth/ActiveProfileContext";
import { LevelsPage } from "./pages/LevelsPage";
import { LevelBooksPage } from "./pages/LevelBooksPage";
import { LevelUpQuizPage } from "./pages/LevelUpQuizPage";
import { LevelQuizReviewPage } from "./pages/LevelQuizReviewPage";
import { ReaderPage } from "./pages/ReaderPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DashboardPage } from "./pages/DashboardPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <LevelsPage />
            </motion.div>
          }
        />
        <Route
          path="/levels/:level"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <LevelBooksPage />
            </motion.div>
          }
        />
        <Route
          path="/levels/:level/level-up-quiz"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <LevelUpQuizPage />
            </motion.div>
          }
        />
        <Route
          path="/levels/:level/level-up-quiz/review"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <LevelQuizReviewPage />
            </motion.div>
          }
        />
        <Route
          path="/books/:id"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <ReaderPage />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <LoginPage />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <SignupPage />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <DashboardPage />
            </motion.div>
          }
        />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActiveProfileProvider>
          <div className="min-h-screen bg-[#fef9f0]">
            <AnimatedRoutes />
          </div>
        </ActiveProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
