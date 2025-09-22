import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center" title="PDF Power Toolbox">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
        <path
          d="M12 10H16C18.2091 10 20 11.7909 20 14C20 16.2091 18.2091 18 16 18H12V10Z"
          fill="hsl(var(--primary-foreground))"
        />
        <path d="M12 18H16V22H12V18Z" fill="hsl(var(--primary-foreground))" />
      </svg>
      <span className="ml-3 text-xl font-bold text-foreground">
        PDF Power Toolbox
      </span>
    </div>
  );
};

export default Logo;
