import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { LoginForm } from '../types/types';
import './Login.css';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulation d'une API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock user data - en production, ceci viendrait de l'API
      const mockUser = {
        id: 1,
        email: formData.email,
        firstName: 'John',
        lastName: 'Doe',
        role: formData.email.includes('admin') ? 'admin' : 'client'
      };

      onLogin(mockUser);
      
      // Redirection basée sur le rôle
      if (mockUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      setErrors({ email: 'Email ou mot de passe incorrect' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Connexion</h1>
          <p>Accédez à votre espace personnel</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'error' : ''}
              placeholder="votre@email.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                placeholder="Votre mot de passe"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Se souvenir de moi</span>
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Pas encore de compte ?{' '}
            <Link to="/register" className="register-link">
              Créer un compte
            </Link>
          </p>
        </div>

        <div className="demo-accounts">
          <h3>Comptes de démonstration</h3>
          <div className="demo-buttons">
            <button
              onClick={() => {
                setFormData({
                  email: 'client@demo.com',
                  password: 'password123'
                });
              }}
              className="demo-btn client"
            >
              Client Demo
            </button>
            <button
              onClick={() => {
                setFormData({
                  email: 'admin@demo.com',
                  password: 'admin123'
                });
              }}
              className="demo-btn admin"
            >
              Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 