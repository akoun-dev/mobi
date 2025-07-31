import React, { useState } from 'react';
import type { Quote } from '../types/insurer';
import './OffersList.css';

interface OffersListProps {
  offers: Quote[];
  onSelectOffer: (offerId: number) => void;
}

const OffersList: React.FC<OffersListProps> = ({ offers, onSelectOffer }) => {
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 100000,
    coverageType: '',
    insurer: ''
  });
  const [sortField, setSortField] = useState<'price' | 'rating'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 5;

  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 100000,
      coverageType: '',
      insurer: ''
    });
  };

  const filteredOffers = offers
    .filter(offer => (
      offer.price >= filters.minPrice &&
      offer.price <= filters.maxPrice &&
      (filters.coverageType === '' || offer.coverage === filters.coverageType) &&
      (filters.insurer === '' || offer.insurer === filters.insurer)
    ))
    .sort((a, b) => {
      if (sortField === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      }
    });

  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);

  const uniqueInsurers = [...new Set(offers.map(offer => offer.insurer))];
  const uniqueCoverages = [...new Set(offers.map(offer => offer.coverage))];

  return (
    <div className="offers-container">
      <div className="filters-section">
        <h3>Filtrer les offres</h3>
        
        <div className="filter-group">
          <label>Prix min:</label>
          <input 
            type="number" 
            value={filters.minPrice}
            onChange={(e) => setFilters({...filters, minPrice: Number(e.target.value)})}
          />
        </div>

        <div className="filter-group">
          <label>Prix max:</label>
          <input 
            type="number" 
            value={filters.maxPrice}
            onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
          />
        </div>

        <div className="filter-group">
          <label>Type de couverture:</label>
          <select
            value={filters.coverageType}
            onChange={(e) => setFilters({...filters, coverageType: e.target.value})}
          >
            <option value="">Tous</option>
            {uniqueCoverages.map(coverage => (
              <option key={coverage} value={coverage}>{coverage}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Assureur:</label>
          <select
            value={filters.insurer}
            onChange={(e) => setFilters({...filters, insurer: e.target.value})}
          >
            <option value="">Tous</option>
            {uniqueInsurers.map(insurer => (
              <option key={insurer} value={insurer}>{insurer}</option>
            ))}
          </select>
        </div>
        <div className="filter-actions">
          <button onClick={resetFilters} className="reset-btn">
            Réinitialiser les filtres
          </button>
          <div className="sort-controls">
            <label>Trier par:</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as 'price' | 'rating')}
            >
              <option value="price">Prix</option>
              <option value="rating">Note</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <option value="asc">Croissant</option>
              <option value="desc">Décroissant</option>
            </select>
          </div>
          <div className="results-count">
            {filteredOffers.length} offre{filteredOffers.length !== 1 ? 's' : ''} trouvée{filteredOffers.length !== 1 ? 's' : ''}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Précédent
              </button>
              <span>Page {currentPage} sur {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="offers-grid">
        {filteredOffers.length === 0 ? (
          <div className="no-results">
            <p>Aucune offre ne correspond à vos critères</p>
            <button onClick={resetFilters}>Réinitialiser les filtres</button>
          </div>
        ) : (
          currentOffers.map((offer: Quote) => (
            <div key={offer.id} className="offer-card" onClick={() => onSelectOffer(offer.id)} role="button">
            <div className="offer-header">
              <span className="insurer-logo">{offer.logo}</span>
              <h4>{offer.insurer}</h4>
              <span className="rating">{offer.rating}/5</span>
            </div>
            <div className="offer-price">
              {offer.price.toLocaleString()} FCFA
            </div>
            <div className="offer-details">
              <p><strong>Couverture:</strong> {offer.coverage}</p>
              <p><strong>Franchise:</strong> {offer.deductible} FCFA</p>
              <p><strong>Options:</strong> {offer.options.join(', ')}</p>
            </div>
            <button className="select-btn" aria-label={`Sélectionner l'offre ${offer.insurer}`}>Sélectionner</button>
          </div>
        )))}
      </div>
    </div>
  );
};

export default OffersList;