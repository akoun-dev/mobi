import React from 'react';
import { X } from 'lucide-react';
import './QuoteForm.css';

interface QuoteFormProps {
  currentStep: number;
  formData: any;
  onInputChange: (field: string, value: string) => void;
  onOptionToggle: (option: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onResetForm: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  currentStep,
  formData,
  onInputChange,
  onOptionToggle,
  onNextStep,
  onPrevStep,
  onResetForm
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    onInputChange(field, e.target.value);
  };

  const handleOptionToggle = (option: string) => {
    onOptionToggle(option);
  };

  return (
    <div className="quoteformw-bg">
      <div className="quoteformw-container">
        <div className="quoteformw-header">
          <h2 className="quoteformw-title">Obtenir un devis personnalisé</h2>
          <button
            onClick={onResetForm}
            className="quoteformw-close"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="quoteformw-progress">
          <div className="quoteformw-progress-labels">
            <span>Étape {currentStep} sur 3</span>
            <span>{Math.round((currentStep / 3) * 100)}% complété</span>
          </div>
          <div className="quoteformw-progress-bar">
            <div
              className="quoteformw-progress-bar-inner"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Step 1: Profil Conducteur */}
        {currentStep === 1 && (
          <div className="quoteformw-step">
            <h3 className="quoteformw-step-title">Profil Conducteur</h3>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Âge</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange(e, 'age')}
                  className="quoteformw-input"
                  placeholder="Ex: 30"
                />
              </div>
              <div>
                <label className="quoteformw-label">Années de permis</label>
                <input
                  type="number"
                  value={formData.licenseYears}
                  onChange={(e) => handleInputChange(e, 'licenseYears')}
                  className="quoteformw-input"
                  placeholder="Ex: 5"
                />
              </div>
            </div>
            <div>
              <label className="quoteformw-label">Sinistres dans les 3 dernières années</label>
              <select
                value={formData.accidents}
                onChange={(e) => handleInputChange(e, 'accidents')}
                className="quoteformw-input"
              >
                <option value="">Sélectionner</option>
                <option value="0">Aucun sinistre</option>
                <option value="1">1 sinistre</option>
                <option value="2">2 sinistres</option>
                <option value="3+">3 sinistres ou plus</option>
              </select>
            </div>
            <div>
              <label className="quoteformw-label">Usage du véhicule</label>
              <select
                value={formData.usage}
                onChange={(e) => handleInputChange(e, 'usage')}
                className="quoteformw-input"
              >
                <option value="">Sélectionner</option>
                <option value="personnel">Personnel</option>
                <option value="professionnel">Professionnel</option>
                <option value="mixte">Mixte</option>
              </select>
            </div>
            <div>
              <label className="quoteformw-label">Kilométrage annuel</label>
              <select
                value={formData.annualKm}
                onChange={(e) => handleInputChange(e, 'annualKm')}
                className="quoteformw-input"
              >
                <option value="">Sélectionner</option>
                <option value="0-10000">0 - 10 000 km</option>
                <option value="10000-20000">10 000 - 20 000 km</option>
                <option value="20000-30000">20 000 - 30 000 km</option>
                <option value="30000+">Plus de 30 000 km</option>
              </select>
            </div>
          </div>
        )}
        {/* Step 2: Véhicule */}
        {currentStep === 2 && (
          <div className="quoteformw-step">
            <h3 className="quoteformw-step-title">Informations Véhicule</h3>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Valeur du véhicule (FCFA)</label>
                <input
                  type="number"
                  value={formData.vehicleValue}
                  onChange={(e) => handleInputChange(e, 'vehicleValue')}
                  className="quoteformw-input"
                  placeholder="Ex: 5000000"
                />
              </div>
              <div>
                <label className="quoteformw-label">Nombre de places</label>
                <select
                  value={formData.seats}
                  onChange={(e) => handleInputChange(e, 'seats')}
                  className="quoteformw-input"
                >
                  <option value="">Sélectionner</option>
                  <option value="2">2 places</option>
                  <option value="4">4 places</option>
                  <option value="5">5 places</option>
                  <option value="7">7 places</option>
                  <option value="9+">9 places ou plus</option>
                </select>
              </div>
            </div>
            <div>
              <label className="quoteformw-label">Type d'énergie</label>
              <select
                value={formData.energy}
                onChange={(e) => handleInputChange(e, 'energy')}
                className="quoteformw-input"
              >
                <option value="">Sélectionner</option>
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="hybride">Hybride</option>
                <option value="electrique">Électrique</option>
              </select>
            </div>
            <div>
              <label className="quoteformw-label">Date d'immatriculation</label>
              <input
                type="date"
                value={formData.registrationDate}
                onChange={(e) => handleInputChange(e, 'registrationDate')}
                className="quoteformw-input"
              />
            </div>
          </div>
        )}
        {/* Step 3: Besoins d'assurance */}
        {currentStep === 3 && (
          <div className="quoteformw-step">
            <h3 className="quoteformw-step-title">Besoins d'assurance</h3>
            <div>
              <label className="quoteformw-label">Type de couverture</label>
              <select
                value={formData.coverage}
                onChange={(e) => handleInputChange(e, 'coverage')}
                className="quoteformw-input"
              >
                <option value="">Sélectionner</option>
                <option value="tiers">Responsabilité civile (Tiers)</option>
                <option value="tiers-etendu">Tiers étendu</option>
                <option value="tous-risques">Tous risques</option>
              </select>
            </div>
            <div>
              <label className="quoteformw-label">Franchise souhaitée (FCFA)</label>
              <select
                value={formData.deductible}
                onChange={(e) => handleInputChange(e, 'deductible')}
                className="quoteformw-input"
              >
                <option value="">Sélectionner</option>
                <option value="0">Sans franchise</option>
                <option value="25000">25 000 FCFA</option>
                <option value="50000">50 000 FCFA</option>
                <option value="100000">100 000 FCFA</option>
              </select>
            </div>
            <div>
              <label className="quoteformw-label">Options souhaitées</label>
              <div className="quoteformw-options-grid">
                {['Assistance 24h/24', 'Véhicule de remplacement', 'Bris de glace', 'Vol/Incendie', 'Protection juridique'].map((option) => (
                  <label key={option} className="quoteformw-checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.options.includes(option)}
                      onChange={() => handleOptionToggle(option)}
                      className="quoteformw-checkbox"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="quoteformw-nav">
          <button
            onClick={onPrevStep}
            disabled={currentStep === 1}
            className={`quoteformw-btn quoteformw-btn-secondary${currentStep === 1 ? ' quoteformw-btn-disabled' : ''}`}
          >
            Précédent
          </button>
          <button
            onClick={onNextStep}
            className="quoteformw-btn quoteformw-btn-primary"
          >
            {currentStep === 3 ? 'Comparer les offres' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
