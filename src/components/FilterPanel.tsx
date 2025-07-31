import React from 'react';

interface FilterPanelProps {
  filters: {
    coverageType: string;
    priceRange: [number, number];
    protectionLevel: string;
  };
  onFilterChange: (filters: {
    coverageType: string;
    priceRange: [number, number];
    protectionLevel: string;
  }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <div className="filter-panel">
      <h3>Filtrer les résultats</h3>
      
      <div className="filter-group">
        <label>Type de couverture</label>
        <select name="coverageType" value={filters.coverageType} onChange={handleChange}>
          <option value="tous">Tous</option>
          <option value="tiers">Tiers</option>
          <option value="tous-risques">Tous risques</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Plage de prix (FCFA)</label>
        <input 
          type="range" 
          name="priceRange" 
          min="0" 
          max="1000" 
          step="50"
          value={filters.priceRange[1]} 
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label>Niveau de protection</label>
        <select name="protectionLevel" value={filters.protectionLevel} onChange={handleChange}>
          <option value="tous">Tous</option>
          <option value="basique">Basique</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;