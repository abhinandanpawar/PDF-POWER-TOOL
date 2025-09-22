import React from 'react';
import { ToolInfo } from '../types';
import { cn } from '../src/utils/cn';

interface ToolCardProps {
  tool: ToolInfo;
  className?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, className }) => {
  return (
    <div
      className={cn(
        'group relative flex h-full flex-col items-center rounded-lg border border-border bg-card p-6 text-center shadow-sm transition-all duration-300 ease-in-out',
        'hover:shadow-md hover:border-primary/50 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
        {tool.icon}
      </div>
      <h3 className="text-lg font-bold text-card-foreground mb-2">{tool.title}</h3>
      <p className="text-sm text-muted-foreground flex-grow">{tool.description}</p>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-primary/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};

export default ToolCard;