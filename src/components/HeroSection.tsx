import React from 'react';
import { Sparkles } from 'lucide-react';
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

const HeroSection: React.FC<HeroSectionProps> = ({ onCompareClick }) => {
  const handleClick = (tile?: Tile) => {
    if (tile?.action) return tile.action();
    onCompareClick();
  };

  return (
    <section className="hero-section">
      <div className="hero-grid">
        {/* Colonne gauche: titre + 6 cartes */}
        <div className="hero-left">
          <div className="hero-kicker">
            <Sparkles size={18} />
            <span>Avec NOLI, comparer, c’est gagner</span>
          </div>

          <h1 className="hero-title">
            Comparez, choisissez, économisez
          </h1>

          {/* Six cartes compactes, disposition type lesfurets */}
          <div className="hero-tiles hero-tiles--six">
            {tiles.map((tile, idx) => (
              <button
                key={idx}
                type="button"
                className="hero-tile hero-tile--clickable"
                onClick={() => handleClick(tile)}
                aria-label={`Ouvrir ${tile.title}`}
              >
                <div className="hero-tile-icon" aria-hidden>
                  {tile.icon}
                </div>

                <div className="hero-tile-texts">
                  <div className="hero-tile-title">{tile.title}</div>
                  <div className="hero-tile-sub">
                    <span className="accent">{tile.value}</span>
                    <span className="muted"> {tile.accent}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Colonne droite: visuel promo */}
        <div className="hero-right">
          <div className="hero-event">
            <div className="hero-event-badge">Évènement</div>
            <p className="hero-event-text">
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

export default HeroSection;