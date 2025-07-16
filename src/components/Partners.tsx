import './Partners.css';

const partners = [
  { name: 'NSIA Assurance', logo: '🛡️' },
  { name: 'Atlantique Assurance', logo: '🌊' },
  { name: 'Saham Assurance', logo: '⭐' },
  { name: 'Allianz CI', logo: '🏆' },
  { name: 'AXA Assurance', logo: '🔷' },
  { name: 'Sunu Assurance', logo: '☀️' }
];

const Partners = () => {
  return (
    <section className="partners-section">
      <div className="partners-container">
        <h2 className="partners-title">
          Nos Assureurs Partenaires
        </h2>
        <div className="partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="partner-card">
              <div className="partner-logo">{partner.logo}</div>
              <p className="partner-name">{partner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;