import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { User, Heart, ShoppingBag, Star, Calendar } from 'lucide-react';

interface DashboardStats {
  watchlistCount: number;
  purchasedCount: number;
  totalSpent: number;
  favoriteGenre: string;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    watchlistCount: 0,
    purchasedCount: 0,
    totalSpent: 0,
    favoriteGenre: 'Unknown'
  });
  const [loading, setLoading] = useState(true);
  
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Fetch dashboard stats
  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Get watchlist count
      const { count: watchlistCount } = await supabase
        .from('watchlist')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id);

      // Get purchased movies count and total spent
      const { data: purchasedData } = await supabase
        .from('purchased_movies')
        .select('amount_paid')
        .eq('user_id', user?.id);

      const purchasedCount = purchasedData?.length || 0;
      const totalSpent = purchasedData?.reduce((sum, item) => sum + (Number(item.amount_paid) || 0), 0) || 0;

      setStats({
        watchlistCount: watchlistCount || 0,
        purchasedCount,
        totalSpent,
        favoriteGenre: 'Action' // This could be calculated from purchased movies
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pixel-pattern">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <User className="h-8 w-8 text-primary" />
              <h1 className="font-pixel-2xl text-primary">Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-lg font-sans">
              Welcome back, {user.email}
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="movie-card p-6 text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="font-pixel-xl text-foreground mb-2">
                {loading ? '...' : stats.watchlistCount}
              </div>
              <div className="font-pixel text-muted-foreground">Watchlist</div>
            </div>

            <div className="movie-card p-6 text-center">
              <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="font-pixel-xl text-foreground mb-2">
                {loading ? '...' : stats.purchasedCount}
              </div>
              <div className="font-pixel text-muted-foreground">Purchased</div>
            </div>

            <div className="movie-card p-6 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="font-pixel-xl text-foreground mb-2">
                ₹{loading ? '...' : stats.totalSpent.toFixed(0)}
              </div>
              <div className="font-pixel text-muted-foreground">Total Spent</div>
            </div>

            <div className="movie-card p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="font-pixel-xl text-foreground mb-2">
                {loading ? '...' : stats.favoriteGenre}
              </div>
              <div className="font-pixel text-muted-foreground">Fav Genre</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="movie-card p-8">
            <h2 className="font-pixel-lg text-foreground mb-6 text-center">Quick Actions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/')}
                className="btn-pixel-primary"
              >
                Browse Movies
              </button>
              
              <button
                onClick={() => navigate('/watchlist')}
                className="btn-pixel-ghost"
              >
                View Watchlist
              </button>
              
              <button
                onClick={handleSignOut}
                className="btn-pixel"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Account Info */}
          <div className="movie-card p-8 mt-6">
            <h2 className="font-pixel-lg text-foreground mb-6">Account Information</h2>
            
            <div className="space-y-4 font-sans">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Member since:</span>
                <span className="text-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Account ID:</span>
                <span className="text-foreground text-xs font-mono">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;