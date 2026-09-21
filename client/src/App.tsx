import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LevelsPage } from "./pages/LevelsPage";
import { LevelBooksPage } from "./pages/LevelBooksPage";
import { ReaderPage } from "./pages/ReaderPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#fef9f0]">
        <Routes>
          <Route path="/" element={<LevelsPage />} />
          <Route path="/levels/:level" element={<LevelBooksPage />} />
          <Route path="/books/:id" element={<ReaderPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
