
import { Car } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { User } from '../types/types';
import './Header.css'

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
        
        <nav className="header-nav" aria-label="Navigation principale">
          <Link
            to="/assurance"
            className={`nav-link ${location.pathname === '/assurance' ? 'active' : ''}`}
          >
            Assurance
          </Link>
          <Link
            to="/about"
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            À propos
          </Link>
          <Link
            to="/faq"
            className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`}
          >
            FAQ
          </Link>
        </nav>
        
        <div className="header-actions" aria-label="Actions utilisateur">
            {user ? (
              <div className="user-menu">
                <span className="user-name">Bonjour, {user.firstName}</span>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="nav-link">Admin</Link>
                ) : (
                  <Link to="/dashboard" className="nav-link">Mon espace</Link>
                )}
                <button onClick={onLogout} className="logout-btn">Déconnexion</button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">Connexion</Link>
            )}
          </div>
        </div>
      
    </header>
  );
};



export default Header;