import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import 'tippy.js/dist/tippy.css';

import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import { GameStateProvider } from "./context/GameStateContext";
import { WorkspaceProvider } from "./context/AnchorContext";
import { SoundProvider } from "./context/SoundContext";

const App: React.FC = () => {
  return (
    <WorkspaceProvider>
      <GameStateProvider>
        <SoundProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GamePage />} />
            </Routes>
          </Router>
        </SoundProvider>
      </GameStateProvider>
    </WorkspaceProvider>
  );
};

export default App;
