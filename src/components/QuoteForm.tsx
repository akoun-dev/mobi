import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './QuoteForm.css';
import Tooltip from './Tooltip';
import { saveQuoteProgress, loadQuoteProgress, clearQuoteProgress } from '../utils/saveQuoteUtils';

import type { FormData as QuoteFormData, OptionsDetaillees } from '../types/types';

interface QuoteFormProps {
  initialStep: number;
  formData: QuoteFormData;
  onInputChange: (field: string, value: string | OptionsDetaillees) => void;
  onOptionToggle: (option: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onResetForm: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({
  initialStep: currentStep,
  formData: initialFormData,
  onInputChange,
  onNextStep,
  onPrevStep,
  onResetForm
}) => {
  // Filtres déplacés dans FilterPanel

  const [formData, setFormData] = useState({
    ...initialFormData,
    energie: initialFormData.energie || 'Essence',
    formule: initialFormData.formule || 'Tiers Simple',
    optionsDetaillees: initialFormData.optionsDetaillees || {
      assistanceRoute: false,
      vehiculeRemplacement: false,
      brisGlace: false,
      protectionJuridique: false
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log('Initial form data received:', initialFormData);
    console.log('Current form state:', formData);
    console.log('Current step:', currentStep);
  }, [currentStep]);

  useEffect(() => {
    // Restaurer la progression au montage
    const saved = loadQuoteProgress();
    if (saved) {
      setFormData(saved.formData);
      // Ne pas modifier currentStep ici - géré par le parent
    }
  }, []);

  useEffect(() => {
    // Sauvegarder à chaque changement
    saveQuoteProgress(formData, currentStep);
  }, [formData, currentStep]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    onInputChange(field, e.target.value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Suppression de handleOptionToggle non utilisé

  // Nombre total d'étapes (0: Profil, 1: Véhicule, 2: Assurance)
  const totalSteps = 3;

  const [isPulsing, setIsPulsing] = useState(false);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  const isValidDateFormat = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 0) {
      if (!isValidDateFormat(formData.dateNaissance)) {
        newErrors.dateNaissance = 'Format invalide';
      }
      if (!isValidDateFormat(formData.datePermis)) {
        newErrors.datePermis = 'Format invalide';
      }
      if (
        isValidDateFormat(formData.dateNaissance) &&
        isValidDateFormat(formData.datePermis)
      ) {
        const birth = new Date(formData.dateNaissance);
        const license = new Date(formData.datePermis);
        const minLicenseDate = new Date(birth);
        minLicenseDate.setFullYear(minLicenseDate.getFullYear() + 18);
        if (license < minLicenseDate) {
          newErrors.datePermis =
            "La date du permis doit être après l'âge légal (18 ans)";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextClick = () => {
    if (!validateCurrentStep()) {
      return;
    }

    console.log('Next button clicked - current step:', currentStep);
    setIsPulsing(true);
    setTimeout(() => {
      setIsPulsing(false);
      console.log('Calling parent onNextStep');
      onNextStep();
    }, 400); // Durée de l'animation
  };
  
    const handleResetForm = () => {
      clearQuoteProgress();
      onResetForm();
    };

  return (
    <React.Fragment>
      <div className="quoteformw-bg">
        <div className="quoteformw-container">
          <div className="quoteformw-header">
          <h2 className="quoteformw-title">Obtenir un devis</h2>
          <button
            onClick={handleResetForm}
            className="quoteformw-close"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="quoteformw-progress">
          <div className="quoteformw-progress-labels">
            <span>Étape {Math.min(currentStep + 1, totalSteps)} sur {totalSteps}</span>
            <span>{Math.min(Math.round(((currentStep + 1) / totalSteps) * 100), 100)}% complété</span>
          </div>
          <div className="quoteformw-progress-bar">
            <div
              className="quoteformw-progress-bar-inner"
              style={{ width: `${Math.min(((currentStep + 1) / totalSteps) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        {/* Step 0: Profil de l'assuré */}
        {currentStep === 0 && (
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
                  onChange={(e) => {
                    handleInputChange(e, 'nom');
                    setFormData({...formData, nom: e.target.value});
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'prenom');
                    setFormData({...formData, prenom: e.target.value});
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'sexe');
                    setFormData({ ...formData, sexe: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'dateNaissance');
                    setFormData({ ...formData, dateNaissance: e.target.value });
                  }}
                  className={`quoteformw-input${errors.dateNaissance ? ' error' : ''}`}
                  required
                />
                {errors.dateNaissance && (
                  <span className="error-message">{errors.dateNaissance}</span>
                )}
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Adresse email de l'assuré</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    handleInputChange(e, 'email');
                    setFormData({ ...formData, email: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'telephone');
                    setFormData({ ...formData, telephone: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'profession');
                    setFormData({ ...formData, profession: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'datePermis');
                    setFormData({ ...formData, datePermis: e.target.value });
                  }}
                  className={`quoteformw-input${errors.datePermis ? ' error' : ''}`}
                  required
                />
                {errors.datePermis && (
                  <span className="error-message">{errors.datePermis}</span>
                )}
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Antécédents de sinistres (3 dernières années)*</label>
                <select
                  value={formData.antecedentsSinistres}
                  onChange={(e) => {
                    handleInputChange(e, 'antecedentsSinistres');
                    setFormData({ ...formData, antecedentsSinistres: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="0">0 sinistre</option>
                  <option value="1">1 sinistre</option>
                  <option value="2">2 sinistres</option>
                  <option value="3+">3+ sinistres</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {/* Step 2: Véhicule */}
        {currentStep === 1 && (
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
                  onChange={(e) => {
                    handleInputChange(e, 'immatriculation');
                    setFormData({ ...formData, immatriculation: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'nomCarteGrise');
                    setFormData({ ...formData, nomCarteGrise: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'marque');
                    setFormData({ ...formData, marque: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'genre');
                    setFormData({ ...formData, genre: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Catégorie/Usage du véhicule*</label>
                <input
                  type="text"
                  value={formData.categorie}
                  onChange={(e) => {
                    handleInputChange(e, 'categorie');
                    setFormData({ ...formData, categorie: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'puissance');
                    setFormData({ ...formData, puissance: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Énergie*</label>
                <div className="quoteformw-radio-group">
                  <label><input type="radio" name="energie" value="Essence" checked={formData.energie === 'Essence'} onChange={(e) => {
                    handleInputChange(e, 'energie');
                    setFormData({...formData, energie: e.target.value});
                  }} required /> Essence</label>
                  <label><input type="radio" name="energie" value="Diesel" checked={formData.energie === 'Diesel'} onChange={(e) => {
                    handleInputChange(e, 'energie');
                    setFormData({...formData, energie: e.target.value});
                  }} required /> Diesel</label>
                </div>
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Prix à neuf*</label>
                <input
                  type="number"
                  value={formData.prixNeuf}
                  onChange={(e) => {
                    handleInputChange(e, 'prixNeuf');
                    setFormData({ ...formData, prixNeuf: e.target.value });
                  }}
                  className="quoteformw-input"
                  placeholder="FCFA"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label label-with-tooltip">
                  <span>Prix estimé de la vente*</span>
                  <Tooltip message="Valeur vénale: estimation du prix actuel du véhicule." />
                </label>
                <input
                  type="number"
                  value={formData.prixVente}
                  onChange={(e) => {
                    handleInputChange(e, 'prixVente');
                    setFormData({ ...formData, prixVente: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'dateMiseCirculation');
                    setFormData({ ...formData, dateMiseCirculation: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Nombre de place assise*</label>
                <input
                  type="number"
                  value={formData.nbPlaces}
                  onChange={(e) => {
                    handleInputChange(e, 'nbPlaces');
                    setFormData({ ...formData, nbPlaces: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'ville');
                    setFormData({ ...formData, ville: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'couleur');
                    setFormData({ ...formData, couleur: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Usage principal du véhicule*</label>
                <select
                  value={formData.usagePrincipal}
                  onChange={(e) => {
                    handleInputChange(e, 'usagePrincipal');
                    setFormData({ ...formData, usagePrincipal: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="personnel">Personnel</option>
                  <option value="professionnel">Professionnel</option>
                  <option value="mixte">Mixte</option>
                </select>
              </div>
              <div>
                <label className="quoteformw-label">Kilométrage annuel (km)*</label>
                <input
                  type="number"
                  value={formData.kilometrageAnnuel}
                  onChange={(e) => {
                    handleInputChange(e, 'kilometrageAnnuel');
                    setFormData({ ...formData, kilometrageAnnuel: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                />
              </div>
            </div>
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label label-with-tooltip">
                  <span>Niveau de franchise souhaité (FCFA)</span>
                  <Tooltip message="Part des frais restant à votre charge après un sinistre." />
                </label>
                <input
                  type="number"
                  value={formData.niveauFranchise}
                  onChange={(e) => {
                    handleInputChange(e, 'niveauFranchise');
                    setFormData({ ...formData, niveauFranchise: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                />
              </div>
            </div>
          </div>
        )}
        {/* Step 3: Besoins d'assurance */}
        {currentStep === 2 && (
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
                  onChange={(e) => {
                    handleInputChange(e, 'dateEffet');
                    setFormData({ ...formData, dateEffet: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Périodicité/Durée du contrat*</label>
                <select
                  value={formData.periode}
                  onChange={(e) => {
                    handleInputChange(e, 'periode');
                    setFormData({ ...formData, periode: e.target.value });
                  }}
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
                  onChange={(e) => {
                    handleInputChange(e, 'preferenceCompagnie');
                    setFormData({ ...formData, preferenceCompagnie: e.target.value });
                  }}
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
                <label className="quoteformw-label label-with-tooltip">
                  <span>Formule d'assurance*</span>
                  <Tooltip message="Détermine l'étendue de la couverture de votre contrat." />
                </label>
                <div className="quoteformw-radio-group">
                  <label><input type="radio" name="formule" value="Tiers Simple" checked={formData.formule === 'Tiers Simple'} onChange={(e) => {
                    handleInputChange(e, 'formule');
                    setFormData({...formData, formule: e.target.value});
                  }} required /> Tiers Simple</label>
                  <label><input type="radio" name="formule" value="Tiers Complet" checked={formData.formule === 'Tiers Complet'} onChange={(e) => {
                    handleInputChange(e, 'formule');
                    setFormData({...formData, formule: e.target.value});
                  }} required /> Tiers Complet</label>
                  <label><input type="radio" name="formule" value="Tous risques" checked={formData.formule === 'Tous risques'} onChange={(e) => {
                    handleInputChange(e, 'formule');
                    setFormData({...formData, formule: e.target.value});
                  }} required /> Tous risques</label>
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
                      onChange={(e) => {
                        handleInputChange(e, 'typeSouscription');
                        setFormData({...formData, typeSouscription: e.target.value});
                      }}
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
            <div className="quoteformw-grid" style={{ marginTop: '16px' }}>
              <div style={{ gridColumn: '1 / span 2' }}>
                <label className="quoteformw-label">Options supplémentaires</label>
                <div className="quoteformw-checkbox-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      name="assistanceRoute"
                      checked={formData.optionsDetaillees?.assistanceRoute || false}
                      onChange={(e) => {
                        const updated = {
                          ...formData.optionsDetaillees,
                          assistanceRoute: e.target.checked
                        };
                        setFormData({
                          ...formData,
                          optionsDetaillees: updated
                        });
                        onInputChange('optionsDetaillees', updated);
                      }}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>Assistance routière</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      name="vehiculeRemplacement"
                      checked={formData.optionsDetaillees?.vehiculeRemplacement || false}
                      onChange={(e) => {
                        const updated = {
                          ...formData.optionsDetaillees,
                          vehiculeRemplacement: e.target.checked
                        };
                        setFormData({
                          ...formData,
                          optionsDetaillees: updated
                        });
                        onInputChange('optionsDetaillees', updated);
                      }}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>Véhicule de remplacement</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      name="brisGlace"
                      checked={formData.optionsDetaillees?.brisGlace || false}
                      onChange={(e) => {
                        const updated = {
                          ...formData.optionsDetaillees,
                          brisGlace: e.target.checked
                        };
                        setFormData({
                          ...formData,
                          optionsDetaillees: updated
                        });
                        onInputChange('optionsDetaillees', updated);
                      }}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>Bris de glace</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      name="protectionJuridique"
                      checked={formData.optionsDetaillees?.protectionJuridique || false}
                      onChange={(e) => {
                        const updated = {
                          ...formData.optionsDetaillees,
                          protectionJuridique: e.target.checked
                        };
                        setFormData({
                          ...formData,
                          optionsDetaillees: updated
                        });
                        onInputChange('optionsDetaillees', updated);
                      }}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>Protection juridique</span>
                  </label>
                </div>
              </div>
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
            {currentStep === 2 ? 'Comparer les offres' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  </React.Fragment>
);
};

export default QuoteForm;

