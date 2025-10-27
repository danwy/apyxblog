import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import DocumentPage from './pages/DocumentPage';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import { initDemoData, getBackground } from './utils/storage';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    initDemoData();
    const bg = getBackground();
    if (bg) {
      document.documentElement.style.setProperty('--apyx-bg-image', `url(${bg})`);
    }
  }, []);

  return (
    <div className="app-root">
      <TopBar
        logoSrc="/logo.png"
        onNavigate={(path) => navigate(path)}
      />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/document/:id" element={<DocumentPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}