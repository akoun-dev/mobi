import { Clock, Shield, Users, CheckCircle } from 'lucide-react';
import './Features.css';

const features = [
  { icon: Clock, title: 'Comparaison Rapide', desc: 'Obtenez vos devis en moins de 3 minutes' },
  { icon: Shield, title: 'Sécurisé', desc: 'Vos données sont protégées et cryptées' },
  { icon: Users, title: 'Partenaires Fiables', desc: 'Assureurs agréés et reconnus en Côte d\'Ivoire' },
  { icon: CheckCircle, title: 'Gratuit', desc: 'Service de comparaison 100% gratuit' }
];

const Features = () => {
  return (
    <section className="features-section">
      <h2 className="features-title">Pourquoi choisir NOLI Motor&nbsp;?</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              <feature.icon size={32} />
            </div>
            <div className="feature-title">{feature.title}</div>
            <div className="feature-desc">{feature.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
