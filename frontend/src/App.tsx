import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// general
import NotFound from "./pages/general/NotFound/NotFound";

// one-page stores
import FloorLampRGB from "./pages/one-page/FloorLampRGB";
import Navbar from "./components/navbar/Navbar";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/one-page/floor-lamp-rgb" element={<FloorLampRGB />} />
      </Routes>
    </Router>
  );
};

export default App;
