import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StyleTransferPage from "./components/StyleTransferPage";
import GalleryPage from "./components/GalleryPage";
import "./App.css";

function App() {
  const [gallery, setGallery] = useState([]);

  return (
    <Router>
      <div className="App">
        <header>
          <h1 className="title">Artify Your Image</h1>
          <nav>
            <Link to="/" className="nav-link">Style Transfer</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
          </nav>
        </header>
        <Routes>
          <Route
            path="/"
            element={<StyleTransferPage gallery={gallery} setGallery={setGallery} />}
          />
          <Route
            path="/gallery"
            element={<GalleryPage gallery={gallery} setGallery={setGallery} />}
          />
        </Routes>
        <footer>
          <p>© 2024 Artify. Unleash Your Creativity.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
