import React from 'react';
import { X, Download, Mail, MessageSquare } from 'lucide-react';
import type { Quote } from '../types/types';
import './QuoteDownloadModal.css';

interface QuoteDownloadModalProps {
  quote: Quote | null;
  onClose: () => void;
  onDownload: (quote: Quote) => void;
  onSendEmail: () => void;
  onSendWhatsApp: () => void;
}

const QuoteDownloadModal: React.FC<QuoteDownloadModalProps> = ({ quote, onClose, onDownload, onSendEmail, onSendWhatsApp }) => {
  if (!quote) return null;

  return (
    <div className="quotedl-modal-bg">
      <div className="quotedl-modal">
        <div className="quotedl-modal-header">
          <h3 className="quotedl-modal-title">Recevoir le devis</h3>
          <button
            onClick={onClose}
            className="quotedl-modal-close"
            aria-label="Fermer"
          >
            <X size={22} />
          </button>
        </div>
        <div className="quotedl-modal-content">
          <div className="quotedl-modal-insurer">
            <span className="quotedl-modal-logo">{quote.logo}</span>
            <div>
              <div className="quotedl-modal-insurer-name">{quote.insurer}</div>
              <div className="quotedl-modal-insurer-type">{quote.coverage}</div>
            </div>
          </div>
          <div className="quotedl-modal-price-row">
            <span className="quotedl-modal-price-label">Prime annuelle:</span>
            <span className="quotedl-modal-price">{quote.price.toLocaleString()} FCFA</span>
          </div>
        </div>
        <div className="quotedl-modal-actions">
          <button
            onClick={() => { onDownload(quote); onClose(); }}
            className="quotedl-modal-btn quotedl-modal-btn-primary"
          >
            <Download size={18} /> Télécharger le devis PDF
          </button>
          <button
            onClick={() => { onSendEmail(); onClose(); }}
            className="quotedl-modal-btn quotedl-modal-btn-secondary"
          >
            <Mail size={18} /> Envoyer par Email
          </button>
          <button
            onClick={() => { onSendWhatsApp(); onClose(); }}
            className="quotedl-modal-btn quotedl-modal-btn-whatsapp"
          >
            <MessageSquare size={18} /> Envoyer par WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteDownloadModal;
