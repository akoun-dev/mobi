import React from 'react';
import { ArrowRight } from 'lucide-react';
import './HeroSection.css';

interface HeroSectionProps {
  onCompareClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onCompareClick }) => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <h1 className="hero-title">
          Trouvez la meilleure assurance auto
          <span className="hero-title-highlight"> en 3 minutes</span>
        </h1>
        <p className="hero-description">
          Comparez gratuitement les offres d'assurance auto en Côte d'Ivoire et économisez jusqu'à 40%
        </p>
        <button
          onClick={onCompareClick}
          className="hero-button"
        >
          Comparer les offres d'assurance auto
          <ArrowRight className="hero-arrow" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;