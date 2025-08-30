import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Film, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (isSignUp) {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pixel-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 border-2 border-primary glow-primary">
            <Film className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-pixel-xl text-primary mb-2">Bingeable</h1>
          <p className="text-muted-foreground font-sans">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="movie-card p-6">
            <h2 className="font-pixel-lg text-foreground mb-6 text-center">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </h2>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="font-pixel text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-pixel w-full"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="font-pixel text-foreground flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-pixel w-full pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="btn-pixel-primary w-full mt-6"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>

            {/* Switch Mode */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-pixel text-primary hover:text-primary-glow transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground text-sm font-sans">
            Experience the best in cinema with our pixelated retro interface
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;