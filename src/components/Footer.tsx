
import React from 'react';
import './Footer.css';
import { Car } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Colonne 1 : Logo & description */}
        <div className="footer-col">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Car style={{ color: '#3B82F6', width: 32, height: 32, marginRight: 10 }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>NOLI Motor</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            Votre comparateur d'assurance auto de confiance en Côte d'Ivoire.<br />
            Trouvez la meilleure protection pour votre véhicule.
          </div>
        </div>

        {/* Colonne 2 : Services */}
        <div className="footer-col">
          <div className="footer-title">Services</div>
          <ul className="footer-list">
            <li>Assurance Auto</li>
            <li>Assurance Moto</li>
            <li>Assurance Habitation</li>
            <li>Assurance Santé</li>
          </ul>
        </div>

        {/* Colonne 3 : Support */}
        <div className="footer-col">
          <div className="footer-title">Support</div>
          <ul className="footer-list">
            <li>Centre d'aide</li>
            <li>FAQ</li>
            <li>Contact</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Colonne 4 : Contact */}
        <div className="footer-col">
          <div className="footer-title">Contact</div>
          <ul className="footer-list">
            <li>📍 Abidjan, Côte d'Ivoire</li>
            <li>📞 +225 XX XX XX XX XX</li>
            <li>✉️ contact@nolimotor.ci</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} NOLI Motor. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
