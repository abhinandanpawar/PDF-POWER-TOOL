import React from 'react';
import { useLocation } from 'react-router-dom';
import { TOOLS } from '../constants';
import Breadcrumbs from './Breadcrumbs';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({ title, description, children }) => {
  const location = useLocation();
  const currentPath = location.pathname.substring(1);

  const currentTool = TOOLS.find(tool => tool.key.toLowerCase() === currentPath);

  const breadcrumbItems = currentTool
    ? [
        { label: 'Home', href: '/' },
        { label: currentTool.category },
        { label: currentTool.title },
      ]
    : [{ label: 'Home', href: '/' }];

  return (
    <div className="animate-fade-in">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-md border border-border">
        <header className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground mt-1">{description}</p>
        </header>
        <main>
            {children}
        </main>
      </div>
    </div>
  );
};

export default ToolPageLayout;