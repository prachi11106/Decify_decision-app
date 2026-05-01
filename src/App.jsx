import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./Components/Navbar";
import ErrorBoundary from "./Components/ErrorBoundary";
import Footer from "./Components/Footer";

const Dashboard      = lazy(() => import("./Pages/Dashboard"));
const CreateDecision = lazy(() => import("./Pages/CreateDecision"));
const Result         = lazy(() => import("./Pages/Result"));
const History        = lazy(() => import("./Pages/History"));
const About          = lazy(() => import("./Pages/About"));

function Loader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--ink-3)", fontFamily: "var(--f-body)", fontSize: 14 }}>
      <span className="spinner" /> Loading…
    </div>
  );
}

export default function App() {
  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-body">
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/"        element={<Dashboard />} />
              <Route path="/create"  element={<CreateDecision />} />
              <Route path="/result"  element={<Result />} />
              <Route path="/history" element={<History />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}