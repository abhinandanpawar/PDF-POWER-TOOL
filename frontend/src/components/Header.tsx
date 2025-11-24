import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b border-primary/20">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/50 blur-md rounded-full group-hover:bg-primary/80 transition-all duration-300"></div>
             <Cpu className="relative w-8 h-8 text-primary animate-pulse-fast" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white group-hover:text-primary transition-colors">
            PDF<span className="text-primary">2077</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary drop-shadow-[0_0_8px_rgba(0,242,255,0.5)]' : 'text-muted-foreground'}`}>
            HUB
          </Link>
          <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            NETRUNNER TOOLS
          </a>
           <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            ABOUT
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
             <button className="cyber-button text-xs py-2 px-4">
                <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> CONNECT
                </span>
            </button>
        </div>

        {/* Mobile Menu Button */}
        <button
            className="md:hidden p-2 text-muted-foreground hover:text-primary"
            onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-surface"
          >
            <nav className="flex flex-col p-4 space-y-4">
              <Link to="/" className="text-foreground hover:text-primary" onClick={() => setIsOpen(false)}>HUB</Link>
              <a href="#" className="text-foreground hover:text-primary" onClick={() => setIsOpen(false)}>TOOLS</a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
