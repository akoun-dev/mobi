import './Assurance.css';
import { Shield, Car, Home, HeartPulse, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';

const assurances = [
  { icon: <Car size={32} />, title: 'Auto', desc: "Protégez votre véhicule et vos proches avec la meilleure assurance auto du marché." },
  { icon: <Bike size={32} />, title: 'Moto', desc: "Comparez les offres pour rouler en toute sécurité, même à deux roues." },
];

const avantages = [
  { icon: <Shield size={28} />, text: 'Des devis 100% gratuits et sans engagement' },
  { icon: <Car size={28} />, text: 'Des partenaires assureurs fiables et reconnus' },
  { icon: <HeartPulse size={28} />, text: 'Des conseils personnalisés pour chaque profil' },
  { icon: <Home size={28} />, text: 'Un accompagnement de la comparaison à la souscription' },
];

const Assurance = () => (
  <div className="assurance-bg">
    <div className="assurance-hero">
      <div className="assurance-hero-title">Comparez les assurances en toute simplicité</div>
      <div className="assurance-hero-desc">
        Trouvez la meilleure assurance auto, moto, habitation ou santé en quelques clics.<br />
        Comparez, choisissez, économisez !
      </div>
    </div>
    <div className="assurance-container">
      <div className="assurance-types">
        {assurances.map(a => (
          <Link
            to="/"
            key={a.title}
            className="assurance-type-card assurance-type-link"
            role="button"
            aria-label={`Comparer assurance ${a.title}`}
          >
            <div className="assurance-type-head">
              <div className="assurance-type-icon">{a.icon}</div>
              <div className="assurance-type-title">{a.title}</div>
              <span className="assurance-type-arrow" aria-hidden>›</span>
            </div>
            <div className="assurance-type-desc">{a.desc}</div>
          </Link>
        ))}
      </div>
      {/* Bloc avantages + CTA amélioré */}
      <section className="assurance-advantages">
        <div className="assurance-advantages-header">
          <div className="assurance-advantages-badge">Pourquoi NOLI</div>
          <h2 className="assurance-advantages-title">Des raisons concrètes de nous faire confiance</h2>
          <p className="assurance-advantages-sub">
            Des partenaires fiables, des conseils utiles et des devis gratuits. Vous comparez, vous décidez.
          </p>
        </div>

        <div className="assurance-advantages-grid">
          {avantages.map((a, i) => (
            <div key={i} className="assurance-advantage-card">
              <div className="adv-icon">{a.icon}</div>
              <div className="adv-text">{a.text}</div>
            </div>
          ))}
        </div>

        <div className="assurance-cta enhanced">
          <Link to="/" className="assurance-cta-btn">
            Commencer la comparaison
            <span className="assurance-cta-kbd" aria-hidden>⏎</span>
          </Link>
          <div className="assurance-cta-hint">
            Gratuit et sans engagement • Résultats en moins d’une minute
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default Assurance; 