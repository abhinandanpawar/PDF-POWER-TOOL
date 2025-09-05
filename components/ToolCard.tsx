import React from 'react';
import { ToolInfo } from '../types';

interface ToolCardProps {
  tool: ToolInfo;
  onSelect: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="bg-card border border-border rounded-lg p-6 flex flex-col items-center text-center cursor-pointer
                 transform hover:scale-105 hover:border-secondary transition-all duration-300 h-full"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onSelect()}
    >
      <div className="text-secondary mb-4 w-12 h-12 flex items-center justify-center">{tool.icon}</div>
      <h3 className="text-lg font-bold text-text-primary mb-2">{tool.title}</h3>
      <p className="text-sm text-text-secondary flex-grow">{tool.description}</p>
    </div>
  );
};

export default ToolCard;