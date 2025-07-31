import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { AdminStats, QuoteRequest, User, InsurerOffer, ImportRecord } from '../types/types';
import './Admin.css';

interface AdminProps {
  user: User;
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ user, onLogout }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'users' | 'insurers' | 'imports' | 'settings'>('overview');
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'client' as 'client' | 'admin'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importHistory, setImportHistory] = useState<ImportRecord[]>([]);
  const [insurersData, setInsurersData] = useState<InsurerOffer[]>([]);

  // Mock data pour les statistiques
  const mockStats: AdminStats = {
    totalUsers: 1247,
    totalRequests: 3421,
    completedRequests: 2891,
    pendingRequests: 530,
    totalRevenue: 125000000,
    monthlyGrowth: 12.5,
    topInsurers: [
      { name: 'NSIA Assurance', count: 856, revenue: 32000000 },
      { name: 'Atlantique Assurance', count: 743, revenue: 28000000 },
      { name: 'Saham Assurance', count: 621, revenue: 22000000 },
      { name: 'Allianz CI', count: 498, revenue: 18000000 }
    ],
    recentActivity: [
      { id: 1, action: 'Nouvelle demande de devis', user: 'Marie Dupont', timestamp: '2024-01-20T15:30:00Z' },
      { id: 2, action: 'Devis finalisé', user: 'Jean Martin', timestamp: '2024-01-20T14:45:00Z' },
      { id: 3, action: 'Nouveau client inscrit', user: 'Sophie Bernard', timestamp: '2024-01-20T14:20:00Z' },
      { id: 4, action: 'Devis annulé', user: 'Pierre Durand', timestamp: '2024-01-20T13:15:00Z' }
    ]
  };

  // Mock data pour les demandes
  const mockQuoteRequests: QuoteRequest[] = [
    {
      id: 1,
      userId: 1,
      userEmail: 'marie.dupont@email.com',
      userName: 'Marie Dupont',
      formData: {
        age: '32',
        licenseYears: '8',
        accidents: '1',
        usage: 'personnel',
        annualKm: '18000',
        vehicleValue: '9500000',
        energy: 'essence',
        registrationDate: '2019-06-10',
        seats: '5',
        coverage: 'tous_risques',
        options: ['assistance', 'bris_glace'],
        deductible: '20000'
      },
      quotes: [
        {
          id: 1,
          insurer: 'NSIA Assurance',
          logo: '🛡️',
          price: 92000,
          coverage: 'Tous risques',
          deductible: 20000,
          options: ['Assistance 24h/24', 'Véhicule de remplacement'],
          rating: 4.5,
          details: 'Couverture complète avec assistance premium'
        }
      ],
      status: 'pending',
      createdAt: '2024-01-20T15:30:00Z',
      updatedAt: '2024-01-20T15:30:00Z'
    },
    {
      id: 2,
      userId: 2,
      userEmail: 'jean.martin@email.com',
      userName: 'Jean Martin',
      formData: {
        age: '45',
        licenseYears: '20',
        accidents: '0',
        usage: 'professionnel',
        annualKm: '30000',
        vehicleValue: '15000000',
        energy: 'diesel',
        registrationDate: '2022-03-15',
        seats: '7',
        coverage: 'tiers_etendu',
        options: ['assistance'],
        deductible: '25000'
      },
      quotes: [
        {
          id: 2,
          insurer: 'Atlantique Assurance',
          logo: '🌊',
          price: 115000,
          coverage: 'Tiers étendu',
          deductible: 25000,
          options: ['Assistance 24h/24'],
          rating: 4.2,
          details: 'Protection optimale pour votre véhicule'
        }
      ],
      selectedQuote: {
        id: 2,
        insurer: 'Atlantique Assurance',
        logo: '🌊',
        price: 115000,
        coverage: 'Tiers étendu',
        deductible: 25000,
        options: ['Assistance 24h/24'],
        rating: 4.2,
        details: 'Protection optimale pour votre véhicule'
      },
      status: 'completed',
      createdAt: '2024-01-20T14:45:00Z',
      updatedAt: '2024-01-20T14:45:00Z'
    }
  ];

  // Mock data pour les utilisateurs
  const mockUsers: User[] = [
    {
      id: 1,
      email: 'marie.dupont@email.com',
      firstName: 'Marie',
      lastName: 'Dupont',
      phone: '+225 0701234567',
      createdAt: '2024-01-15T10:30:00Z',
      role: 'client'
    },
    {
      id: 2,
      email: 'jean.martin@email.com',
      firstName: 'Jean',
      lastName: 'Martin',
      phone: '+225 0702345678',
      createdAt: '2024-01-10T14:20:00Z',
      role: 'client'
    },
    {
      id: 3,
      email: 'sophie.bernard@email.com',
      firstName: 'Sophie',
      lastName: 'Bernard',
      phone: '+225 0703456789',
      createdAt: '2024-01-20T14:20:00Z',
      role: 'client'
    }
  ];

  // Mock data pour les offres d'assureurs
  const mockInsurersData: InsurerOffer[] = [
    {
      id: 1,
      insurerName: 'NSIA Assurance',
      monthlyPrice: 85000,
      annualPrice: 1020000,
      coverageType: 'Tous risques',
      includedOptions: ['Assistance 24h/24', 'Véhicule de remplacement', 'Bris de glace'],
      deductible: 25000,
      isActive: true,
      lastUpdated: '2024-01-20T10:30:00Z',
      createdBy: 'admin@mobi.ci'
    },
    {
      id: 2,
      insurerName: 'Atlantique Assurance',
      monthlyPrice: 92000,
      annualPrice: 1104000,
      coverageType: 'Tous risques',
      includedOptions: ['Assistance 24h/24', 'Bris de glace', 'Vol/Incendie'],
      deductible: 20000,
      isActive: true,
      lastUpdated: '2024-01-19T15:45:00Z',
      createdBy: 'admin@mobi.ci'
    },
    {
      id: 3,
      insurerName: 'Saham Assurance',
      monthlyPrice: 78000,
      annualPrice: 936000,
      coverageType: 'Tiers étendu',
      includedOptions: ['Assistance dépannage', 'Protection juridique'],
      deductible: 30000,
      isActive: false,
      lastUpdated: '2024-01-18T09:15:00Z',
      createdBy: 'admin@mobi.ci'
    },
    {
      id: 4,
      insurerName: 'Allianz CI',
      monthlyPrice: 98000,
      annualPrice: 1176000,
      coverageType: 'Tous risques Premium',
      includedOptions: ['Assistance 24h/24', 'Véhicule de remplacement', 'Bris de glace', 'Vol/Incendie', 'Protection juridique'],
      deductible: 15000,
      isActive: true,
      lastUpdated: '2024-01-20T14:20:00Z',
      createdBy: 'admin@mobi.ci'
    }
  ];

  // Mock data pour l'historique d'import
  const mockImportHistory: ImportRecord[] = [
    {
      id: 1,
      fileName: 'tarifs_nsia_jan2024.csv',
      importedAt: '2024-01-20T10:30:00Z',
      status: 'success',
      recordsImported: 15,
      recordsTotal: 15,
      errors: [],
      importedBy: 'admin@mobi.ci'
    },
    {
      id: 2,
      fileName: 'tarifs_atlantique_jan2024.xlsx',
      importedAt: '2024-01-19T15:45:00Z',
      status: 'partial',
      recordsImported: 12,
      recordsTotal: 15,
      errors: ['Ligne 8: Prix manquant', 'Ligne 13: Format de date invalide'],
      importedBy: 'admin@mobi.ci'
    },
    {
      id: 3,
      fileName: 'tarifs_saham_jan2024.csv',
      importedAt: '2024-01-18T09:15:00Z',
      status: 'error',
      recordsImported: 0,
      recordsTotal: 10,
      errors: ['Format de fichier non supporté', 'Colonnes manquantes'],
      importedBy: 'admin@mobi.ci'
    }
  ];

  useEffect(() => {
    // Simulation d'un appel API
    setTimeout(() => {
      setStats(mockStats);
      setQuoteRequests(mockQuoteRequests);
      setUsers(mockUsers);
      setInsurersData(mockInsurersData);
      setImportHistory(mockImportHistory);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const handleStatusChange = (requestId: number, newStatus: string) => {
    setQuoteRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus as 'pending' | 'completed' | 'cancelled' }
          : req
      )
    );
  };

  const handleDeleteRequest = (requestId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      setQuoteRequests(prev => prev.filter(req => req.id !== requestId));
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleAddUser = () => {
    setShowUserModal(true);
  };

  const handleCreateUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.phone) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const user: User = {
      id: Math.floor(Math.random() * 1000) + 100,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      role: newUser.role,
      createdAt: new Date().toISOString()
    };

    setUsers(prev => [...prev, user]);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'client'
    });
    setShowUserModal(false);
    alert('Utilisateur créé avec succès !');
  };

  const handleExportData = (type: 'users' | 'requests' | 'insurers') => {
    const data = type === 'users' ? users : type === 'requests' ? quoteRequests : insurersData;
    const filename = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
    
    // Simulation d'export CSV
    let csvContent = '';
    if (type === 'insurers') {
      csvContent = 'Assureur,Prix Mensuel,Prix Annuel,Type Couverture,Options,Franchise,Actif,Dernière MAJ\n';
      insurersData.forEach(insurer => {
        csvContent += `${insurer.insurerName},${insurer.monthlyPrice},${insurer.annualPrice},${insurer.coverageType},"${insurer.includedOptions.join('; ')}",${insurer.deductible},${insurer.isActive ? 'Oui' : 'Non'},${formatDate(insurer.lastUpdated)}\n`;
      });
    } else {
      csvContent = JSON.stringify(data, null, 2);
    }
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    link.click();
    
    alert(`${type === 'users' ? 'Utilisateurs' : type === 'requests' ? 'Demandes' : 'Assureurs'} exportés avec succès !`);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImportFile = () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier');
      return;
    }

    // Simulation de validation et import
    const fileName = selectedFile.name;
    const isValidFormat = fileName.endsWith('.csv') || fileName.endsWith('.xlsx');
    
    if (!isValidFormat) {
      alert('Format de fichier non supporté. Utilisez CSV ou Excel.');
      return;
    }

    // Simulation d'import avec validation
    const importRecord: ImportRecord = {
      id: importHistory.length + 1,
      fileName: fileName,
      importedAt: new Date().toISOString(),
      status: 'success',
      recordsImported: Math.floor(Math.random() * 20) + 10,
      recordsTotal: Math.floor(Math.random() * 20) + 10,
      errors: [],
      importedBy: user.email
    };

    setImportHistory(prev => [importRecord, ...prev]);
    setSelectedFile(null);
    setShowImportModal(false);
    alert(`Import réussi ! ${importRecord.recordsImported} enregistrements importés.`);
  };

  const handleToggleInsurerStatus = (insurerId: number) => {
    setInsurersData(prev => 
      prev.map(insurer => 
        insurer.id === insurerId 
          ? { ...insurer, isActive: !insurer.isActive, lastUpdated: new Date().toISOString() }
          : insurer
      )
    );
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord administrateur...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Administration</h1>
          <p>Gestion de la plateforme Mobi</p>
        </div>
        <div className="admin-actions">
          <span className="admin-user">
            Admin: {user.firstName} {user.lastName}
          </span>
          <button onClick={onLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Vue d'ensemble
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Demandes de devis
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button>
        <button
          className={`tab-btn ${activeTab === 'insurers' ? 'active' : ''}`}
          onClick={() => setActiveTab('insurers')}
        >
          Assureurs
        </button>
        <button
          className={`tab-btn ${activeTab === 'imports' ? 'active' : ''}`}
          onClick={() => setActiveTab('imports')}
        >
          Imports
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Paramètres
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && stats && (
          <div className="overview-tab">
            <div className="stats-overview">
              <div className="main-stats">
                <div className="stat-card primary">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers.toLocaleString()}</h3>
                    <p>Utilisateurs totaux</p>
                    <span className="stat-growth">+{stats.monthlyGrowth}% ce mois</span>
                  </div>
                </div>
                <div className="stat-card success">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <h3>{stats.totalRequests.toLocaleString()}</h3>
                    <p>Demandes totales</p>
                    <span className="stat-growth">+8.2% ce mois</span>
                  </div>
                </div>
                <div className="stat-card warning">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-info">
                    <h3>{stats.pendingRequests}</h3>
                    <p>En attente</p>
                    <span className="stat-growth">À traiter</span>
                  </div>
                </div>
                <div className="stat-card revenue">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>{(stats.totalRevenue / 1000000).toFixed(1)}M</h3>
                    <p>Chiffre d'affaires</p>
                    <span className="stat-growth">+15.3% ce mois</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="top-insurers">
                <h2>Top Assureurs</h2>
                <div className="insurers-list">
                  {stats.topInsurers.map((insurer, index) => (
                    <div key={insurer.name} className="insurer-item">
                      <div className="insurer-rank">#{index + 1}</div>
                      <div className="insurer-info">
                        <h4>{insurer.name}</h4>
                        <p>{insurer.count} devis</p>
                      </div>
                      <div className="insurer-revenue">
                        {(insurer.revenue / 1000000).toFixed(1)}M FCFA
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="recent-activity">
                <h2>Activité récente</h2>
                <div className="activity-list">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-item">
                      <div className="activity-icon">
                        {activity.action.includes('finalisé') ? '✅' : 
                         activity.action.includes('inscrit') ? '👤' : 
                         activity.action.includes('annulé') ? '❌' : '📝'}
                      </div>
                      <div className="activity-content">
                        <h4>{activity.action}</h4>
                        <p>{activity.user}</p>
                        <span className="activity-date">{formatDate(activity.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-tab">
            <div className="tab-header">
              <h2>Gestion des demandes de devis</h2>
              <div className="tab-actions">
                <select className="filter-select">
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
                <button className="export-btn" onClick={() => handleExportData('requests')}>Exporter</button>
              </div>
            </div>

            <div className="requests-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Véhicule</th>
                    <th>Couverture</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteRequests.map((request) => (
                    <tr key={request.id}>
                      <td>#{request.id}</td>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{request.userName}</span>
                          <span className="user-email">{request.userEmail}</span>
                        </div>
                      </td>
                      <td>
                        {request.formData.energy} - {request.formData.seats} places
                      </td>
                      <td>{request.formData.coverage}</td>
                      <td>
                        {request.selectedQuote 
                          ? `${request.selectedQuote.price.toLocaleString()} FCFA`
                          : 'Non sélectionné'
                        }
                      </td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>{formatDate(request.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn view"
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRequestModal(true);
                            }}
                          >
                            Voir
                          </button>
                          <select
                            className="status-select"
                            value={request.status}
                            onChange={(e) => handleStatusChange(request.id, e.target.value)}
                          >
                            <option value="pending">En attente</option>
                            <option value="completed">Terminé</option>
                            <option value="cancelled">Annulé</option>
                          </select>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="tab-header">
              <h2>Gestion des utilisateurs</h2>
              <div className="tab-actions">
                <button className="add-user-btn" onClick={handleAddUser}>+ Nouvel utilisateur</button>
                <button className="export-btn" onClick={() => handleExportData('users')}>Exporter</button>
              </div>
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Rôle</th>
                    <th>Inscription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>
                        <div className="user-info">
                          <span className="user-name">{user.firstName} {user.lastName}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role === 'admin' ? 'Administrateur' : 'Client'}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit">Modifier</button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'insurers' && (
          <div className="insurers-tab">
            <div className="tab-header">
              <h2>Gestion des assureurs et tarifs</h2>
              <div className="tab-actions">
                <button className="import-btn" onClick={() => setShowImportModal(true)}>
                  📁 Importer tarifs
                </button>
                <button className="export-btn" onClick={() => handleExportData('insurers')}>
                  📊 Exporter CSV
                </button>
              </div>
            </div>

            <div className="insurers-table">
              <table>
                <thead>
                  <tr>
                    <th>Assureur</th>
                    <th>Prix Mensuel</th>
                    <th>Prix Annuel</th>
                    <th>Type Couverture</th>
                    <th>Options</th>
                    <th>Franchise</th>
                    <th>Statut</th>
                    <th>Dernière MAJ</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {insurersData.map((insurer) => (
                    <tr key={insurer.id}>
                      <td>
                        <div className="insurer-info">
                          <span className="insurer-name">{insurer.insurerName}</span>
                        </div>
                      </td>
                      <td>{insurer.monthlyPrice.toLocaleString()} FCFA</td>
                      <td>{insurer.annualPrice.toLocaleString()} FCFA</td>
                      <td>{insurer.coverageType}</td>
                      <td>
                        <div className="options-list">
                          {insurer.includedOptions.slice(0, 2).map((option, index) => (
                            <span key={index} className="option-tag">{option}</span>
                          ))}
                          {insurer.includedOptions.length > 2 && (
                            <span className="option-more">+{insurer.includedOptions.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>{insurer.deductible.toLocaleString()} FCFA</td>
                      <td>
                        <span className={`status-badge ${insurer.isActive ? 'status-active' : 'status-inactive'}`}>
                          {insurer.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>{formatDate(insurer.lastUpdated)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className={`action-btn ${insurer.isActive ? 'deactivate' : 'activate'}`}
                            onClick={() => handleToggleInsurerStatus(insurer.id)}
                          >
                            {insurer.isActive ? 'Désactiver' : 'Activer'}
                          </button>
                          <button className="action-btn edit">Modifier</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'imports' && (
          <div className="imports-tab">
            <div className="tab-header">
              <h2>Historique des imports</h2>
              <div className="tab-actions">
                <button className="import-btn" onClick={() => setShowImportModal(true)}>
                  📁 Nouvel import
                </button>
              </div>
            </div>

            <div className="imports-list">
              {importHistory.map((importRecord) => (
                <div key={importRecord.id} className="import-card">
                  <div className="import-header">
                    <div className="import-info">
                      <h3>{importRecord.fileName}</h3>
                      <p>Importé le {formatDate(importRecord.importedAt)} par {importRecord.importedBy}</p>
                    </div>
                    <span className={`status-badge ${importRecord.status}`}>
                      {importRecord.status === 'success' ? 'Succès' : 
                       importRecord.status === 'partial' ? 'Partiel' : 'Erreur'}
                    </span>
                  </div>
                  
                  <div className="import-details">
                    <div className="import-stats">
                      <span className="stat-item">
                        <strong>{importRecord.recordsImported}</strong> / {importRecord.recordsTotal} enregistrements
                      </span>
                    </div>
                    
                    {importRecord.errors.length > 0 && (
                      <div className="import-errors">
                        <h4>Erreurs détectées :</h4>
                        <ul>
                          {importRecord.errors.map((error, index) => (
                            <li key={index} className="error-item">{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>Paramètres de la plateforme</h2>
            <div className="settings-grid">
              <div className="setting-card">
                <h3>Configuration générale</h3>
                <div className="setting-item">
                  <label>Nom de la plateforme</label>
                  <input type="text" defaultValue="Mobi Assurance" />
                </div>
                <div className="setting-item">
                  <label>Email de contact</label>
                  <input type="email" defaultValue="contact@mobi.ci" />
                </div>
                <div className="setting-item">
                  <label>Numéro de téléphone</label>
                  <input type="tel" defaultValue="+225 27222444" />
                </div>
                <button className="save-btn">Sauvegarder</button>
              </div>

              <div className="setting-card">
                <h3>Paramètres des devis</h3>
                <div className="setting-item">
                  <label>Durée de validité (jours)</label>
                  <input type="number" defaultValue="30" />
                </div>
                <div className="setting-item">
                  <label>Commission par devis (%)</label>
                  <input type="number" defaultValue="5" step="0.1" />
                </div>
                <div className="setting-item">
                  <label>Limite de devis par jour</label>
                  <input type="number" defaultValue="10" />
                </div>
                <button className="save-btn">Sauvegarder</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal pour voir les détails d'une demande */}
      {showRequestModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails de la demande #{selectedRequest.id}</h3>
              <button 
                className="modal-close"
                onClick={() => setShowRequestModal(false)}
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

      {/* Modal pour créer un nouvel utilisateur */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Créer un nouvel utilisateur</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUserModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="user-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom *</label>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Prénom"
                    />
                  </div>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Nom"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+225 0701234567"
                  />
                </div>
                <div className="form-group">
                  <label>Rôle</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'client' | 'admin' }))}
                  >
                    <option value="client">Client</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowUserModal(false)}>
                    Annuler
                  </button>
                  <button className="create-btn" onClick={handleCreateUser}>
                    Créer l'utilisateur
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'import de tarifs */}
      {showImportModal && (
        <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Importer les tarifs des assureurs</h3>
              <button 
                className="modal-close"
                onClick={() => setShowImportModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="import-form">
                <div className="form-group">
                  <label>Sélectionner un fichier CSV/Excel</label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="file-input"
                  />
                  {selectedFile && (
                    <p className="file-selected">Fichier sélectionné : {selectedFile.name}</p>
                  )}
                </div>
                
                <div className="import-info">
                  <h4>Format attendu :</h4>
                  <ul>
                    <li>Nom de l'assureur</li>
                    <li>Prix mensuel (FCFA)</li>
                    <li>Prix annuel (FCFA)</li>
                    <li>Type de couverture</li>
                    <li>Options incluses (séparées par des points-virgules)</li>
                    <li>Franchise (FCFA)</li>
                  </ul>
                </div>

                <div className="modal-actions">
                  <button className="cancel-btn" onClick={() => setShowImportModal(false)}>
                    Annuler
                  </button>
                  <button 
                    className="import-btn"
                    onClick={handleImportFile}
                    disabled={!selectedFile}
                  >
                    Importer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 