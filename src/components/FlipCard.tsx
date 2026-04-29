import type { Lesson } from '../data/lessons';
import './FlipCard.css';

interface FlipCardProps {
  lesson: Lesson;
  isFlipped: boolean;
  onClick: () => void;
}

export function FlipCard({ lesson, onClick }: FlipCardProps) {
  return (
    <div className="card-wrapper" onClick={onClick}>
      <div className="card-inner">
        <div className="card-face card-front">
          <div className="card-back-design">
            <div className="lesson-badge">Lektion {lesson.day}</div>
            <div className="card-icon">{lesson.icon}</div>
            <h2 className="card-title">{lesson.title}</h2>
            <p className="card-subtitle">{lesson.subtitle}</p>
            <span className="flip-hint">Tippe zum Öffnen</span>
          </div>
        </div>
      </div>
    </div>
  );
}