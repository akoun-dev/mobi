import React, { memo } from 'react';
import './Reviews.css';

type Review = {
  author: string;
  date: string;
  source: string;
  rating: number; // 1..5
  text: string;
};

const reviews: Review[] = [
  {
    author: 'Mariam · Yopougon',
    date: '28/06/2025',
    source: 'Avis Vérifiés',
    rating: 5,
    text: 'Très rapide et clair. J’ai obtenu une offre moins chère pour mon assurance auto.',
  },
  {
    author: 'Koffi · Cocody',
    date: '30/06/2025',
    source: 'Avis Vérifiés',
    rating: 4.5,
    text: 'Simplicité et rapidité dans la recherche. Bon comparatif, je recommande.',
  },
  {
    author: 'Aïcha · Marcory',
    date: '03/07/2025',
    source: 'Avis Vérifiés',
    rating: 5,
    text: "C'est très bien, économiser avec NOLI c'est ce qui fait toujours plaisir.",
  },
];

const Stars: React.FC<{ value: number }> = ({ value }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const items = Array.from({ length: 5 }).map((_, i) => {
    if (i < full) return <span key={i} className="star full">★</span>;
    if (i === full && half) return <span key={i} className="star half">★</span>;
    return <span key={i} className="star">★</span>;
  });
  return <div className="reviews-stars" aria-label={`${value} sur 5`}>{items}</div>;
};

const ReviewCard = memo(function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="review-card" aria-label={`Avis de ${r.author}`}>
      <Stars value={r.rating} />
      <p className="review-text">“{r.text}”</p>
      <div className="review-meta">
        <span className="review-author">{r.author}</span>
        <span className="dot" aria-hidden>•</span>
        <span className="review-date">{r.date}</span>
        <span className="dot" aria-hidden>•</span>
        <span className="review-source">{r.source}</span>
      </div>
    </article>
  );
});

const Reviews: React.FC = () => {
  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="reviews-title">Plus de 9,9 millions d’utilisateurs nous font confiance</h2>
      <div className="reviews-grid" role="list">
        {reviews.map((r) => (
          <div key={r.author} role="listitem">
            <ReviewCard r={r} />
          </div>
        ))}
      </div>
      <div className="reviews-cta">
        <a href="#" onClick={(e) => e.preventDefault()} className="reviews-link" aria-label="Voir plus d’avis clients">
          Voir plus d’avis clients →
        </a>
      </div>
    </section>
  );
};

export default memo(Reviews);