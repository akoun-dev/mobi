import './About.css';

const team = [
  { name: 'Maurelle Prisca', role: 'Fondatrice & CEO', avatar: '🧑‍💼' },
  { name: 'Jean Kouadio', role: 'Lead Développeur', avatar: '👨‍💻' },
  { name: 'Fatou Diarra', role: 'Responsable Partenariats', avatar: '🤝' },
];

const About = () => (
  <div className="about-bg">
    <div className="about-section-flex">
      {/* Bloc citation à gauche */}
      <div className="about-quote-block">
        <div className="about-quote-inner">
          <div className="about-quote-icon">💬</div>
          <div className="about-quote-text">
            “Notre mission est de rendre l’assurance auto simple, transparente et accessible à tous. Nous croyons que chaque conducteur mérite la meilleure protection, au meilleur prix.”
          </div>
          <div className="about-quote-author">L’équipe NOLI Motor</div>
        </div>
      </div>
      {/* Bloc texte à droite */}
      <div className="about-main-block">
        <h2 className="about-title-main">À propos de NOLI Motor</h2>
        <p className="about-main-text">
          NOLI Motor est le comparateur d’assurance auto de référence en Côte d’Ivoire. Notre plateforme analyse des dizaines d’assureurs pour vous proposer les meilleures garanties au meilleur prix, en toute impartialité.
        </p>
        <p className="about-main-text">
          Nous croyons que l’assurance doit être simple, rapide et transparente. Notre équipe s’engage à accompagner chaque automobiliste dans sa recherche de protection, pour rouler en toute sérénité.
        </p>
      </div>
    </div>
  </div>
);

export default About; 