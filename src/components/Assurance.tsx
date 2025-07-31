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
        Comparez, choisissez, économisez !
      </div>
    </div>
    <div className="assurance-container">
      <div className="assurance-types">
        {assurances.map(a => (
          <div className="assurance-type-card" key={a.title}>
            <div className="assurance-type-icon">{a.icon}</div>
            <div className="assurance-type-title">{a.title}</div>
            <div className="assurance-type-desc">{a.desc}</div>
          </div>
        ))}
      </div>
      <div className="assurance-advantages">
        <h2 className="assurance-advantages-title">Pourquoi choisir NOLI Motor ?</h2>
        <ul className="assurance-advantages-list">
          {avantages.map((a, i) => (
            <li key={i} className="assurance-advantage-item">{a.icon}<span>{a.text}</span></li>
          ))}
        </ul>
      </div>
      <div className="assurance-cta">
        <Link to="/" className="assurance-cta-btn">Commencer la comparaison</Link>
      </div>
    </div>
  </div>
);

export default Assurance; 