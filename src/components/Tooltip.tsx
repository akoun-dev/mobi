import React from 'react';
import { HelpCircle } from 'lucide-react';
import './Tooltip.css';

interface TooltipProps {
  message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => (
  <span className="tooltip-wrapper">
    <HelpCircle size={16} className="tooltip-icon" />
    <span className="tooltip-box">{message}</span>
  </span>
);

export default Tooltip;
