import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LevelsPage } from "./pages/LevelsPage";
import { LevelBooksPage } from "./pages/LevelBooksPage";
import { ReaderPage } from "./pages/ReaderPage";

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
          path="/books/:id"
          element={
            <motion.div {...pageTransition} transition={{ duration: 0.25, ease: "easeOut" }}>
              <ReaderPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fef9f0]">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
