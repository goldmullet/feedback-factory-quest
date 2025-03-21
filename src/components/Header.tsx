
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mic, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-6 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/20' : 'bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Mic className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">FeedbackFactory</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-10">
          <Link 
            to="/consumer" 
            className={`text-base font-medium transition-colors ${
              isActive('/consumer') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
            }`}
          >
            Leave Feedback
          </Link>
          <Link 
            to="/brand/dashboard" 
            className={`text-base font-medium transition-colors ${
              isActive('/brand/dashboard') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/brand/setup" 
            className={`text-base font-medium transition-colors ${
              isActive('/brand/setup') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
            }`}
          >
            Setup
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button className="rounded-full px-6 bg-primary/90 hover:bg-primary shadow-button">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
