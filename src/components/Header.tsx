import { Film, User, Heart, ShoppingBag, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Film className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="font-retro-lg text-primary">Bingeable</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Movies
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Watchlist
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Heart className="h-4 w-4 mr-2" />
                  Watchlist
                </Button>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Purchased
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;