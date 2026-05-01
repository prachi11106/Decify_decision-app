import { useEffect, useRef } from "react";
import "./About.css";

const steps = [
  {
    number: "01",
    title: "Describe your dilemma",
    description: "Type in the decision you're struggling with — big or small.",
  },
  {
    number: "02",
    title: "Add your options",
    description: "List the choices you're weighing against each other.",
  },
  {
    number: "03",
    title: "Get clarity",
    description: "Decify analyzes and helps you cut through the noise.",
  },
  {
    number: "04",
    title: "Decide confidently",
    description: "Walk away with a clear direction and zero second-guessing.",
  },
];

const cards = [
  {
    icon: "⚡",
    title: "What is Decify?",
    description:
      "Decify is a smart decision-making tool that helps you break down complex choices into clear, actionable outcomes. Stop overthinking — start deciding.",
  },
  {
    icon: "🔍",
    title: "How It Works",
    description:
      "You describe the problem, add your options, and Decify structures the thinking process for you — so logic beats gut feeling every time.",
  },
  {
    icon: "🎯",
    title: "Why It Matters",
    description:
      "Decision fatigue is real. Decify gives you a structured framework so you spend less mental energy on the process and more on living the outcome.",
  },
];

export default function About() {
  const heroRef = useRef(null);
  const cardsRef = useRef([]);
  const stepsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = [
      heroRef.current,
      ...cardsRef.current,
      ...stepsRef.current,
    ].filter(Boolean);

    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero" ref={heroRef}>
        <div className="about-hero-badge">About Decify</div>
        <h1 className="about-hero-title">
          Decisions made
          <span className="about-hero-accent"> effortless</span>
        </h1>
        <p className="about-hero-subtitle">
          A minimal, powerful tool built to eliminate decision paralysis and
          help you move forward with confidence.
        </p>
        <div className="about-hero-divider" />
      </section>

      {/* Cards */}
      <section className="about-cards-section">
        <div className="about-cards-grid">
          {cards.map((card, i) => (
            <div
              key={i}
              className="about-card about-fade-up"
              ref={(el) => (cardsRef.current[i] = el)}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="about-card-icon">{card.icon}</div>
              <h3 className="about-card-title">{card.title}</h3>
              <p className="about-card-desc">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section className="about-steps-section">
        <h2 className="about-section-title">How to Use</h2>
        <p className="about-section-subtitle">
          Four steps to your next clear decision.
        </p>
        <div className="about-steps-list">
          {steps.map((step, i) => (
            <div
              key={i}
              className="about-step about-fade-up"
              ref={(el) => (stepsRef.current[i] = el)}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="about-step-number">{step.number}</div>
              <div className="about-step-content">
                <h4 className="about-step-title">{step.title}</h4>
                <p className="about-step-desc">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="about-step-connector" />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}