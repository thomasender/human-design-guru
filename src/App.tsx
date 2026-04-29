import { useState } from 'react';
import { FlipCard } from './components/FlipCard';
import { lessons } from './data/lessons';
import './App.css';

function App() {
  const [flippedIds, setFlippedIds] = useState<Set<number>>(new Set());

  const toggleCard = (id: number) => {
    setFlippedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
            10 Lektionen. 10 Tage. <span className="highlight">Ein vollständiges HD-Fundament.</span>
          </h1>
          <p className="intro-text">
            Klicke auf eine Karte, um die Lektion zu lesen. Klicke erneut, um sie zu schließen.
            Jeden Tag eine neue Erkenntnis.
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
            <div
              key={lesson.id}
              className={`flip-on-click ${flippedIds.has(lesson.id) ? 'flipped' : ''}`}
              onClick={() => toggleCard(lesson.id)}
            >
              <FlipCard lesson={lesson} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>🐍 Human Design Guru — Lernpfad für Thomas</p>
        <p className="footer-note">Basierend auf den Lehren von Ra Uru Hu · jovianarchive.com</p>
      </footer>
    </div>
  );
}

export default App;