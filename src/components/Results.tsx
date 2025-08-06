import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import './Results.css';
import QuoteDownloadModal from './QuoteDownloadModal';

interface Quote {
  id: number;
  insurer: string;
  logo: string;
  price: number;
  coverage: string;
  deductible: number;
  options: string[];
  rating: number;
  details: string;
  subscribeUrl: string;
}

interface ResultsProps {
  quotes: Quote[];
  onResetForm: () => void;
  onDownloadQuote: (quote: Quote) => void;
}

type SortKey = 'priceAsc' | 'priceDesc' | 'coverageMost' | 'coverageLeast';

const Results: React.FC<ResultsProps> = ({ quotes, onResetForm, onDownloadQuote }) => {
  const [sortKey, setSortKey] = useState<SortKey>('priceAsc');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [contactMsg, setContactMsg] = useState<string>('');
 
  // Modal pour "Recevoir le devis"
  const [modalQuote, setModalQuote] = useState<Quote | null>(null);
 
  // Etats des filtres Options
  const [fBris, setFBris] = useState<boolean>(false);
  const [fPanne, setFPanne] = useState<boolean>(false);
  const [fAccident, setFAccident] = useState<boolean>(false);
  const [fRemplacement, setFRemplacement] = useState<boolean>(false);

  // Sélection pour comparaison (IDs)
  const [compareSet, setCompareSet] = useState<Set<number>>(new Set());
  const toggleCompare = (id: number) => {
    setCompareSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Liste pour la comparaison
  const compareList = useMemo(() => Array.from(compareSet), [compareSet]);

  const removeFromCompare = (id: number) => {
    setCompareSet(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };
  const clearCompare = () => setCompareSet(new Set());
  const handleGoCompare = () => {
    // Placeholder: Implémenter la vraie page de comparaison plus tard
    // Pour l’instant, on affiche une alerte avec les IDs sélectionnés
    alert(`Comparer les offres: ${compareList.join(', ')}`);
  };

  // Application des filtres puis tri
  const filtered = useMemo(() => {
    if (!quotes) return [];
    // normaliser les options pour chaque devis
    const norm = (opts: string[]) => (opts || []).map(o => (o || '').toLowerCase());
    return quotes.filter(q => {
      const o = norm(q.options);
      // Chaque filtre actif doit être présent dans les options
      if (fBris) {
        const ok = o.some(s => s.includes('bris de glace') || s.includes('bris'));
        if (!ok) return false;
      }
      if (fPanne) {
        const ok = o.some(s => s.includes('assistance panne') || s.includes('panne'));
        if (!ok) return false;
      }
      if (fAccident) {
        const ok = o.some(s => s.includes('assistance accident') || s.includes('accident'));
        if (!ok) return false;
      }
      if (fRemplacement) {
        const ok = o.some(s => s.includes('véhicule de remplacement') || s.includes('vehicule de remplacement') || s.includes('remplacement'));
        if (!ok) return false;
      }
      return true;
    });
  }, [quotes, fBris, fPanne, fAccident, fRemplacement]);

  const sorted = useMemo(() => {
    const arr = [...(filtered || [])];
    switch (sortKey) {
      case 'priceAsc': return arr.sort((a,b) => a.price - b.price);
      case 'priceDesc': return arr.sort((a,b) => b.price - a.price);
      case 'coverageMost': return arr.sort((a,b) => coverageScore(b.coverage) - coverageScore(a.coverage));
      case 'coverageLeast': return arr.sort((a,b) => coverageScore(a.coverage) - coverageScore(b.coverage));
      default: return arr;
    }
  }, [filtered, sortKey]);

  function coverageScore(label: string) {
    const l = (label || '').toLowerCase();
    if (l.includes('premium')) return 3;
    if (l.includes('tous risques')) return 2;
    if (l.includes('tiers étendu') || l.includes('vol') || l.includes('incendie')) return 1;
    return 0;
  }

  const handleReceive = (q: Quote) => {
    // Ouvre le popup d’options: Email / WhatsApp / Télécharger
    setModalQuote(q);
  };


  const handleCallMe = () => {
    setContactMsg('Vous serez recontacté dans un délai max de 48h');
  };

  if (!quotes || quotes.length === 0) {
    return (
      <div className="results-empty">
        <p>Aucune offre disponible pour le moment.</p>
        <button className="btn btn-secondary" onClick={onResetForm}>Revenir</button>
      </div>
    );
  }

  return (
    <div className="results-layout">
      {/* Sidebar gauche avec Options + Tri */}
      <aside className="results-sidebar">
        <div className="sidebar-card">
          <h4>Options</h4>
          <label className="sidebar-check">
            <input
              type="checkbox"
              checked={fBris}
              onChange={e => setFBris(e.target.checked)}
            />
            Bris de glace
          </label>
          <label className="sidebar-check">
            <input
              type="checkbox"
              checked={fPanne}
              onChange={e => setFPanne(e.target.checked)}
            />
            Assistance panne
          </label>
          <label className="sidebar-check">
            <input
              type="checkbox"
              checked={fAccident}
              onChange={e => setFAccident(e.target.checked)}
            />
            Assistance accident
          </label>
          <label className="sidebar-check">
            <input
              type="checkbox"
              checked={fRemplacement}
              onChange={e => setFRemplacement(e.target.checked)}
            />
            Véhicule de remplacement
          </label>
        </div>
        <div className="sidebar-card">
          <label className="sidebar-label">Trier</label>
          <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} className="sidebar-select">
            <option value="priceAsc">Prix croissant</option>
            <option value="priceDesc">Prix décroissant</option>
            <option value="coverageMost">Couverture la + complète</option>
            <option value="coverageLeast">Couverture la – complète</option>
          </select>
        </div>
      </aside>

      {/* Zone principale */}
      <main className="results-main">
        <div className="results-topbar">
          <h2>Résultats de comparaison</h2>
          <button onClick={onResetForm} className="results-close" aria-label="Réinitialiser">
            <X size={20} />
          </button>
        </div>

        {contactMsg && <div className="contact-message">{contactMsg}</div>}

        {sorted.map(q => {
          const isOpen = expanded === q.id;
          const isCompared = compareSet.has(q.id);
          return (
            <div key={q.id} className={`offer-card${isOpen ? ' offer-card-open' : ''}`}>
              <div className="offer-main">
                <div className="offer-logo" aria-hidden>{q.logo}</div>
                <div className="offer-center">
                  <div className="offer-insurer">{q.insurer}</div>
                  <ul className="offer-features">
                    {q.options.slice(0, 6).map((opt, idx) => (
                      <li key={idx} className="ok">✓ {opt}</li>
                    ))}
                  </ul>
                  {/* Ligne d'insights comme LesFurets */}
                  <div className="offer-insights">
                    <span className="rating">★ {q.rating.toFixed(1)} / 5</span>
                    <span className="divider">•</span>
                    <span className="trend">+1000 intéressés cette semaine</span>
                  </div>

                  {/* Toggle Comparer */}
                  <label className={`compare-toggle${isCompared ? ' active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => toggleCompare(q.id)}
                    />
                    <span className="knob" aria-hidden />
                    <span className="label-text">Comparer</span>
                  </label>
                  {/* CTA secondaires en mode ouvert (sous le descriptif) */}
                  {isOpen && (
                    <div className="offer-inline-ctas">
                      <button className="btn btn-outline" onClick={() => handleReceive(q)}>Obtenir un devis gratuit</button>
                      <button className="btn btn-outline" onClick={handleCallMe}>Être rappelé par l’assureur</button>
                      <a className="btn btn-accent" href={q.subscribeUrl} target="_blank" rel="noreferrer">Accéder à l’offre</a>
                    </div>
                  )}
                </div>
                <div className="offer-right">
                  <div className="offer-price">
                    <span className="amount">{q.price.toLocaleString()} FCFA</span>
                    <span className="per">/ an</span>
                  </div>
                  <div className="offer-actions">
                    <button className="btn btn-primary" onClick={() => handleReceive(q)}>Recevoir le devis gratuit</button>
                    <button className="btn btn-outline" onClick={handleCallMe}>Être rappelé par l’assureur</button>
                  </div>
                  <button
                    className={`details-toggle${isOpen ? ' open' : ''}`}
                    onClick={() => setExpanded(isOpen ? null : q.id)}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? 'Moins de détails' : 'Plus de détails'}
                    <span className="chevron" aria-hidden>▾</span>
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="offer-details-panel">
                  <div className="details-left">
                    <h4>À propos de {q.insurer}</h4>
                    <ul className="bullets">
                      <li>Assuré en quelques minutes avec garanties essentielles.</li>
                      <li>Dépannage rapide et réseau de garages agréés.</li>
                      <li>Pas d’avance de frais selon conditions.</li>
                    </ul>
                  </div>
                  <aside className="details-right">
                    <div className="recap">
                      <div className="recap-title">Formule : {q.coverage}</div>
                      <div className="recap-price">
                        <div className="main">{q.price.toLocaleString()} FCFA</div>
                        <div className="sub">annuel</div>
                      </div>
                      <div className="recap-fee">Franchise: {q.deductible.toLocaleString()} FCFA</div>
                    </div>
                  </aside>

                  <div className="guarantees">
                    <h4>Garanties principales</h4>
                    <div className="guarantee-row">
                      <div className="g-left">Responsabilité civile</div>
                      <div className="g-right">Incluse</div>
                    </div>
                    <div className="guarantee-row">
                      <div className="g-left">Bris de glace</div>
                      <div className="g-right">Incluse selon option</div>
                    </div>
                    <div className="guarantee-row">
                      <div className="g-left">Vol & Incendie</div>
                      <div className="g-right">Incluse selon formule</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Barre de comparaison globale */}
      {compareList.length > 0 && (
        <div className="compare-bar" role="region" aria-label="Barre de comparaison">
          <div className="compare-bar-inner">
            <div className="compare-items">
              {compareList.map(id => {
                const q = sorted.find(x => x.id === id) || quotes.find(x => x.id === id);
                if (!q) return null;
                return (
                  <div key={id} className="compare-chip">
                    <span className="chip-logo" aria-hidden>{q.logo}</span>
                    <span className="chip-text">
                      <strong>{q.insurer}</strong>
                      <span className="chip-price">{q.price.toLocaleString()} FCFA/an</span>
                    </span>
                    <button
                      className="chip-remove"
                      aria-label={`Retirer ${q.insurer} de la comparaison`}
                      onClick={() => removeFromCompare(id)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="compare-actions">
              <button
                className="btn btn-compare"
                onClick={handleGoCompare}
                disabled={compareList.length < 2}
                aria-disabled={compareList.length < 2}
                title={compareList.length < 2 ? 'Sélectionnez au moins 2 offres' : 'Comparer les offres sélectionnées'}
              >
                Comparer ({compareList.length})
              </button>
              <button className="btn btn-clear" onClick={clearCompare}>Vider</button>
            </div>
          </div>
        </div>
      )}
      {/* Popup: options Email / WhatsApp / Télécharger */}
      {modalQuote && (
        <QuoteDownloadModal
          quote={modalQuote}
          onClose={() => setModalQuote(null)}
          onDownload={(quote) => {
            onDownloadQuote(quote);
            setContactMsg('Votre devis a été téléchargé.');
          }}
          onSendEmail={() => {
            setContactMsg('Le devis sera envoyé par email.');
          }}
          onSendWhatsApp={() => {
            setContactMsg('Le devis sera envoyé par WhatsApp.');
          }}
          onSubscribe={(url) => {
            window.open(url, '_blank', 'noopener,noreferrer');
          }}
        />
      )}
    </div>
  );
};

export default Results;
