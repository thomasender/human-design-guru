import type { Lesson } from '../data/lessons';
import './FlipCard.css';

interface FlipCardProps {
  lesson: Lesson;
  isFlipped: boolean;
  onClick: () => void;
}

export function FlipCard({ lesson, isFlipped, onClick }: FlipCardProps) {
  return (
    <div
      className={`card-wrapper${isFlipped ? ' flipped' : ''}`}
      onClick={onClick}
    >
      <div className="card-inner">
        {/* Front — hidden, shows topic */}
        <div className="card-face card-front">
          <div className="card-back-design">
            <div className="lesson-badge">Lektion {lesson.day}</div>
            <div className="card-icon">{lesson.icon}</div>
            <h2 className="card-title">{lesson.title}</h2>
            <p className="card-subtitle">{lesson.subtitle}</p>
          </div>
        </div>

        {/* Back — revealed, shows content */}
        <div className="card-face card-back">
          <div className="lesson-header">
            <span className="lesson-day-badge">Tag {lesson.day}</span>
            <span className="lesson-icon">{lesson.icon}</span>
            <h2 className="lesson-title">{lesson.title}</h2>
            <p className="lesson-subtitle">{lesson.subtitle}</p>
          </div>
          <div className="lesson-content">
            {lesson.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) {
                return <h3 key={i} className="content-h2">{line.replace('## ', '')}</h3>;
              }
              if (line.startsWith('### ')) {
                return <h4 key={i} className="content-h3">{line.replace('### ', '')}</h4>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="content-bold">{line.replace(/\*\*/g, '')}</p>;
              }
              if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.+?)\*\* —? ?(.*)/);
                if (match) {
                  return (
                    <p key={i} className="content-list-item">
                      <strong>{match[1]}</strong>{match[2] ? ` — ${match[2]}` : ''}
                    </p>
                  );
                }
              }
              if (line.startsWith('- ')) {
                return <p key={i} className="content-list">{line.replace('- ', '• ')}</p>;
              }
              if (line === '---') {
                return <hr key={i} className="content-divider" />;
              }
              if (line.trim() === '') {
                return <br key={i} />;
              }
              return <p key={i} className="content-p">{line}</p>;
            })}
          </div>
          <div className="lesson-footer">
            <span className="footer-emoji">🌿</span>
            <span className="footer-brand">Human Design Guru</span>
          </div>
        </div>
      </div>
    </div>
  );
}