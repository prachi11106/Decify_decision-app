import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { err: null };
  static getDerivedStateFromError(e) { return { err: e.message }; }
  componentDidCatch(e, info) { console.error("Decify error:", e, info); }
  render() {
    if (this.state.err) return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"16px", textAlign:"center", padding:"24px", background:"var(--bg)", fontFamily:"var(--f-body)" }}>
        <span style={{ fontSize:"2.5rem" }}>😬</span>
        <h2 style={{ fontFamily:"var(--f-head)", color:"var(--ink)" }}>Something broke</h2>
        <p style={{ color:"var(--ink-3)", fontSize:"14px", maxWidth:"340px" }}>{this.state.err}</p>
        <button className="btn btn-rose" onClick={() => this.setState({ err: null })}>Try again</button>
      </div>
    );
    return this.props.children;
  }
}
