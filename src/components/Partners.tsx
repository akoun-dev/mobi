import React from 'react';
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
];

const Partners: React.FC = () => {
  return (
    <section className="partners-section">
      <div className="partners-header">
        <h2 className="partners-title">Plus de 100 partenaires</h2>
        <p className="partners-sub">Assureurs et partenaires sélectionnés avec soin</p>
      </div>

      <div className="partners-rows">
        {partnerGroups.map((group, idx) => (
          <div key={idx} className="partners-row">
            <div className="partners-row-title">{group.title}</div>
            <div className="partners-logos">
              {group.logos.map((name, i) => (
                <div key={i} className="partner-logo" aria-label={name} title={name}>
                  <span className="partner-mark">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="partners-cta">
        <a href="#" onClick={(e) => e.preventDefault()} className="partners-link">
          Voir tous nos partenaires →
        </a>
      </div>
    </section>
  );
};

export default Partners;