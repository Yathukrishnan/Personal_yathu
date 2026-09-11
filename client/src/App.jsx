import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { fetchContent } from './api.js';
import { fallbackContent } from './fallbackContent.js';
import { useRevealObserver } from './hooks.js';
import Navbar from './components/Navbar.jsx';
import MenuOverlay from './components/MenuOverlay.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ExpertisePage from './pages/ExpertisePage.jsx';
import WorkPage from './pages/WorkPage.jsx';
import JourneyPage from './pages/JourneyPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Re-arms scroll reveals after every route change. */
function RevealSync() {
  const { pathname } = useLocation();
  useRevealObserver(pathname);
  return null;
}

export default function App() {
  // Start with bundled content immediately (no boot delay), then hydrate
  // from the API if it's reachable.
  const [content, setContent] = useState(fallbackContent);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchContent(fallbackContent).then((data) => {
      if (data) setContent(data);
    });
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RevealSync />
      <MenuOverlay profile={content.profile} open={menuOpen} onClose={closeMenu} />
      <Navbar menuOpen={menuOpen} onToggleMenu={toggleMenu} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage content={content} />} />
          <Route path="/about" element={<AboutPage content={content} />} />
          <Route path="/expertise" element={<ExpertisePage content={content} />} />
          <Route path="/work" element={<WorkPage content={content} />} />
          <Route path="/journey" element={<JourneyPage content={content} />} />
          <Route path="/experience" element={<Navigate to="/journey" replace />} />
          <Route path="/contact" element={<ContactPage content={content} />} />
          <Route path="*" element={<HomePage content={content} />} />
        </Routes>
      </main>
      <Footer profile={content.profile} />
    </BrowserRouter>
  );
}
