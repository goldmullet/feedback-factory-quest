
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, BarChart, Settings, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled ? 'glass-effect' : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Mic className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">FeedbackFactory</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/consumer" 
            className={`text-sm font-medium transition-colors ${
              isActive('/consumer') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
            }`}
          >
            Leave Feedback
          </Link>
          <Link 
            to="/brand/dashboard" 
            className={`text-sm font-medium transition-colors ${
              isActive('/brand/dashboard') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
            }`}
          >
            Brand Dashboard
          </Link>
          <Link 
            to="/brand/setup" 
            className={`text-sm font-medium transition-colors ${
              isActive('/brand/setup') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
            }`}
          >
            Set Up Questions
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button className="bg-primary/90 hover:bg-primary shadow-button">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
