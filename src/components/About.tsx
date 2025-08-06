import React from 'react';
import './About.css';
import { Link } from 'react-router-dom';

type ValueItem = {
  icon: string;
  title: string;
  desc: string;
};

type TeamItem = {
  avatar: string;
  name: string;
  role: string;
  blurb?: string;
};

type AboutProps = {
  title?: string;
  subtitle?: string;
  intro?: string;
  values?: ValueItem[];
  team?: TeamItem[];
  ctaLabel?: string;
  ctaTo?: string;
};

const defaultValues: ValueItem[] = [
  { icon: '🔍', title: 'Clarté des offres', desc: 'Des garanties expliquées simplement, sans jargon.' },
  { icon: '💸', title: 'Tarifs justes', desc: 'Comparez des prix transparents, mis à jour en continu.' },
  { icon: '⚡', title: 'Support réactif', desc: 'Une aide rapide quand vous en avez vraiment besoin.' },
  { icon: '🔐', title: 'Données protégées', desc: 'Vos informations sont sécurisées et confidentielles.' },
  { icon: '🧭', title: 'Parcours fluide', desc: 'Un processus de comparaison clair, en quelques étapes.' },
];

const defaultTeam: TeamItem[] = [
  { avatar: '👩🏾‍💼', name: 'Aïcha', role: 'Conseillère assurance', blurb: 'Experte en garanties auto locales.' },
  { avatar: '👨🏽‍💻', name: 'Moussa', role: 'Ingénieur produit', blurb: 'Focalisé sur la simplicité du parcours.' },
  { avatar: '🧑🏼‍💼', name: 'Claire', role: 'Partenariats', blurb: 'Relie NOLI aux assureurs fiables.' },
];

const AboutHero: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <header className="about-hero" role="banner">
    <div className="about-hero-inner">
      <figure className="about-hero-figure" aria-hidden>
        <div className="about-hero-icon" aria-hidden>🌐</div>
      </figure>
      <h1 className="about-hero-title">{title}</h1>
      <p className="about-hero-desc">{subtitle}</p>
    </div>
  </header>
);

const AboutValues: React.FC<{ values: ValueItem[] }> = ({ values }) => (
  <section className="about-section" aria-labelledby="about-values-title">
    <header className="about-section-header">
      <span className="about-eyebrow">Nos engagements</span>
      <h2 id="about-values-title" className="about-section-title">Ce qui guide NOLI au quotidien</h2>
      <p className="about-muted">Nous construisons une expérience d’assurance moderne: claire, rapide et fiable.</p>
    </header>
    <ul className="about-values-grid" role="list">
      {values.map((v, i) => (
        <li className="about-card about-value" key={`${v.title}-${i}`} tabIndex={0}>
          <div className="about-value-icon" aria-hidden>{v.icon}</div>
          <div className="about-value-body">
            <h3 className="about-card-title">{v.title}</h3>
            <p className="about-card-desc">{v.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

const AboutApproach: React.FC = () => (
  <section className="about-section about-approach" aria-labelledby="about-approach-title">
    <header className="about-section-header">
      <span className="about-eyebrow">Notre approche</span>
      <h2 id="about-approach-title" className="about-section-title">Simplifier l’assurance avec transparence et accompagnement</h2>
      <p className="about-muted">
        NOLI est le comparateur d’assurance auto de référence en Côte d’Ivoire. Nous analysons des dizaines d’assureurs
        pour proposer des garanties pertinentes au meilleur prix, en toute impartialité. Notre équipe vous accompagne
        pour que chaque choix soit clair et maitrîsé.
      </p>
    </header>
    <div className="about-approach-grid">
      <article className="about-card about-approach-card" aria-label="Transparence">
        <div className="about-approach-icon" aria-hidden>✨</div>
        <h3 className="about-card-title">Transparence</h3>
        <p className="about-card-desc">Des informations comparables et des frais visibles, sans mauvaise surprise.</p>
      </article>
      <article className="about-card about-approach-card" aria-label="Rapidité">
        <div className="about-approach-icon" aria-hidden>⚙️</div>
        <h3 className="about-card-title">Rapidité</h3>
        <p className="about-card-desc">Des résultats en quelques secondes, adaptés à votre profil.</p>
      </article>
      <article className="about-card about-approach-card" aria-label="Accompagnement humain">
        <div className="about-approach-icon" aria-hidden>🤝</div>
        <h3 className="about-card-title">Accompagnement humain</h3>
        <p className="about-card-desc">Des conseils utiles et un support disponible quand vous en avez besoin.</p>
      </article>
    </div>
  </section>
);

const AboutTeam: React.FC<{ team: TeamItem[] }> = ({ team }) => (
  <section className="about-section" aria-labelledby="about-team-title">
    <header className="about-section-header">
      <span className="about-eyebrow">Notre équipe</span>
      <h2 id="about-team-title" className="about-section-title">Des spécialistes proches de vos besoins</h2>
      <p className="about-muted">Expertise locale, innovation continue et sens du service.</p>
    </header>
    <div className="about-team-grid">
      {team.map((t, i) => (
        <figure className="about-card about-team-card" key={`${t.name}-${i}`}>
          <div className="about-team-avatar" aria-hidden>{t.avatar}</div>
          <figcaption className="about-team-caption">
            <div className="about-team-name">{t.name}</div>
            <div className="about-team-role">{t.role}</div>
            {t.blurb && <p className="about-team-blurb">{t.blurb}</p>}
          </figcaption>
        </figure>
      ))}
    </div>
  </section>
);

const AboutCTA: React.FC<{ label: string; to?: string }> = ({ label, to }) => {
  const content = (
    <>
      {label}
      <span className="about-cta-arrow" aria-hidden>→</span>
    </>
  );
  return (
    <section className="about-cta-section" aria-labelledby="about-cta-title">
      <h2 id="about-cta-title" className="sr-only">Contact et services</h2>
      <div className="about-cta">
        {to ? (
          <Link to={to} className="about-cta-btn" role="button" aria-label={label}>
            {content}
          </Link>
        ) : (
          <button type="button" className="about-cta-btn" aria-label={label}>
            {content}
          </button>
        )}
        <p className="about-cta-hint">Gratuit et sans engagement • Réponse rapide</p>
      </div>
    </section>
  );
};

const About: React.FC<AboutProps> = ({
  title = 'À propos de NOLI',
  subtitle = 'Simplifier l’assurance avec transparence, rapidité et accompagnement humain.',
  intro,
  values = defaultValues,
  team = defaultTeam,
  ctaLabel = 'Découvrir nos offres',
  ctaTo = '/',
}) => {
  return (
    <div className="about-bg">
      <AboutHero title={title} subtitle={subtitle} />
      <div className="about-container" role="main">
        {intro && (
          <section className="about-section" aria-labelledby="about-intro-title">
            <h2 id="about-intro-title" className="about-title">Notre mission</h2>
            <p className="about-intro">{intro}</p>
          </section>
        )}
        <AboutValues values={values} />
        <AboutApproach />
        <AboutTeam team={team} />
        <AboutCTA label={ctaLabel} to={ctaTo} />
      </div>
    </div>
  );
};

export default About;