import React, { memo } from 'react';
import './Partners.css';

const partnerGroups = [
  {
    title: 'Assurance auto',
    logos: ['Allianz', 'AXA', 'Saham', 'SUNU', 'NSIA', 'Generali'],
  },
  {
    title: 'Assurance santé',
    logos: ['CNAM', 'MCI', 'Mutuelle+'],
  },
  {
    title: 'Banques & crédits',
    logos: ['SGCI', 'BNI', 'Ecobank'],
  },
] as const;

const PartnerLogo = memo(function PartnerLogo({ name }: { name: string }) {
  return (
    <div className="partner-logo" aria-label={name} title={name} role="img">
      <span className="partner-mark">{name}</span>
    </div>
  );
});

const PartnerRow = memo(function PartnerRow({ title, logos }: { title: string; logos: readonly string[] }) {
  return (
    <article className="partners-row" aria-labelledby={`partners-${title}`}>
      <h3 id={`partners-${title}`} className="partners-row-title">{title}</h3>
      <div className="partners-logos" role="list">
        {logos.map((name) => (
          <div key={name} role="listitem">
            <PartnerLogo name={name} />
          </div>
        ))}
      </div>
    </article>
  );
});

const Partners: React.FC = () => {
  return (
    <section className="partners-section" aria-labelledby="partners-title">
      <div className="partners-header">
        <h2 id="partners-title" className="partners-title">Plus de 100 partenaires</h2>
        <p className="partners-sub">Assureurs et partenaires sélectionnés avec soin</p>
      </div>

      <div className="partners-rows">
        {partnerGroups.map((group) => (
          <PartnerRow key={group.title} title={group.title} logos={group.logos} />
        ))}
      </div>

      <div className="partners-cta">
        <a href="#" onClick={(e) => e.preventDefault()} className="partners-link" aria-label="Voir tous nos partenaires">
          Voir tous nos partenaires →
        </a>
      </div>
    </section>
  );
};

export default memo(Partners);