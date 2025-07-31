import React, { useState } from 'react';
import './FAQ.css';

const faqs = [
  {
    question: "Qu'est-ce que NOLI Motor ?",
    answer: "NOLI Motor est un comparateur d'assurance auto en Côte d'Ivoire. Il vous permet de comparer rapidement les offres de plusieurs assureurs et de choisir la meilleure couverture pour votre véhicule."
  },
  {
    question: "Comment fonctionne la comparaison ?",
    answer: "Vous remplissez un formulaire rapide avec les informations sur votre profil et votre véhicule. Notre plateforme analyse les offres du marché et vous propose les meilleures garanties au meilleur prix."
  },
  {
    question: "Est-ce que le service est gratuit ?",
    answer: "Oui, la comparaison et la demande de devis sont 100% gratuites et sans engagement."
  },
  {
    question: "Comment souscrire à une assurance ?",
    answer: "Après avoir comparé les offres, vous pouvez demander à être mis en relation avec l'assureur de votre choix pour finaliser la souscription."
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Oui, la sécurité de vos données est notre priorité. Toutes les informations sont cryptées et ne sont jamais partagées sans votre accord."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faq-bg">
      <div className="faq-hero">
        <div className="faq-hero-title">Foire aux questions</div>
        <div className="faq-hero-desc">Retrouvez ici les réponses aux questions les plus fréquentes sur NOLI Motor et la comparaison d'assurance auto.</div>
      </div>
      <div className="faq-container">
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div className={`faq-item${openIndex === idx ? ' open' : ''}`} key={faq.question}>
              <button className="faq-question" onClick={() => toggle(idx)}>
                {faq.question}
                <span className="faq-arrow">{openIndex === idx ? '▲' : '▼'}</span>
              </button>
              <div className="faq-answer-wrapper" style={{ maxHeight: openIndex === idx ? 200 : 0 }}>
                <div className="faq-answer">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ; 