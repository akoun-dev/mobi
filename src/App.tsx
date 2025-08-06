import React, { useState, useEffect } from 'react';
import { initAnalytics, trackPageView, trackQuoteSelected, trackEvent } from './services/analytics';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import Partners from './components/Partners';
import Reviews from './components/Reviews.tsx';
import QuoteForm from './components/QuoteForm';
import Results from './components/Results';
import QuoteDownloadModal from './components/QuoteDownloadModal';
import Footer from './components/Footer';
import About from './components/About';
import FAQ from './components/FAQ';
import Assurance from './components/Assurance';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import type { FormData, User, OptionsDetaillees } from './types/types';
import type { Quote } from './types/insurer';
import './LoadingScreen.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  useEffect(() => {
    initAnalytics();
    trackPageView(window.location.pathname);
  }, []);
  // Initialisation des états
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    console.log('Form state:', { showQuoteForm, showResults, currentStep });
  }, [showQuoteForm, showResults, currentStep]);
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    sexe: '',
    dateNaissance: '',
    email: '',
    telephone: '',
    profession: '',
    datePermis: '',
    immatriculation: '',
    nomCarteGrise: '',
    marque: '',
    genre: '',
    categorie: '',
    puissance: '',
    energie: '',
    prixNeuf: '',
    prixVente: '',
    dateMiseCirculation: '',
    nbPlaces: '',
    ville: '',
    couleur: '',
    dateEffet: '',
    periode: '',
    preferenceCompagnie: '',
    formule: '',
    typeSouscription: '',
    options: [],
    antecedentsSinistres: '',
    nombreSinistres: 0,
    typeSinistres: [],
    usagePrincipal: 'personnel',
    kilometrageAnnuel: 0,
    niveauFranchise: 0,
    optionsDetaillees: {
      assistanceRoute: false,
      vehiculeRemplacement: false,
      brisGlace: false,
      protectionJuridique: false
    }
  });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  // const [loading, setLoading] = useState(false); // inutilisé dans la maquette
  
  // État d'authentification
  const [user, setUser] = useState<User | null>(null);

  const mockQuotes: Quote[] = [
    {
      id: 1,
      insurer: 'NSIA Assurance',
      logo: '🛡️',
      price: 85000,
      coverage: 'Tous risques',
      deductible: 25000,
      options: ['Assistance 24h/24', 'Véhicule de remplacement', 'Protection juridique'],
      rating: 4.5,
      details: 'Couverture complète avec assistance premium',
      subscribeUrl: 'https://www.nsia.com/auto/souscription'
    },
    {
      id: 2,
      insurer: 'Atlantique Assurance',
      logo: '🌊',
      price: 92000,
      coverage: 'Tous risques',
      deductible: 20000,
      options: ['Assistance 24h/24', 'Bris de glace', 'Vol/Incendie'],
      rating: 4.2,
      details: 'Protection optimale pour votre véhicule',
      subscribeUrl: 'https://www.atlantiqueassurance.com/souscription-auto'
    },
    {
      id: 3,
      insurer: 'Saham Assurance',
      logo: '⭐',
      price: 78000,
      coverage: 'Tiers étendu',
      deductible: 30000,
      options: ['Assistance dépannage', 'Protection juridique'],
      rating: 4.0,
      details: 'Rapport qualité-prix excellent',
      subscribeUrl: 'https://sahamassurance.com/auto/souscription'
    },
    {
      id: 4,
      insurer: 'Allianz CI',
      logo: '🏆',
      price: 98000,
      coverage: 'Tous risques Premium',
      deductible: 15000,
      options: ['Assistance 24h/24', 'Véhicule de remplacement', 'Bris de glace', 'Vol/Incendie', 'Protection juridique'],
      rating: 4.8,
      details: 'Couverture premium avec services exclusifs',
      subscribeUrl: 'https://www.allianz-ci.com/souscription-auto'
    },
    {
      id: 5,
      insurer: "AXA Côte d'Ivoire",
      logo: '🔰',
      price: 80000,
      coverage: 'Tous risques',
      deductible: 22000,
      options: ['Assistance 24h/24', 'Protection juridique'],
      rating: 4.3,
      details: 'Service client réactif et garanties solides',
      subscribeUrl: 'https://www.axa.ci/auto/souscription'
    },
    {
      id: 6,
      insurer: 'Zenith Insurance',
      logo: '💼',
      price: 75000,
      coverage: 'Tiers étendu',
      deductible: 28000,
      options: ['Assistance dépannage'],
      rating: 3.9,
      details: 'Formule économique pour petits budgets',
      subscribeUrl: 'https://www.zenith.ci/souscription-auto'
    },
    {
      id: 7,
      insurer: 'Continental Assurance',
      logo: '🚗',
      price: 87000,
      coverage: 'Tous risques',
      deductible: 25000,
      options: ['Véhicule de remplacement', 'Bris de glace'],
      rating: 4.1,
      details: 'Bon équilibre entre prix et garanties',
      subscribeUrl: 'https://www.continental.ci/auto/souscription'
    },
    {
      id: 8,
      insurer: 'Fidelis Assurance',
      logo: '🌀',
      price: 90000,
      coverage: 'Tous risques Premium',
      deductible: 18000,
      options: ['Vol/Incendie', 'Bris de glace', 'Protection juridique'],
      rating: 4.4,
      details: 'Couverture étendue pour véhicules neufs',
      subscribeUrl: 'https://www.fidelis.ci/souscription-auto'
    },
    {
      id: 9,
      insurer: 'SUNU Assurance',
      logo: '☀️',
      price: 77000,
      coverage: 'Tiers étendu',
      deductible: 26000,
      options: ['Assistance dépannage', 'Protection juridique'],
      rating: 4.0,
      details: 'Large réseau de garages partenaires',
      subscribeUrl: 'https://www.sunu.com/souscription-auto'
    },
    {
      id: 10,
      insurer: 'ORA Insurance',
      logo: '🌐',
      price: 65000,
      coverage: 'Tiers simple',
      deductible: 35000,
      options: ['Responsabilité civile'],
      rating: 3.7,
      details: 'Offre basique pour conducteurs expérimentés',
      subscribeUrl: 'https://www.ora.ci/auto/souscription'
    }
  ];

  const handleInputChange = (field: string, value: string | OptionsDetaillees) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptionToggle = (option: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.includes(option)
        ? prev.options.filter(opt => opt !== option)
        : [...prev.options, option]
    }));
  };

  // NOTE: Flux de maquette: onNextStep du QuoteForm force directement l'affichage des résultats.
  // nextStep n'est plus utilisé ici pour éviter l'erreur ESLint "assigned but never used".

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setShowQuoteForm(false);
    setCurrentStep(0);
    setShowResults(false);
    setFormData({
      nom: '',
      prenom: '',
      sexe: '',
      dateNaissance: '',
      email: '',
      telephone: '',
      profession: '',
      datePermis: '',
      immatriculation: '',
      nomCarteGrise: '',
      marque: '',
      genre: '',
      categorie: '',
      puissance: '',
      energie: '',
      prixNeuf: '',
      prixVente: '',
      dateMiseCirculation: '',
      nbPlaces: '',
      ville: '',
      couleur: '',
      dateEffet: '',
      periode: '',
      preferenceCompagnie: '',
      formule: '',
      typeSouscription: '',
      options: [],
      antecedentsSinistres: '',
      nombreSinistres: 0,
      typeSinistres: [],
      usagePrincipal: 'personnel',
      kilometrageAnnuel: 0,
      niveauFranchise: 0,
      optionsDetaillees: {
        assistanceRoute: false,
        vehiculeRemplacement: false,
        brisGlace: false,
        protectionJuridique: false
      }
    });
    setQuotes([]);
    setSelectedQuote(null);
  };

  const handleDownloadQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    trackQuoteSelected(quote.insurer);
  };

  const sendQuoteByEmail = async () => {
    if (!selectedQuote) return;
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, quote: selectedQuote })
      });
    } catch (err) {
      console.error('Failed to send email', err);
    }
  };

  const sendQuoteByWhatsApp = () => {
    if (!selectedQuote) return;
    const message = encodeURIComponent(
      `Devis ${selectedQuote.insurer} - ${selectedQuote.price.toLocaleString()} FCFA`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleCompareClick = () => {
    console.log('Compare button clicked - setting showQuoteForm to true');
    trackEvent('CTA', 'Hero Compare Click');
    setShowQuoteForm(true);
    setShowResults(false);
    setCurrentStep(0); // démarrer à l'étape 0
  };

  // Écran de chargement désactivé dans la maquette statique (pas de loading)

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} onCompareClick={handleCompareClick} />
      <Routes>
        <Route path="/" element={
          <div className="main-content min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {!showQuoteForm && !showResults && (
              <>
                <HeroSection onCompareClick={handleCompareClick} />
                <Features />
                <Partners />
                <Reviews />
              </>
            )}
            {showQuoteForm && !showResults && (
              <QuoteForm
                initialStep={currentStep}
                formData={formData}
                onInputChange={handleInputChange}
                onOptionToggle={handleOptionToggle}
                onNextStep={() => {
                  // Avancer d'une étape dans le formulaire
                  setCurrentStep((prev) => {
                    const next = Math.min(prev + 1, 2);
                    // Quand on vient de valider la dernière étape (2), on affiche les résultats
                    if (next === 2 && prev === 2) {
                      setQuotes(mockQuotes);
                      setShowResults(true);
                    }
                    return next;
                  });
                }}
                onPrevStep={prevStep}
                onResetForm={resetForm}
                onSubmit={(values) => {
                  console.log('Quote selected:', values);
                  setSelectedQuote(mockQuotes.find(q => q.id === parseInt(values.selectedInsurer)) || null);
                }}
              />
            )}
            {showResults && (
              <Results
                quotes={quotes}
                onResetForm={resetForm}
                onDownloadQuote={handleDownloadQuote}
              />
            )}
            <QuoteDownloadModal
              quote={selectedQuote}
              onClose={() => setSelectedQuote(null)}
              onDownload={handleDownloadQuote}
              onSendEmail={sendQuoteByEmail}
              onSendWhatsApp={sendQuoteByWhatsApp}
            />
          </div>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/assurance" element={<Assurance />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/dashboard" element={
          user ? <Dashboard user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/admin" element={
          user && user.role === 'admin' ? <Admin user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />
        } />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
