import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { FormData as QuoteFormData, OptionsDetaillees } from '../types/types';

import './QuoteForm.css';
import { saveQuoteProgress, loadQuoteProgress, clearQuoteProgress } from '../utils/saveQuoteUtils';
import {
  trackFormStart,
  trackFormComplete,
  trackFormStep,
  trackConversion,
  trackEvent,
  trackQuoteSelected
} from '../services/analytics';



/**
 * Props du composant QuoteForm
 * @typedef {Object} QuoteFormProps
 * @property {number} initialStep - Étape initiale du formulaire (0-2)
 * @property {QuoteFormData} formData - Données initiales du formulaire
 * @property {function} onInputChange - Callback appelé quand un champ change
 * @property {function} onOptionToggle - Callback appelé quand une option est toggle
 * @property {function} onNextStep - Callback appelé pour passer à l'étape suivante
 * @property {function} onPrevStep - Callback appelé pour revenir à l'étape précédente
 * @property {function} onResetForm - Callback appelé pour réinitialiser le formulaire
 * @property {function} onSubmit - Callback appelé pour soumettre le formulaire
 */
interface QuoteFormProps {
  initialStep: number;
  formData: QuoteFormData;
  onInputChange: (field: string, value: string | OptionsDetaillees) => void;
  onOptionToggle: (option: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onResetForm: () => void;
  onSubmit: (values: { selectedInsurer: string; selectedPrice: number }) => void;
}

/**
 * Composant de formulaire multi-étapes pour obtenir un devis d'assurance auto
 * @component
 * @param {QuoteFormProps} props - Les props du composant
 * @returns {JSX.Element} Le formulaire de devis
 */
const QuoteFormComponent: React.FC<QuoteFormProps> = (props) => {
  const {
    initialStep,
    formData: initialFormData,
    onInputChange,
    onNextStep,
    onPrevStep,
    onResetForm
  } = props;
  
  const [currentStep, setCurrentStep] = useState(initialStep);

  useEffect(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);
  const [formData, setFormData] = useState<QuoteFormData>({
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
    if (process.env.NODE_ENV === 'development') {
      console.log('Initial form data received:', initialFormData);
      console.log('Current form state:', formData);
      console.log('Current step:', currentStep, 'Initial step:', initialStep);
      }
      console.log('Tracking step:', currentStep + 1);
      trackFormStep(currentStep + 1); // +1 car les étapes commencent à 0
  }, [currentStep, formData, initialFormData]);

  useEffect(() => {
    // Track form start
    trackFormStart();
    
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

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
      const value = e.target.value;
      onInputChange(field, value);
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [onInputChange, errors, setFormData]
  );

  // Suppression de handleOptionToggle non utilisé

  // Nombre total d'étapes (0: Profil, 1: Véhicule, 2: Assurance)
  const totalSteps = 3;

  // Libellés d'étapes pour l'indicateur
  const stepLabels = ['INFO ASSURÉ', 'INFO VEHICULE', 'OPTIONS'];

  const [isPulsing, setIsPulsing] = useState(false);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  // const isValidDateFormat = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value); // masqué: non utilisé avec les champs cachés

  const validateEmail = (email: string): boolean => {
    if (!email) return true; // facultatif à l'étape 0
    // Regex email simple
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Format CI courant, accepte espaces: 07 00 00 00 00 ou 0700000000
    const digits = phone.replace(/\s+/g, '');
    return /^(01|05|07)\d{8}$/.test(digits);
  };

  const validateCurrentStep = React.useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 0) {
      // Email facultatif mais contrôle si présent
      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'Email invalide';
      }
      // Téléphone obligatoire + contrôle
      if (!formData.telephone) {
        newErrors.telephone = 'Le numéro est obligatoire';
      } else if (!validatePhone(formData.telephone)) {
        newErrors.telephone = 'Numéro invalide (ex: 0700000000)';
      }
      // Les autres contrôles (date naissance, permis...) sont masqués à cette étape selon consigne
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [currentStep, formData.email, formData.telephone]);

  const handleNextClick = React.useCallback(() => {
    if (!validateCurrentStep()) {
      trackEvent('Form', 'Abandoned', `Step ${currentStep + 1}`);
      return;
    }

    console.log('Next button clicked - current step:', currentStep);
    setIsPulsing(true);
    
    setTimeout(() => {
      setIsPulsing(false);
      trackFormStep(currentStep + 1);
      
      if (currentStep === 2) {
        trackFormComplete();
        Object.entries(formData.optionsDetaillees).forEach(([option, isSelected]) => {
          if (isSelected) {
            trackEvent('Options', 'Selected', option);
          }
        });

        const selectedInsurer = formData.preferenceCompagnie === 'OUI'
          ? formData.preferenceCompagnie
          : 'Aucune préférence';
        const price = Number(formData.prixVente) || Number(formData.prixNeuf) || 0;
        trackConversion(selectedInsurer, price);
        trackQuoteSelected(formData.formule);
      }
      
      console.log('Before onNextStep - currentStep:', currentStep);
      onNextStep();
      console.log('After onNextStep - currentStep should update via props');
      // onNextStep(); // suppression du double appel pour éviter de sauter une étape
    }, 400);
  }, [currentStep, formData, onNextStep, validateCurrentStep]);
  
  const handleResetForm = React.useCallback(() => {
    clearQuoteProgress();
    onResetForm();
  }, [onResetForm]);

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
        {/* Progress Bar + Step Labels */}
        <div className="quoteformw-progress">
          {/* Remplacer “Étape X sur Y” par le libellé courant */}
          <div className="quoteformw-progress-labels">
            <span className="current-step-label">{stepLabels[currentStep] || ''}</span>
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

            {/* Champs visibles autorisés */}
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Nom*</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => {
                    handleInputChange(e, 'nom');
                    setFormData({ ...formData, nom: e.target.value });
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
                    setFormData({ ...formData, prenom: e.target.value });
                  }}
                  className="quoteformw-input"
                  placeholder="Prénom"
                  required
                />
              </div>
            </div>

            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Adresse email de l'assuré <span className="label-optional">(facultatif)</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    handleInputChange(e, 'email');
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  className={`quoteformw-input${errors.email ? ' error' : ''}`}
                  placeholder="exemple@email.com"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>
              <div>
                <label className="quoteformw-label">Numéro de téléphone* <span className="label-required">(obligatoire)</span></label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => {
                    handleInputChange(e, 'telephone');
                    setFormData({ ...formData, telephone: e.target.value });
                  }}
                  className={`quoteformw-input${errors.telephone ? ' error' : ''}`}
                  placeholder="07 00 00 00 00"
                  required
                />
                {errors.telephone && (
                  <span className="error-message">{errors.telephone}</span>
                )}
              </div>
            </div>

            {/* Champs masqués paramétrablement (conservés dans le DOM pour évolutivité) */}
            <div className="quoteformw-grid quoteformw-hidden">
              <div>
                <label className="quoteformw-label">Sexe*</label>
                <select
                  value={formData.sexe}
                  onChange={(e) => {
                    handleInputChange(e, 'sexe');
                    setFormData({ ...formData, sexe: e.target.value });
                  }}
                  className="quoteformw-input"
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
                />
                {errors.dateNaissance && (
                  <span className="error-message">{errors.dateNaissance}</span>
                )}
              </div>
            </div>

            <div className="quoteformw-grid quoteformw-hidden">
              <div>
                <label className="quoteformw-label">Profession / Catégorie socio professionnelle*</label>
                <select
                  value={formData.profession}
                  onChange={(e) => {
                    handleInputChange(e, 'profession');
                    setFormData({ ...formData, profession: e.target.value });
                  }}
                  className="quoteformw-input"
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
                />
                {errors.datePermis && (
                  <span className="error-message">{errors.datePermis}</span>
                )}
              </div>
            </div>

            <div className="quoteformw-grid quoteformw-hidden">
              <div>
                <label className="quoteformw-label">Antécédents de sinistres (3 dernières années)*</label>
                <select
                  value={formData.antecedentsSinistres}
                  onChange={(e) => {
                    handleInputChange(e, 'antecedentsSinistres');
                    setFormData({ ...formData, antecedentsSinistres: e.target.value });
                  }}
                  className="quoteformw-input"
                >
                  <option value="">Sélectionner</option>
                  <option value="0">0 sinistre</option>
                  <option value="1">1 sinistre</option>
                  <option value="2">2 sinistres</option>
                  <option value="3+">3+ sinistres</option>
                </select>
              </div>
            </div>

            {/* Bannière d’informations clés */}
            <div className="quoteformw-banner">
              <div className="banner-item">
                <span className="banner-emoji" aria-hidden>🔒</span>
                <div>
                  <div className="banner-title">Vos données personnelles sont précieuses</div>
                  <div className="banner-text">Rassurez-vous, nous ne les transmettrons jamais sans votre accord.</div>
                </div>
              </div>
              <div className="banner-item">
                <span className="banner-emoji" aria-hidden>🔭</span>
                <div>
                  <div className="banner-title">Une comparaison 100% gratuite</div>
                  <div className="banner-text">Bonne nouvelle : zéro frais caché, zéro commission !</div>
                </div>
              </div>
              <div className="banner-item">
                <span className="banner-emoji" aria-hidden>📄</span>
                <div>
                  <div className="banner-title">Des offres sur‑mesure</div>
                  <div className="banner-text">Nous vous proposons les offres les plus adaptées à votre profil.</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Step 2: Véhicule */}
        {currentStep === 1 && (
          <div className="quoteformw-step">
            <h3 className="quoteformw-step-title">Info Véhicule</h3>
            <div className="quoteformw-info-box">
              Renseignez uniquement les champs nécessaires. Les autres peuvent être masqués selon vos besoins.
            </div>

            {/* Énergie */}
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Énergie*</label>
                <select
                  value={formData.energie}
                  onChange={(e) => {
                    handleInputChange(e, 'energie');
                    setFormData({ ...formData, energie: e.target.value });
                    // Réinitialiser la puissance si le type change
                    setFormData(prev => ({ ...prev, puissance: '' }));
                  }}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>

              {/* Puissance fiscale: selon énergie */}
              <div>
                <label className="quoteformw-label">Puissance fiscale*</label>
                <select
                  value={formData.puissance}
                  onChange={(e) => {
                    handleInputChange(e, 'puissance');
                    setFormData({ ...formData, puissance: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  {formData.energie === 'Diesel'
                    ? Array.from({ length: 9 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n.toString()}>{n}{n === 9 ? '+' : ''}</option>
                      ))
                    : Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n.toString()}>{n}{n === 12 ? '+' : ''}</option>
                      ))
                  }
                </select>
              </div>
            </div>

            {/* Nombre de places + Date de mise en circulation */}
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Nombre de places*</label>
                <select
                  value={formData.nbPlaces}
                  onChange={(e) => {
                    handleInputChange(e, 'nbPlaces');
                    setFormData({ ...formData, nbPlaces: e.target.value });
                  }}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  {[3,4,5,6,7,8].map(n => (
                    <option key={n} value={n.toString()}>{n}{n === 8 ? '+' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="quoteformw-label">Date de mise en circulation*</label>
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
            </div>

            {/* Valeurs */}
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Valeur neuve (FCFA)*</label>
                <input
                  type="number"
                  value={formData.prixNeuf}
                  onChange={(e) => {
                    handleInputChange(e, 'prixNeuf');
                    setFormData({ ...formData, prixNeuf: e.target.value });
                  }}
                  className="quoteformw-input"
                  placeholder="Ex: 12 000 000"
                  required
                />
              </div>
              <div>
                <label className="quoteformw-label">Valeur vénale (actuelle) (FCFA)*</label>
                <input
                  type="number"
                  value={formData.prixVente}
                  onChange={(e) => {
                    handleInputChange(e, 'prixVente');
                    setFormData({ ...formData, prixVente: e.target.value });
                  }}
                  className="quoteformw-input"
                  placeholder="Ex: 6 500 000"
                  required
                />
              </div>
            </div>

            {/* Usage */}
            <div className="quoteformw-grid">
              <div>
                <label className="quoteformw-label">Usage du véhicule*</label>
                <select
                  value={formData.usagePrincipal}
                  onChange={(e) => {
                    handleInputChange(e, 'usagePrincipal');
                    setFormData({ ...formData, usagePrincipal: e.target.value as 'personnel' | 'professionnel' | 'mixte' });
                  }}
                  className="quoteformw-input"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="personnel">Privé</option>
                  <option value="professionnel">Professionnel</option>
                </select>
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
            {/* Champ “Préférence compagnie” masqué selon consigne */}
            {/* <div className="quoteformw-grid"> ... </div> */}
            {/* Nouvelle section “Quelle formule souhaitez‑vous ?” avec cartes enrichissables dynamiquement */}
            <div className="quoteformw-formules" role="group" aria-label="Choix de la formule">
              <h4 className="quoteformw-formules-title">Quelle formule souhaitez‑vous ?</h4>
              <p className="quoteformw-formules-help">Pas d’inquiétude, vous pourrez modifier cette information sur la page de résultats.</p>

              <div className="quoteformw-formules-grid">
                {[
                  {key: 'Tiers Simple', title: 'Tiers', checks: ['Responsabilité civile'], crosses: ['Vol incendie', 'Dommage tous accidents']},
                  {key: 'Tiers Complet', title: 'Vol & Incendie', checks: ['Responsabilité civile','Vol incendie'], crosses: ['Dommage tous accidents']},
                  {key: 'Tous risques', title: 'Tous risques', checks: ['Responsabilité civile','Vol incendie','Dommage tous accidents'], crosses: []},
                ].map((f) => {
                  const active = formData.formule === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      className={`formule-card${active ? ' active' : ''}`}
                      onClick={() => {
                        handleInputChange({ target: { value: f.key } } as unknown as React.ChangeEvent<HTMLInputElement>, 'formule');
                        setFormData({ ...formData, formule: f.key });
                      }}
                      aria-pressed={active}
                    >
                      <div className="formule-card-header">
                        <span className={`formule-radio${active ? ' checked' : ''}`} aria-hidden />
                        <span className="formule-title">{f.title}</span>
                      </div>
                      <ul className="formule-features" aria-label={`Garanties incluses pour ${f.title}`}>
                        {f.checks.map((c) => (
                          <li key={c} className="ok">✓ {c}</li>
                        ))}
                        {f.crosses.map((c) => (
                          <li key={c} className="ko">✕ {c}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              {/* Emplacement extensible: offres partenaires dynamiques */}
              <div className="formule-partners-note">
                Cette section pourra être enrichie dynamiquement par les offres de nos partenaires (prix, garanties, promos).
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
            {currentStep === 2 ? 'Comparer les offres' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  </React.Fragment>
);
};
const QuoteForm = React.memo(QuoteFormComponent);

QuoteForm.displayName = 'QuoteForm';

export default QuoteForm;

