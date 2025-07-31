import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { QuoteRequest, User } from '../types/types';
import './Dashboard.css';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'profile'>('overview');
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [editProfileData, setEditProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || ''
  });
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock data pour les demandes de devis
  const mockQuoteRequests: QuoteRequest[] = [
    {
      id: 1,
      userId: user.id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      formData: {
        age: '28',
        licenseYears: '5',
        accidents: '0',
        usage: 'personnel',
        annualKm: '15000',
        vehicleValue: '8000000',
        energy: 'essence',
        registrationDate: '2020-03-15',
        seats: '5',
        coverage: 'tous_risques',
        options: ['assistance', 'bris_glace'],
        deductible: '25000'
      },
      quotes: [
        {
          id: 1,
          insurer: 'NSIA Assurance',
          logo: '🛡️',
          price: 85000,
          coverage: 'Tous risques',
          deductible: 25000,
          options: ['Assistance 24h/24', 'Véhicule de remplacement'],
          rating: 4.5,
          details: 'Couverture complète avec assistance premium'
        }
      ],
      selectedQuote: {
        id: 1,
        insurer: 'NSIA Assurance',
        logo: '🛡️',
        price: 85000,
        coverage: 'Tous risques',
        deductible: 25000,
        options: ['Assistance 24h/24', 'Véhicule de remplacement'],
        rating: 4.5,
        details: 'Couverture complète avec assistance premium'
      },
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:45:00Z'
    },
    {
      id: 2,
      userId: user.id,
      userEmail: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      formData: {
        age: '28',
        licenseYears: '5',
        accidents: '0',
        usage: 'professionnel',
        annualKm: '25000',
        vehicleValue: '12000000',
        energy: 'diesel',
        registrationDate: '2023-08-20',
        seats: '7',
        coverage: 'tiers_etendu',
        options: ['assistance'],
        deductible: '30000'
      },
      quotes: [
        {
          id: 2,
          insurer: 'Atlantique Assurance',
          logo: '🌊',
          price: 92000,
          coverage: 'Tiers étendu',
          deductible: 30000,
          options: ['Assistance 24h/24'],
          rating: 4.2,
          details: 'Protection optimale pour votre véhicule'
        }
      ],
      status: 'pending',
      createdAt: '2024-01-20T14:15:00Z',
      updatedAt: '2024-01-20T14:15:00Z'
    }
  ];

  useEffect(() => {
    // Simulation d'un appel API
    setTimeout(() => {
      setQuoteRequests(mockQuoteRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', class: 'status-pending' },
      completed: { label: 'Terminé', class: 'status-completed' },
      cancelled: { label: 'Annulé', class: 'status-cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    totalRequests: quoteRequests.length,
    completedRequests: quoteRequests.filter(req => req.status === 'completed').length,
    pendingRequests: quoteRequests.filter(req => req.status === 'pending').length,
    totalSavings: quoteRequests
      .filter(req => req.selectedQuote)
      .reduce((sum, req) => sum + (req.selectedQuote?.price || 0), 0)
  };

  const handleEditProfile = () => {
    setShowEditProfileModal(true);
  };

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleViewDetails = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setShowRequestDetailsModal(true);
  };

  const handleDownload = (request: QuoteRequest) => {
    // Simulation de téléchargement
    const data = {
      requestId: request.id,
      user: request.userName,
      selectedQuote: request.selectedQuote,
      date: request.createdAt
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `devis_${request.id}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('Devis téléchargé avec succès !');
  };

  const handleSaveProfile = () => {
    // Simulation de sauvegarde
    alert('Profil mis à jour avec succès !');
    setShowEditProfileModal(false);
  };

  const handleSavePassword = () => {
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    if (changePasswordData.newPassword.length < 6) {
      alert('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    // Simulation de changement de mot de passe
    alert('Mot de passe modifié avec succès !');
    setChangePasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowChangePasswordModal(false);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Tableau de bord</h1>
          <p>Bienvenue, {user.firstName} !</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/" className="new-quote-btn">
            Nouveau devis
          </Link>
          <button onClick={onLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historique
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profil
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{stats.totalRequests}</h3>
                  <p>Demandes totales</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>{stats.completedRequests}</h3>
                  <p>Devis finalisés</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{stats.pendingRequests}</h3>
                  <p>En attente</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>{stats.totalSavings.toLocaleString()} FCFA</h3>
                  <p>Économies totales</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Activité récente</h2>
              <div className="activity-list">
                {quoteRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="activity-item">
                    <div className="activity-icon">
                      {request.status === 'completed' ? '✅' : '⏳'}
                    </div>
                    <div className="activity-content">
                      <h4>Devis {request.id}</h4>
                      <p>{request.quotes[0]?.insurer} - {request.quotes[0]?.price.toLocaleString()} FCFA</p>
                      <span className="activity-date">{formatDate(request.createdAt)}</span>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h2>Historique des demandes</h2>
            <div className="requests-list">
              {quoteRequests.map((request) => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="request-info">
                      <h3>Demande #{request.id}</h3>
                      <p>Créée le {formatDate(request.createdAt)}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="request-details">
                    <div className="detail-row">
                      <span className="detail-label">Véhicule:</span>
                      <span className="detail-value">
                        {request.formData.energy} - {request.formData.seats} places
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Couverture:</span>
                      <span className="detail-value">{request.formData.coverage}</span>
                    </div>
                    {request.selectedQuote && (
                      <div className="selected-quote">
                        <h4>Devis sélectionné:</h4>
                        <div className="quote-summary">
                          <span className="insurer">{request.selectedQuote.insurer}</span>
                          <span className="price">{request.selectedQuote.price.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="request-actions">
                    <button 
                      className="action-btn view"
                      onClick={() => handleViewDetails(request)}
                    >
                      Voir détails
                    </button>
                    {request.status === 'completed' && (
                      <button 
                        className="action-btn download"
                        onClick={() => handleDownload(request)}
                      >
                        Télécharger
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="profile-tab">
            <h2>Profil utilisateur</h2>
            <div className="profile-card">
              <div className="profile-avatar">
                <span>{user.firstName[0]}{user.lastName[0]}</span>
              </div>
              <div className="profile-info">
                <div className="info-group">
                  <label>Nom complet</label>
                  <p>{user.firstName} {user.lastName}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="info-group">
                  <label>Téléphone</label>
                  <p>{user.phone || 'Non renseigné'}</p>
                </div>
                <div className="info-group">
                  <label>Membre depuis</label>
                  <p>{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="profile-actions">
                <button 
                  className="edit-profile-btn"
                  onClick={handleEditProfile}
                >
                  Modifier le profil
                </button>
                <button 
                  className="change-password-btn"
                  onClick={handleChangePassword}
                >
                  Changer le mot de passe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de modification du profil */}
      {showEditProfileModal && (
        <div className="modal-overlay" onClick={() => setShowEditProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier le profil</h3>
              <button 
                className="modal-close"
                onClick={() => setShowEditProfileModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  value={editProfileData.firstName}
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={editProfileData.lastName}
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editProfileData.email}
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input
                  type="tel"
                  value={editProfileData.phone}
                  onChange={(e) => setEditProfileData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowEditProfileModal(false)}>
                  Annuler
                </button>
                <button className="save-btn" onClick={handleSaveProfile}>
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de changement de mot de passe */}
      {showChangePasswordModal && (
        <div className="modal-overlay" onClick={() => setShowChangePasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Changer le mot de passe</h3>
              <button 
                className="modal-close"
                onClick={() => setShowChangePasswordModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Mot de passe actuel</label>
                <input
                  type="password"
                  value={changePasswordData.currentPassword}
                  onChange={(e) => setChangePasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  value={changePasswordData.newPassword}
                  onChange={(e) => setChangePasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  value={changePasswordData.confirmPassword}
                  onChange={(e) => setChangePasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowChangePasswordModal(false)}>
                  Annuler
                </button>
                <button className="save-btn" onClick={handleSavePassword}>
                  Changer le mot de passe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails de la demande */}
      {showRequestDetailsModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowRequestDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la demande #{selectedRequest.id}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRequestDetailsModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="request-details-modal">
                <div className="detail-section">
                  <h4>Informations client</h4>
                  <p><strong>Nom:</strong> {selectedRequest.userName}</p>
                  <p><strong>Email:</strong> {selectedRequest.userEmail}</p>
                </div>
                <div className="detail-section">
                  <h4>Véhicule</h4>
                  <p><strong>Énergie:</strong> {selectedRequest.formData.energy}</p>
                  <p><strong>Places:</strong> {selectedRequest.formData.seats}</p>
                  <p><strong>Valeur:</strong> {parseInt(selectedRequest.formData.vehicleValue).toLocaleString()} FCFA</p>
                </div>
                <div className="detail-section">
                  <h4>Devis proposés</h4>
                  {selectedRequest.quotes.map((quote) => (
                    <div key={quote.id} className="quote-item">
                      <div className="quote-header">
                        <span className="insurer-name">{quote.insurer}</span>
                        <span className="quote-price">{quote.price.toLocaleString()} FCFA</span>
                      </div>
                      <p className="quote-details">{quote.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 