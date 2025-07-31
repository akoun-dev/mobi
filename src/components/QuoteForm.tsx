import React, { useRef, useState } from 'react';
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

  // Nombre total d'étapes (0: Vous êtes, 1: Profil, 2: Véhicule, 3: Assurance)
  const totalSteps = 4;

  const [isPulsing, setIsPulsing] = useState(false);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const handleNextClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
      onNextStep();
    }, 400); // Durée de l'animation
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
            <span>Étape {currentStep + 1} sur {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}% complété</span>
          </div>
          <div className="quoteformw-progress-bar">
            <div
              className="quoteformw-progress-bar-inner"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Step 0: Vous êtes */}
        {currentStep === 0 && (
          <div className="quoteformw-step">
            <h3 className="quoteformw-step-title">Vous êtes</h3>
            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <div style={{ marginBottom: 16 }}>Je souhaite avoir un devis pour :</div>
              <div className="quoteformw-radio-group" style={{ justifyContent: 'center' }}>
                <label style={{ margin: '0 16px' }}>
                  <input type="radio" name="devisPour" value="Moi même" checked={formData.devisPour === 'Moi même'} onChange={(e) => handleInputChange(e, 'devisPour')} required /> Moi même
                </label>
                <label style={{ margin: '0 16px' }}>
                  <input type="radio" name="devisPour" value="Quelqu'un d'autre" checked={formData.devisPour === "Quelqu'un d'autre"} onChange={(e) => handleInputChange(e, 'devisPour')} required /> Quelqu'un d'autre
                </label>
                <label style={{ margin: '0 16px' }}>
                  <input type="radio" name="devisPour" value="Une entreprise" checked={formData.devisPour === 'Une entreprise'} onChange={(e) => handleInputChange(e, 'devisPour')} required /> Une entreprise
                </label>
              </div>
            </div>
          </div>
        )}
        {/* Step 1: Profil de l'assuré */}
        {currentStep === 1 && (
          <div className="quoteformw-step">
            <h3 className="quoteformw-step-title">Profil de l'assuré</h3>
            <div className="quoteformw-info-box">
              Ces informations nous permettront de vous identifier et éditer votre police d'assurance.
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Nom*</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => handleInputChange(e, 'nom')}
                  className="quoteformw-input"
                  placeholder="Nom"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Prénom*</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange(e, 'prenom')}
                  className="quoteformw-input"
                  placeholder="Prénom"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Sexe*</label>
                <select
                  value={formData.sexe}
                  onChange={(e) => handleInputChange(e, 'sexe')}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <div>
                <label className="quoteformw-label">Date de naissance</label>
                <input
                  type="date"
                  value={formData.dateNaissance}
                  onChange={(e) => handleInputChange(e, 'dateNaissance')}
                  className="quoteformw-input"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Adresse email de l'assuré</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, 'email')}
                  className="quoteformw-input"
                  placeholder="exemple@email.com"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Numéro de téléphone*</label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange(e, 'telephone')}
                  className="quoteformw-input"
                  placeholder="07 00 00 00 00"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Profession / Catégorie socio professionnelle*</label>
                <select
                  value={formData.profession}
                  onChange={(e) => handleInputChange(e, 'profession')}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Salarié">Salarié</option>
                  <option value="Indépendant">Indépendant</option>
                  <option value="Étudiant">Étudiant</option>
                  <option value="Retraité">Retraité</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="quoteformw-label">Date de délivrance permis de conduire*</label>
                <input
                  type="date"
                  value={formData.datePermis}
                  onChange={(e) => handleInputChange(e, 'datePermis')}
                  className="quoteformw-input"
                  required
                />
              </div>
            </div>
          </div>
        )}
        {/* Step 2: Véhicule */}
        {currentStep === 2 && (
          <div className="quoteformw-step">
            <h3 className="quoteformw-step-title">Votre véhicule</h3>
            <div className="quoteformw-info-box">
              Les informations concernant votre véhicule sont marquées sur votre <b>Carte grise</b>. Veuillez vous en servir pour pouvoir renseigner ces champs.
            </div>
            <div className="quoteformw-grid">
              <div style={{ gridColumn: '1 / span 2' }}>
                <label className="quoteformw-label">Numéro d'immatriculation*</label>
                <input
                  type="text"
                  value={formData.immatriculation}
                  onChange={(e) => handleInputChange(e, 'immatriculation')}
                  className="quoteformw-input"
                  placeholder="Ex: 1234AB01"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Nom sur la carte grise*</label>
                <input
                  type="text"
                  value={formData.nomCarteGrise}
                  onChange={(e) => handleInputChange(e, 'nomCarteGrise')}
                  className="quoteformw-input"
                  placeholder="Entrez le nom figurant sur la carte grise"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Marque*</label>
                <input
                  type="text"
                  value={formData.marque}
                  onChange={(e) => handleInputChange(e, 'marque')}
                  className="quoteformw-input"
                  placeholder="Sélectionner la marque de votre véhicule"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Genre du véhicule*</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => handleInputChange(e, 'genre')}
                  className="quoteformw-input"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Catégorie/Usage du véhicule*</label>
                <input
                  type="text"
                  value={formData.categorie}
                  onChange={(e) => handleInputChange(e, 'categorie')}
                  className="quoteformw-input"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Puissance fiscale*</label>
                <input
                  type="text"
                  value={formData.puissance}
                  onChange={(e) => handleInputChange(e, 'puissance')}
                  className="quoteformw-input"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Énergie*</label>
                <div className="quoteformw-radio-group">
                  <label><input type="radio" name="energie" value="Essence" checked={formData.energie === 'Essence'} onChange={(e) => handleInputChange(e, 'energie')} required /> Essence</label>
                  <label><input type="radio" name="energie" value="Diesel" checked={formData.energie === 'Diesel'} onChange={(e) => handleInputChange(e, 'energie')} required /> Diesel</label>
                </div>
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Prix à neuf*</label>
                <input
                  type="number"
                  value={formData.prixNeuf}
                  onChange={(e) => handleInputChange(e, 'prixNeuf')}
                  className="quoteformw-input"
                  placeholder="FCFA"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Prix estimé de la vente*</label>
                <input
                  type="number"
                  value={formData.prixVente}
                  onChange={(e) => handleInputChange(e, 'prixVente')}
                  className="quoteformw-input"
                  placeholder="FCFA"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Date 1ère mise en circulation*</label>
                <input
                  type="date"
                  value={formData.dateMiseCirculation}
                  onChange={(e) => handleInputChange(e, 'dateMiseCirculation')}
                  className="quoteformw-input"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Nombre de place assise*</label>
                <input
                  type="number"
                  value={formData.nbPlaces}
                  onChange={(e) => handleInputChange(e, 'nbPlaces')}
                  className="quoteformw-input"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Ville/Zone de stationnement*</label>
                <select
                  value={formData.ville}
                  onChange={(e) => handleInputChange(e, 'ville')}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Abidjan">Abidjan</option>
                  <option value="Bouaké">Bouaké</option>
                  <option value="Yamoussoukro">Yamoussoukro</option>
                  <option value="San Pedro">San Pedro</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="quoteformw-label">Couleur du véhicule*</label>
                <input
                  type="text"
                  value={formData.couleur}
                  onChange={(e) => handleInputChange(e, 'couleur')}
                  className="quoteformw-input"
                  required
                />
              </div>
            </div>
          </div>
        )}
        {/* Step 3: Besoins d'assurance */}
        {currentStep === 3 && (
          <div className="quoteformw-step">
            <h3 className="quoteformw-step-title">Votre assurance</h3>
            <div className="quoteformw-info-box">
              Selectionnez et définissez la formule d'assurance automobile qui vous convient.
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Date de prise d'effet du contrat souhaitée*</label>
                <input
                  type="date"
                  value={formData.dateEffet}
                  onChange={(e) => handleInputChange(e, 'dateEffet')}
                  className="quoteformw-input"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Périodicité/Durée du contrat*</label>
                <select
                  value={formData.periode}
                  onChange={(e) => handleInputChange(e, 'periode')}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Annuelle">Annuelle</option>
                  <option value="Semestrielle">Semestrielle</option>
                  <option value="Trimestrielle">Trimestrielle</option>
                  <option value="Mensuelle">Mensuelle</option>
                </select>
              </div>
            </div>
            <div className="quoteformw-grid">
              <div style={{ gridColumn: '1 / span 2' }}>
                <label className="quoteformw-label">Avez-vous une préférence pour une compagnie particulière ?</label>
                <select
                  value={formData.preferenceCompagnie}
                  onChange={(e) => handleInputChange(e, 'preferenceCompagnie')}
                  className="quoteformw-input"
                  required
                >
                  <option value="NON">NON</option>
                  <option value="OUI">OUI</option>
                </select>
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Formule d'assurance*</label>
                <div className="quoteformw-radio-group">
                  <label><input type="radio" name="formule" value="Tiers Simple" checked={formData.formule === 'Tiers Simple'} onChange={(e) => handleInputChange(e, 'formule')} required /> Tiers Simple</label>
                  <label><input type="radio" name="formule" value="Tiers Complet" checked={formData.formule === 'Tiers Complet'} onChange={(e) => handleInputChange(e, 'formule')} required /> Tiers Complet</label>
                  <label><input type="radio" name="formule" value="Tous risques" checked={formData.formule === 'Tous risques'} onChange={(e) => handleInputChange(e, 'formule')} required /> Tous risques</label>
                </div>
              </div>
              <div>
                <label className="quoteformw-label">Type de souscription*</label>
                <div className="quoteformw-radio-group">
                  <label>
                    <input
                      type="radio"
                      name="typeSouscription"
                      value="Prédefinie"
                      checked={formData.typeSouscription === 'Prédefinie'}
                      onClick={e => {
                        if (formData.typeSouscription === 'Prédefinie') {
                          onInputChange('typeSouscription', '');
                        }
                      }}
                      onChange={e => handleInputChange(e, 'typeSouscription')}
                      required
                    /> Choisir une Formule prédéfinie
                  </label>
                </div>
              </div>
            </div>
            <div className="quoteformw-info-box" style={{ marginTop: 16 }}>
              {/* Zone d'information sur la formule sélectionnée */}
              {formData.formule === 'Tiers Simple' && (
                <div>
                  <b>L'assurance au tiers simple</b> est la formule Auto la plus basique et obligatoire.<br />
                  Elle renferme les garanties suivantes :<br />
                  <b>La responsabilité civile :</b> Elle ne couvre que les dommages matériels et corporels causés aux tiers, en cas d'accident dont vous êtes responsables. Elle ne couvre pas ceux que vous-même et votre véhicule subissez.
                </div>
              )}
              {formData.formule === 'Tiers Complet' && (
                <div>
                  <b>L'assurance au tiers complet</b> offre une couverture plus étendue que le tiers simple, incluant des garanties supplémentaires selon les assureurs.
                </div>
              )}
              {formData.formule === 'Tous risques' && (
                <div>
                  <b>L'assurance tous risques</b> est la formule la plus complète, couvrant la plupart des dommages subis par votre véhicule, même en cas d'accident responsable.
                </div>
              )}
            </div>
          </div>
        )}
        {/* Navigation Buttons */}
        <div className="quoteformw-nav">
          <button
            onClick={onPrevStep}
            disabled={currentStep === 0}
            className={`quoteformw-btn quoteformw-btn-secondary${currentStep === 0 ? ' quoteformw-btn-disabled' : ''}`}
          >
            Précédent
          </button>
          <button
            ref={nextBtnRef}
            onClick={handleNextClick}
            className={`quoteformw-btn quoteformw-btn-primary${isPulsing ? ' animate-pulse' : ''}`}
          >
            {currentStep === 3 ? 'Comparer les offres' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
