import React, { useState, useEffect } from 'react';
import { initAnalytics, trackPageView, trackQuoteSelected } from './services/analytics';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import Partners from './components/Partners';
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
import type { Quote, FormData, User } from './types/types';
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
    options: []
  });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  
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
      details: 'Couverture complète avec assistance premium'
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
      details: 'Protection optimale pour votre véhicule'
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
      details: 'Rapport qualité-prix excellent'
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
      details: 'Couverture premium avec services exclusifs'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
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

  const nextStep = () => {
    if (currentStep < 2) { // 0, 1, 2 (3 étapes au total)
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) { // Dernière étape
      setLoading(true);
      setTimeout(() => {
        setQuotes(mockQuotes);
        setShowResults(true);
        setLoading(false);
      }, 2000);
    }
  };

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
      options: []
    });
    setQuotes([]);
    setSelectedQuote(null);
  };

  const handleDownloadQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    trackQuoteSelected(quote.insurer);
  };

  const sendQuoteByEmail = () => {
    alert('Devis envoyé par email avec succès!');
  };

  const sendQuoteByWhatsApp = () => {
    alert('Devis envoyé par WhatsApp avec succès!');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-bg">
        <div className="loading-center">
          <div className="loading-spinner"></div>
          <p className="loading-title">Comparaison en cours...</p>
          <p className="loading-desc">Analyse des meilleures offres pour vous</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={
          <div className="main-content min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {!showQuoteForm && !showResults && (
              <>
                <HeroSection onCompareClick={() => {
                  console.log('Compare button clicked - setting showQuoteForm to true');
                  setShowQuoteForm(true);
                  setShowResults(false);
                  setCurrentStep(0);
                }} />
                <Features />
                <Partners />
              </>
            )}
            {showQuoteForm && !showResults && (
              <QuoteForm
                initialStep={currentStep}
                formData={formData}
                onInputChange={handleInputChange}
                onOptionToggle={handleOptionToggle}
                onNextStep={nextStep}
                onPrevStep={prevStep}
                onResetForm={resetForm}
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
