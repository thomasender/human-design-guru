import { useState, useEffect, useCallback } from "react";
import { FlipCard } from "./components/FlipCard";
import { lessons } from "./data/lessons";
import "./App.css";

type OverlayPhase = "closed" | "entering" | "open" | "exiting";

function App() {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [overlayPhase, setOverlayPhase] = useState<OverlayPhase>("closed");

  const closeOverlay = useCallback(() => {
    setOverlayPhase("exiting");
  }, []);

  // After exit animation completes, truly close
  useEffect(() => {
    if (overlayPhase === "exiting") {
      const timer = setTimeout(() => {
        setActiveLesson(null);
        setOverlayPhase("closed");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [overlayPhase]);

  // When card is clicked, start enter animation
  const handleCardClick = useCallback(
    (lessonId: number) => {
      if (overlayPhase === "closed" || overlayPhase === "exiting") {
        setActiveLesson(lessonId);
        // Force reflow so animation restarts
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setOverlayPhase("entering");
          });
        });
      } else if (overlayPhase === "open") {
        closeOverlay();
      }
    },
    [overlayPhase, closeOverlay],
  );

  // After enter animation, switch to 'open'
  useEffect(() => {
    if (overlayPhase === "entering") {
      const timer = setTimeout(() => setOverlayPhase("open"), 800);
      return () => clearTimeout(timer);
    }
  }, [overlayPhase]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && overlayPhase === "open") closeOverlay();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [overlayPhase, closeOverlay]);

  // Prevent body scroll when overlay open
  useEffect(() => {
    const isVisible =
      overlayPhase === "entering" ||
      overlayPhase === "open" ||
      overlayPhase === "exiting";
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayPhase]);

  const showOverlay = overlayPhase !== "closed";

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-snake">🐍</span>
            <span className="logo-text">
              Human Design <span className="logo-guru">Guru</span>
            </span>
          </div>
          <p className="header-subtitle">
            Dein täglicher Weg zum HD-Experten — eine Lektion nach der anderen
          </p>
        </div>
      </header>

      {/* Intro */}
      <section className="intro">
        <div className="intro-inner">
          <h1 className="intro-title">
            10 Lektionen. 10 Tage.{" "}
            <span className="highlight">Ein vollständiges HD-Fundament.</span>
          </h1>
          <p className="intro-text">
            Klicke auf eine Karte, um die Lektion zu lesen. Schließe mit einem
            Klick außerhalb oder auf ✕.
          </p>
          <div className="intro-hint">
            <span className="hint-icon">👆</span>
            <span>Wähle eine Karte und teste dein Wissen</span>
          </div>
        </div>
      </section>

      {/* Cards Grid */}
      <main className="cards-section">
        <div className="cards-grid">
          {lessons.map((lesson) => (
            <FlipCard
              key={lesson.id}
              lesson={lesson}
              isFlipped={activeLesson === lesson.id}
              onClick={() => handleCardClick(lesson.id)}
            />
          ))}
        </div>
      </main>

      {/* Overlay */}
      {showOverlay &&
        activeLesson !== null &&
        (() => {
          const lesson = lessons.find((l) => l.id === activeLesson)!;
          return (
            <div
              className={`overlay ${overlayPhase === "entering" || overlayPhase === "open" ? "overlay-visible" : ""}`}
              onClick={(e) => {
                if (e.target === e.currentTarget && overlayPhase === "open")
                  closeOverlay();
              }}
            >
              <div className={`overlay-card card-${overlayPhase}`}>
                {/* Close button */}
                <button
                  className="overlay-close"
                  onClick={closeOverlay}
                  aria-label="Schließen"
                >
                  ✕
                </button>

                {/* Card content */}
                <div className="overlay-inner">
                  <div className="overlay-header">
                    <span className="overlay-badge">Lektion {lesson.day}</span>
                    <span className="overlay-icon">{lesson.icon}</span>
                    <h2 className="overlay-title">{lesson.title}</h2>
                    <p className="overlay-subtitle">{lesson.subtitle}</p>
                  </div>
                  <div className="overlay-content">
                    {lesson.content.split("\n").map((line, i) => {
                      if (line.startsWith("## ")) {
                        return (
                          <h3 key={i} className="content-h2">
                            {line.replace("## ", "")}
                          </h3>
                        );
                      }
                      if (line.startsWith("### ")) {
                        return (
                          <h4 key={i} className="content-h3">
                            {line.replace("### ", "")}
                          </h4>
                        );
                      }
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return (
                          <p key={i} className="content-bold">
                            {line.replace(/\*\*/g, "")}
                          </p>
                        );
                      }
                      if (line.startsWith("- **")) {
                        const match = line.match(/- \*\*(.+?)\*\* —? ?(.*)/);
                        if (match) {
                          return (
                            <p key={i} className="content-list-item">
                              <strong>{match[1]}</strong>
                              {match[2] ? ` — ${match[2]}` : ""}
                            </p>
                          );
                        }
                      }
                      if (line.startsWith("- ")) {
                        return (
                          <p key={i} className="content-list">
                            {line.replace("- ", "• ")}
                          </p>
                        );
                      }
                      if (line === "---") {
                        return <hr key={i} className="content-divider" />;
                      }
                      if (line.trim() === "") {
                        return <br key={i} />;
                      }
                      // Link to next lesson
                      const nextMatch = line.match(
                        /^🔮 \*\*Nächster Insight\*\*: (.+)/,
                      );
                      if (nextMatch && lesson.id < lessons.length) {
                        const nextLesson = lessons[lesson.id];
                        return (
                          <p key={i} className="next-insight">
                            <button
                              className="next-insight-btn"
                              onClick={() => {
                                setActiveLesson(nextLesson.id);
                                setOverlayPhase("entering");
                              }}
                            >
                              🔮 {nextMatch[1]}
                            </button>
                          </p>
                        );
                      }
                      return (
                        <p key={i} className="content-p">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                  <div className="overlay-footer">
                    <span>🌿</span>
                    <span className="overlay-brand">Human Design Guru</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Footer */}
      <footer className="footer">
        <p>🐍 Human Design Guru — Lernpfad für Thomas</p>
        <p className="footer-note">
          Basierend auf den Lehren von Ra Uru Hu · jovianarchive.com
        </p>
      </footer>
    </div>
  );
}

export default App;

