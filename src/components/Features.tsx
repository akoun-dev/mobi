import { memo } from 'react';
import { Clock, Shield, Users, CheckCircle, Headphones, PiggyBank } from 'lucide-react';
import './Features.css';

const reasons = [
  { icon: Clock, title: 'Du temps de gagné !', desc: "Au lieu d'aller sur de nombreux sites, NOLI compare pour vous les meilleures offres sur une seule page." },
  { icon: Headphones, title: 'Tout est plus clair !', desc: "Nous expliquons simplement comment fonctionnent les assurances et leurs garanties pour vous aider à choisir." },
  { icon: PiggyBank, title: 'Faites face à l’inflation !', desc: "Trouvez une assurance moins chère avec les mêmes garanties pour préserver votre budget." },
] as const;

const details = [
  {
    title: '0 commission ou frais cachés',
    desc: "Le comparateur n'applique aucun frais supplémentaires aux tarifs affichés. Le prix que vous voyez est celui que vous paierez à la fin.",
  },
  {
    title: 'Comment le comparateur se rémunère ?',
    desc: "Nos partenaires rémunèrent le service lorsqu'un contrat est souscrit, sans impact sur votre budget et sans favoriser une offre.",
  },
] as const;

const usp = [
  { icon: Shield, text: 'Sécurisé' },
  { icon: Users, text: 'Partenaires fiables' },
  { icon: CheckCircle, text: '100% gratuit' },
] as const;

const ReasonCard = memo(function ReasonCard({ icon: Icon, title, desc }: { icon: typeof Clock; title: string; desc: string }) {
  return (
    <article className="feature-card">
      <div className="feature-icon" aria-hidden>
        <Icon size={32} />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </article>
  );
});

const Features = () => {
  return (
    <section className="features-section" aria-labelledby="features-title">
      <h2 id="features-title" className="features-title">3 raisons de choisir NOLI</h2>

      <div className="features-grid" role="list">
        {reasons.map((item) => (
          <div key={item.title} role="listitem">
            <ReasonCard icon={item.icon} title={item.title} desc={item.desc} />
          </div>
        ))}
      </div>

      <div className="features-free" role="region" aria-labelledby="features-free-title">
        <div className="features-free-col">
          <h3 id="features-free-title" className="features-free-title">Comparer avec NOLI, c’est gratuit</h3>

          <div className="features-free-points">
            {details.map((d) => (
              <div key={d.title} className="features-free-point">
                <div className="features-free-point-title">{d.title}</div>
                <div className="features-free-point-desc">{d.desc}</div>
              </div>
            ))}
          </div>

          <div className="features-usps" role="list">
            {usp.map((u) => (
              <div key={u.text} className="features-usp" role="listitem" aria-label={u.text}>
                <u.icon size={18} aria-hidden />
                <span>{u.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="features-free-visual" role="img" aria-label="Visuel explicatif">
          <div className="features-free-bubbles">
            <span>0 commission</span>
            <span>0 frais caché</span>
            <span>100% gratuit</span>
          </div>
          <div className="features-free-mascot" aria-hidden>N</div>
        </div>
      </div>
    </section>
  );
};

export default memo(Features);
