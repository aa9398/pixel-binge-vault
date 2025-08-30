import { Film, User, Heart, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Movies', path: '/' },
    { label: 'Watchlist', path: '/watchlist', authRequired: true },
    { label: 'Dashboard', path: '/dashboard', authRequired: true },
  ];

  const filteredNavItems = navItems.filter(item => !item.authRequired || user);

  return (
    <header className="border-b-2 border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="border-2 border-primary p-2 glow-primary">
              <Film className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-pixel-lg text-primary">Bingeable</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {filteredNavItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`font-pixel transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/watchlist')}
                  className="hidden md:flex btn-pixel-ghost"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Watchlist
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="hidden md:flex btn-pixel-ghost"
                >
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="btn-pixel"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
                className="btn-pixel-primary"
              >
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;