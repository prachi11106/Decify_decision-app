import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/decify-logo.png";

const NAV_PRODUCT = [
  { label: "Home",         path: "/"       },
  { label: "New decision", path: "/create" },
  { label: "History",      path: "/history"},
  { label: "How it works", path: "/"       },
];

const NAV_COMPANY = [
  { label: "About",    path: "/" },
  { label: "Blog",     path: "/" },
  { label: "Careers",  path: "/" },
  { label: "Press kit",path: "/" },
  { label: "Contact",  path: "/" },
];

const SOCIALS = [
  {
    label: "GitHub",
    svg: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "Twitter",
    svg: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 4l16 16M4 20L20 4"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    svg: (
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const navigate = useNavigate();
  const [email,      setEmail]      = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">

      {/* Top accent line */}
      <div className="footer-accent-line" />

      <div className="footer-inner">

        {/* ── Newsletter stripe ── */}
        <div className="footer-newsletter">
          <div>
            <h4 className="footer-newsletter-title">Stay in the loop.</h4>
            <p className="footer-newsletter-sub">
              Product updates, design notes, and the occasional deep-dive — no noise.
            </p>
          </div>
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="footer-newsletter-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={subscribed}
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              className="footer-newsletter-btn"
              style={subscribed ? { background: "var(--ok)", color: "#fff" } : {}}
            >
              {subscribed ? "✓ Subscribed" : "Subscribe →"}
            </button>
          </form>
        </div>

        {/* ── Main grid ── */}
        <div className="footer-grid">

          {/* Brand col */}
          <div className="footer-brand">
            <button
              className="footer-logo"
              onClick={() => navigate("/")}
              aria-label="Decify home"
            >
              <img src={logoImg} alt="Decify" className="footer-logo-mark" />
              <span className="footer-logo-name">Decify</span>
            </button>

            <p className="footer-brand-desc">
              A weighted decision matrix tool that brings clarity to the choices that keep you up at night.
            </p>

            <div className="footer-badge">
              <span className="footer-badge-dot" />
              All systems operational
            </div>
          </div>

          {/* Product links */}
          <div className="footer-col">
            <p className="footer-col-title">Product</p>
            <ul className="footer-col-links">
              {NAV_PRODUCT.map(l => (
                <li key={l.label}>
                  <button onClick={() => navigate(l.path)} className="footer-link">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div className="footer-col">
            <p className="footer-col-title">Company</p>
            <ul className="footer-col-links">
              {NAV_COMPANY.map(l => (
                <li key={l.label}>
                  <button onClick={() => navigate(l.path)} className="footer-link">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + social */}
          <div className="footer-col">
            <p className="footer-col-title">Get in touch</p>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="footer-contact-text">
                <span className="footer-contact-label">Email</span>
                <a href="mailto:hello@decify.app" className="footer-contact-value">
                  hello@decify.app
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="footer-contact-text">
                <span className="footer-contact-label">Based in</span>
                <span className="footer-contact-value">Faridabad, India</span>
              </div>
            </div>

            <p className="footer-col-title" style={{ marginTop: 24 }}>Follow us</p>
            <div className="footer-social-row">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href="#"
                  className="footer-social-btn"
                  aria-label={s.label}
                  title={s.label}
                  onClick={e => e.preventDefault()}
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

        </div>{/* /grid */}

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} <strong>Decify</strong>. Crafted with intention.
          </p>
          <ul className="footer-legal">
            <li><button className="footer-link" onClick={() => navigate("/")}>Privacy policy</button></li>
            <li><span className="footer-divider">·</span></li>
            <li><button className="footer-link" onClick={() => navigate("/")}>Terms of use</button></li>
            <li><span className="footer-divider">·</span></li>
            <li><button className="footer-link" onClick={() => navigate("/")}>Cookie settings</button></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}