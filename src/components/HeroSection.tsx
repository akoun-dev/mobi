import React, { memo } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import './HeroSection.css';

interface HeroSectionProps {
  onCompareClick: () => void;
}

type Tile = {
  icon: string;
  title: string;
  value: string;   // montant/texte accentué sur 2e ligne
  accent: string;  // suffixe atténué (ex: FCFA/an)
  action?: () => void;
  href?: string;
};

const tiles: Tile[] = [
  { icon: '🚗', title: 'Assurance auto', value: '396 000 FCFA/an', accent: "d’économies" },
  { icon: '🏍️', title: 'Assurance moto', value: '222 000 FCFA/an', accent: "d’économies" },
];

const HeroTile = memo(function HeroTile({ tile, onClick }: { tile: Tile; onClick: () => void }) {
  return (
    <button
      type="button"
      className="hero-tile hero-tile--clickable"
      onClick={onClick}
      aria-label={`Ouvrir ${tile.title}`}
    >
      <div className="hero-tile-icon" aria-hidden>{tile.icon}</div>
      <div className="hero-tile-texts">
        <div className="hero-tile-title">{tile.title}</div>
        <div className="hero-tile-sub">
          <span className="accent">{tile.value}</span>
          <span className="muted"> {tile.accent}</span>
        </div>
      </div>
    </button>
  );
});

const HeroSection: React.FC<HeroSectionProps> = ({ onCompareClick }) => {
  const handleClick = (tile?: Tile) => {
    if (tile?.action) return tile.action();
    onCompareClick();
  };

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-left">
          <div className="hero-kicker" role="note" aria-label="Accroche">
            <Sparkles size={18} aria-hidden />
            <span>Avec NOLI, comparer, c’est gagner</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            Comparez, choisissez, économisez
          </h1>

          <div className="hero-tiles" role="list">
            {tiles.map((tile) => (
              <div key={tile.title} role="listitem">
                <HeroTile tile={tile} onClick={() => handleClick(tile)} />
              </div>
            ))}
          </div>

          <a className="hero-more" href="#" onClick={(e) => e.preventDefault()}>
            En savoir plus
            <ChevronRight size={16} aria-hidden />
          </a>
        </div>

        <div className="hero-right">
          <div className="hero-event" aria-labelledby="hero-event-title">
            <div className="hero-event-badge">Évènement</div>
            <p id="hero-event-title" className="hero-event-text">
              Partenaire d’un grand évènement automobile. Tentez de gagner des invitations VIP et un baptême copilote !
            </p>
            <a className="hero-event-link" href="#" onClick={(e) => e.preventDefault()}>
              En savoir plus sur l’évènement →
            </a>
          </div>

          <div className="hero-visual" role="img" aria-label="Visuel promotionnel">
            <div className="hero-visual-mark">NOLI</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);