import React from 'react';
import { Link } from 'react-router-dom';

interface ToolPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({ title, description, children }) => {
  return (
    <div className="animate-fade-in">
      <Link to="/" className="mb-6 text-primary hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to All Tools
      </Link>
      <div className="bg-card p-6 sm:p-8 rounded-lg shadow-2xl border border-border">
        <header className="mb-8">
            <h2 className="text-3xl font-bold text-text-primary">{title}</h2>
            <p className="text-text-secondary mt-1">{description}</p>
        </header>
        <main>
            {children}
        </main>
      </div>
    </div>
  );
};

export default ToolPageLayout;