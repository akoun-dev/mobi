import { Clock, Shield, Users, CheckCircle, Headphones, PiggyBank } from 'lucide-react';
import './Features.css';

/**
 * Section “3 raisons de choisir …” + bloc explicatif “Comparer avec NOLI, c’est gratuit”
 * Inspirée de la capture : 3 cartes horizontales, puis un bloc en 2 colonnes texte + visuel.
 */
const reasons = [
  { icon: Clock, title: 'Du temps de gagné !', desc: "Au lieu d'aller sur de nombreux sites, NOLI compare pour vous les meilleures offres sur une seule page." },
  { icon: Headphones, title: 'Tout est plus clair !', desc: "Nous expliquons simplement comment fonctionnent les assurances et leurs garanties pour vous aider à choisir." },
  { icon: PiggyBank, title: 'Faites face à l’inflation !', desc: "Trouvez une assurance moins chère avec les mêmes garanties pour préserver votre budget." },
];

const details = [
  {
    title: '0 commission ou frais cachés',
    desc: "Le comparateur n'applique aucun frais supplémentaires aux tarifs affichés. Le prix que vous voyez est celui que vous paierez à la fin.",
  },
  {
    title: 'Comment le comparateur se rémunère ?',
    desc: "Nos partenaires rémunèrent le service lorsqu'un contrat est souscrit, sans impact sur votre budget et sans favoriser une offre.",
  },
];

const usp = [
  { icon: Shield, text: 'Sécurisé' },
  { icon: Users, text: 'Partenaires fiables' },
  { icon: CheckCircle, text: '100% gratuit' },
];

const Features = () => {
  return (
    <section className="features-section">
      {/* Titre principal centré */}
      <h2 className="features-title">3 raisons de choisir NOLI</h2>

      {/* 3 raisons en grille horizontale */}
      <div className="features-grid">
        {reasons.map((item, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon" aria-hidden>
              <item.icon size={32} />
            </div>
            <div className="feature-title">{item.title}</div>
            <div className="feature-desc">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Bloc “Comparer avec NOLI, c’est gratuit” */}
      <div className="features-free">
        <div className="features-free-col">
          <h3 className="features-free-title">Comparer avec NOLI, c’est gratuit</h3>

          <div className="features-free-points">
            {details.map((d, idx) => (
              <div key={idx} className="features-free-point">
                <div className="features-free-point-title">{d.title}</div>
                <div className="features-free-point-desc">{d.desc}</div>
              </div>
            ))}
          </div>

          <div className="features-usps">
            {usp.map((u, idx) => (
              <div key={idx} className="features-usp">
                <u.icon size={18} />
                <span>{u.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visuel placeholder côté droit */}
        <div className="features-free-visual" role="img" aria-label="Visuel explicatif">
          <div className="features-free-bubbles">
            <span>0 commission</span>
            <span>0 frais caché</span>
            <span>100% gratuit</span>
          </div>
          <div className="features-free-mascot">N</div>
        </div>
      </div>
    </section>
  );
};

export default Features;
