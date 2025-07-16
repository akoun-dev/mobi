import './About.css';

const team = [
  { name: 'Maurelle Prisca', role: 'Fondatrice & CEO', avatar: '🧑‍💼' },
  { name: 'Jean Kouadio', role: 'Lead Développeur', avatar: '👨‍💻' },
  { name: 'Fatou Diarra', role: 'Responsable Partenariats', avatar: '🤝' },
];

const About = () => (
  <div className="about-bg">
    <div className="about-hero">
      <div className="about-hero-title">À propos de NOLI Motor</div>
      <div className="about-hero-desc">
        Le comparateur d'assurance auto de référence en Côte d'Ivoire.<br />
        Comparez, choisissez, roulez en toute sérénité.
      </div>
    </div>
    <div className="about-container">
      <div className="about-section">
        <h2 className="about-section-title">Notre mission</h2>
        <p className="about-section-desc">
          Nous aidons les automobilistes à trouver la meilleure offre d'assurance adaptée à leur profil et à leur budget, en toute impartialité. Notre plateforme analyse des dizaines d'assureurs et vous propose les meilleures garanties au meilleur prix.
        </p>
      </div>
      <div className="about-section">
        <h2 className="about-section-title">Nos valeurs</h2>
        <ul className="about-values-list">
          <li><span className="about-value-badge">🤝</span> Transparence</li>
          <li><span className="about-value-badge">⚡</span> Simplicité</li>
          <li><span className="about-value-badge">🔒</span> Sécurité</li>
          <li><span className="about-value-badge">💡</span> Innovation</li>
        </ul>
      </div>
      <div className="about-section">
        <h2 className="about-section-title">Notre équipe</h2>
        <div className="about-team">
          {team.map(member => (
            <div className="about-team-card" key={member.name}>
              <div className="about-team-avatar">{member.avatar}</div>
              <div className="about-team-name">{member.name}</div>
              <div className="about-team-role">{member.role}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="about-section about-contact">
        <h2 className="about-section-title">Contact</h2>
        <p>Une question ? Un partenariat ? <a href="mailto:contact@nolimotor.ci" className="about-link">contact@nolimotor.ci</a></p>
      </div>
    </div>
  </div>
);

export default About; 