import React, { useRef, useState, useEffect } from "react";
import "./topbar.css";
import { useNavigate } from "react-router-dom";

const DEFAULT_CATEGORIES = [
  "Experimental",
  "Short fiction/Excerpts",
  "Poetry/Lyrics",
  "Music",
];

export default function TopBar({
  logoSrc,
  isSignedIn = false,
  categories = DEFAULT_CATEGORIES,
}) {
  const [showCategories, setShowCategories] = useState(false);
  const hoverTimer = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !(e.target.closest && e.target.closest(".apyx-nav-item--categories"))
      ) {
        setShowCategories(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const startShowTimer = () => {
    clearTimer();
    hoverTimer.current = setTimeout(() => setShowCategories(true), 300);
  };

  const clearTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };

  const handleMouseLeave = () => {
    clearTimer();
    hoverTimer.current = setTimeout(() => setShowCategories(false), 150);
  };

  const handleCategoryClick = (cat) => {
    setShowCategories(false);
    navigate(`/category/${encodeURIComponent(cat)}`);
  };

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <header className="apyx-topbar">
      <nav className="apyx-nav" role="navigation" aria-label="Main navigation">
        <div className="apyx-nav-left">
          <button
            className="apyx-nav-item"
            onClick={() => handleNavClick("/")}
            aria-label="Home"
          >
            Home
          </button>

          <div
            className="apyx-nav-item apyx-nav-item--categories"
            onMouseEnter={startShowTimer}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="apyx-categories-toggle"
              onClick={() => setShowCategories((s) => !s)}
              aria-haspopup="true"
              aria-expanded={showCategories}
            >
              Categories
            </button>

            <div
              ref={dropdownRef}
              className={`apyx-categories-dropdown ${showCategories ? "visible" : ""}`}
              role="menu"
            >
              {categories.map((c) => (
                <button
                  key={c}
                  role="menuitem"
                  className="apyx-category-item"
                  onClick={() => handleCategoryClick(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button className="apyx-nav-item" onClick={() => handleNavClick("/about")}>
            About
          </button>

          <button className="apyx-nav-item" onClick={() => handleNavClick("/contact")}>
            Contact
          </button>
        </div>

        <div className="apyx-nav-right">
          <div className="apyx-auth-group">
            <button className="apyx-nav-item apyx-auth" onClick={() => handleNavClick("/signin")}>Sign in</button>
            <button className="apyx-nav-item apyx-auth apyx-register" onClick={() => handleNavClick("/signin")}>Register</button>
          </div>

          <div className="apyx-logo-wrap">
            {logoSrc ? (
              <img src={logoSrc} alt="apyx.blog logo" className="apyx-logo" />
            ) : (
              <div className="apyx-logo-placeholder">apyx.blog</div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
