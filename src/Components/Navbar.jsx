import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDecision } from "../Context/DecisionContext";
import logoImg from "../assets/Decify-logo.png";
import { NavLink } from "react-router-dom";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "New decision", path: "/create" },
  { label: "History", path: "/history" },
  { label: "About", path: "/about" }, // ← ADDED
];

export default function Navbar() {
  const { dark, toggleDark } = useDecision();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="nav">
        {/* Brand */}
        <div className="nav-brand" onClick={() => handleNav("/")}>
          <div className="nav-logo-bg">
            <img
              src={logoImg}
              alt="Decify"
              className="nav-logo-img"
            />
          </div>
          <span className="nav-name">Decify</span>
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          {LINKS.map(l => (
            <button
              key={l.path}
              className={`nav-btn ${pathname === l.path ? "active" : ""}`}
              onClick={() => handleNav(l.path)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="nav-right">
          <button className="theme-btn" onClick={toggleDark} title="Toggle theme">
            {dark ? "☀️" : "🌙"}
          </button>
          <button
            className="btn btn-rose btn-sm nav-new-btn"
            onClick={() => handleNav("/create")}
          >
            + New
          </button>

          {/* Hamburger — mobile only */}
          <button
            className={`hamburger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="ham-line" />
            <span className="ham-line" />
            <span className="ham-line" />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu drawer */}
      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
        <div className="mobile-menu-inner">

          {/* Header */}
          <div className="mobile-menu-header">
            <div className="nav-brand" onClick={() => handleNav("/")}>
              <div className="nav-logo-bg">
                <img
                  src={logoImg}
                  alt="Decify"
                  className="nav-logo-img"
                />
              </div>
              <span className="nav-name">Decify</span>
            </div>
            <button
              className="mobile-menu-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Links */}
          <nav className="mobile-nav-links">
            {LINKS.map((l, i) => (
              <button
                key={l.path}
                className={`mobile-nav-btn ${pathname === l.path ? "active" : ""}`}
                onClick={() => handleNav(l.path)}
                style={{ animationDelay: menuOpen ? `${i * 0.06}s` : "0s" }}
              >
                <span className="mobile-nav-label">{l.label}</span>
                <span className="mobile-nav-arrow">→</span>
              </button>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="mobile-menu-footer">
            <button
              className="btn btn-rose"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => handleNav("/create")}
            >
              + Start a new decision
            </button>
            <button className="mobile-theme-btn" onClick={toggleDark}>
              {dark ? "☀️ Switch to light mode" : "🌙 Switch to dark mode"}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}