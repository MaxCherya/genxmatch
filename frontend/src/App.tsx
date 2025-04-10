import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// general
import NotFound from "./pages/general/NotFound/NotFound";

// one-page stores
import FloorLampRGB from "./pages/one-page/FloorLampRGB";
import Navbar from "./components/navbar/Navbar";
import OrderConfirmation from "./pages/general/OrderConfirmation/OrderConfirmation";
import MoonProjectorUSB from "./pages/one-page/MoonProjectorUSB";

const App: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <Router>
      <Navbar isFullscreen={isFullscreen} />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/one-page/floor-lamp-rgb" element={<FloorLampRGB setIsFullscreen={setIsFullscreen} isFullscreen={isFullscreen} />} />
        <Route path="/one-page/moon-projector-usb" element={<MoonProjectorUSB setIsFullscreen={setIsFullscreen} isFullscreen={isFullscreen} />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Router>
  );
};

export default App;
