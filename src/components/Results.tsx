import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import './Results.css';

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
}

interface ResultsProps {
  quotes: Quote[];
  onResetForm: () => void;
  onDownloadQuote: (quote: Quote) => void;
}

const Results: React.FC<ResultsProps> = ({ quotes, onResetForm, onDownloadQuote }) => {
  const [filters, setFilters] = useState({
    insurer: '',
    coverage: '',
    maxPrice: ''
  });
  const [expandedQuote, setExpandedQuote] = useState<number | null>(null);

  const filteredQuotes = quotes.filter(quote => {
    return (!filters.insurer || quote.insurer.toLowerCase().includes(filters.insurer.toLowerCase())) &&
           (!filters.coverage || quote.coverage === filters.coverage) &&
           (!filters.maxPrice || quote.price <= parseInt(filters.maxPrice));
  });

  return (
    <div className="results-bg">
      <div className="results-container">
        <div className="results-header">
          <h2 className="results-title">Résultats de comparaison</h2>
          <button
            onClick={onResetForm}
            className="results-close"
            aria-label="Réinitialiser"
          >
            <X size={24} />
          </button>
        </div>
        {/* Filtres */}
        <div className="results-filters">
          <input
            type="text"
            placeholder="Filtrer par assureur..."
            value={filters.insurer}
            onChange={e => setFilters({ ...filters, insurer: e.target.value })}
            className="results-filter-input"
          />
          <select
            value={filters.coverage}
            onChange={e => setFilters({ ...filters, coverage: e.target.value })}
            className="results-filter-input"
          >
            <option value="">Type de couverture</option>
            <option value="Tous risques">Tous risques</option>
            <option value="Tous risques Premium">Tous risques Premium</option>
            <option value="Tiers étendu">Tiers étendu</option>
          </select>
          <input
            type="number"
            placeholder="Prix maximum (FCFA)"
            value={filters.maxPrice}
            onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
            className="results-filter-input"
          />
        </div>
        {/* Liste des devis */}
        <div className="results-list">
          {filteredQuotes.map((quote) => (
            <div key={quote.id} className="results-card">
              <div className="results-card-header">
                <div className="results-card-logo">{quote.logo}</div>
                <div>
                  <div className="results-card-insurer">{quote.insurer}</div>
                  <div className="results-card-coverage">{quote.coverage}</div>
                  <div className="results-card-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < Math.floor(quote.rating) ? 'results-star-filled' : 'results-star-empty'}>
                        ⭐
                      </span>
                    ))}
                    <span className="results-card-rating-note">{quote.rating}/5</span>
                  </div>
                </div>
                <div className="results-card-price">
                  <div className="results-card-price-value">{quote.price.toLocaleString()} FCFA</div>
                  <div className="results-card-deductible">Franchise: {quote.deductible.toLocaleString()} FCFA</div>
                </div>
              </div>
              <div className="results-card-options">
                {quote.options.map((option, idx) => (
                  <span key={idx} className="results-option-badge">
                    {option}
                  </span>
                ))}
              </div>
              <div className="results-card-actions">
                <button
                  onClick={() => setExpandedQuote(expandedQuote === quote.id ? null : quote.id)}
                  className="results-details-btn"
                >
                  {expandedQuote === quote.id ? (
                    <>Masquer les détails <ChevronUp size={16} /></>
                  ) : (
                    <>Voir les détails <ChevronDown size={16} /></>
                  )}
                </button>
                <button
                  onClick={() => onDownloadQuote(quote)}
                  className="results-choose-btn"
                >
                  Choisir cette couverture
                </button>
              </div>
              {expandedQuote === quote.id && (
                <div className="results-card-details">
                  <div className="results-card-details-desc">{quote.details}</div>
                  <div className="results-card-details-grid">
                    <div>
                      <div className="results-card-details-title">Garanties incluses :</div>
                      <ul className="results-card-details-list">
                        {quote.options.map((option, idx) => (
                          <li key={idx} className="results-card-details-item">
                            <CheckCircle size={16} className="results-card-details-icon" />
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="results-card-details-title">Informations tarifaires :</div>
                      <div className="results-card-details-info">
                        <div><span>Prime annuelle :</span> <span>{quote.price.toLocaleString()} FCFA</span></div>
                        <div><span>Franchise :</span> <span>{quote.deductible.toLocaleString()} FCFA</span></div>
                        <div><span>Note :</span> <span>{quote.rating}/5</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
