
import React, { useEffect, useState } from 'react';
import { Car, Menu } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../types/types';
import './Header.css'

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onCompareClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onCompareClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      // Si on est déjà sur la page d'accueil, on recharge la page
      window.location.reload();
    } else {
      // Sinon on navigue vers la page d'accueil
      navigate('/');
    }
  };

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <div
          className="header-logo"
          onClick={handleLogoClick}
          role="button"
          aria-label="Retour à l'accueil"
        >
          <Car className="car-icon" aria-hidden="true" />
          <span className="brand">NOLI Motor</span>
        </div>
        <button className="hamburger" onClick={toggleMenu} aria-label="Menu">
          <Menu />
        </button>
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="header-nav" aria-label="Navigation principale">
            <Link
              to="/assurance"
              className={`nav-link ${location.pathname === '/assurance' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Assurance
            </Link>
            <Link
              to="/about"
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              À propos
            </Link>
            <Link
              to="/faq"
              className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              FAQ
            </Link>
            {!user && (
              <button
                className="compare-btn"
                onClick={() => {
                  handleLinkClick();
                  onCompareClick();
                }}
              >
                Comparer
              </button>
            )}
          </nav>

          <div className="header-actions" aria-label="Actions utilisateur">
            {user ? (
              <div className="user-menu">
                <span className="user-name">Bonjour, {user.firstName}</span>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="nav-link" onClick={handleLinkClick}>
                    Admin
                  </Link>
                ) : (
                  <Link to="/dashboard" className="nav-link" onClick={handleLinkClick}>
                    Mon espace
                  </Link>
                )}
                <button
                  onClick={() => {
                    onLogout?.();
                    handleLinkClick();
                  }}
                  className="logout-btn"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn" onClick={handleLinkClick}>
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};



export default Header;
