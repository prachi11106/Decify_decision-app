import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";

const Dashboard      = lazy(() => import("./pages/Dashboard"));
const CreateDecision = lazy(() => import("./pages/CreateDecision"));
const Result         = lazy(() => import("./pages/Result"));
const History        = lazy(() => import("./pages/History"));

function Loader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--ink-3)", fontFamily: "var(--f-body)", fontSize: 14 }}>
      <span className="spinner" /> Loading…
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
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
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}