import React from 'react';
import { Link } from 'react-router-dom';
import Container from './Container';
import Logo from './Logo';

const Header: React.FC = () => {
  return (
    <header className="bg-card/80 sticky top-0 z-50 border-b border-border backdrop-blur-lg">
      <Container className="flex h-16 items-center justify-between">
        <nav>
          <Link to="/" aria-label="Back to homepage">
            <Logo />
          </Link>
        </nav>
        {/* Future navigation links can go here */}
      </Container>
    </header>
  );
};

export default Header;
