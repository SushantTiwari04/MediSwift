import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { HeartPulse, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, AlertCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, getRoleHomePath } from '@/lib/auth';

interface FormErrors {
  email?: string;
  password?: string;
}

export function CustomerLoginPage() {
  const navigate = useNavigate();
  const { signIn, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mode, setMode] = useState<'email' | 'phone'>('email');

  if (profile) {
    return <Navigate to={getRoleHomePath(profile.role)} replace />;
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (mode === 'email') {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Enter a valid email address';
      }
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setAuthError(error);
      return;
    }
    navigate('/customer');
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden flex-1 flex-col justify-between bg-primary px-12 py-12 lg:flex">
        <div className="flex items-center gap-2 text-primary-foreground">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/20">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">MediSwift</span>
        </div>
        <div className="mx-auto max-w-md text-primary-foreground">
          <h1 className="mb-4 text-3xl font-bold leading-tight">
            Your health, delivered to your door.
          </h1>
          <p className="text-primary-foreground/80">
            Order medicines, upload prescriptions, and get fast delivery from
            verified pharmacies near you.
          </p>
          <div className="mt-8 space-y-3">
            {['500+ verified pharmacies', 'Prescription verification in minutes', 'Live delivery tracking'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-primary-foreground/90">
                <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-primary-foreground/60">© 2026 MediSwift. Healthcare, delivered.</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">MediSwift</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your customer account to continue ordering medicines.
            </p>
          </div>

          {/* Mode toggle */}
          <div className="mt-6 flex rounded-lg border p-1">
            <button
              type="button"
              onClick={() => setMode('email')}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${mode === 'email' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMode('phone')}
              className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${mode === 'phone' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Phone
            </button>
          </div>

          {authError && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {authError}
            </div>
          )}

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor={mode === 'email' ? 'email' : 'phone'}>
                {mode === 'email' ? 'Email address' : 'Phone number'}
              </Label>
              <div className="relative">
                {mode === 'email' ? (
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                ) : (
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                )}
                <Input
                  id={mode === 'email' ? 'email' : 'phone'}
                  type={mode === 'email' ? 'email' : 'tel'}
                  placeholder={mode === 'email' ? 'you@example.com' : '+91 98765 43210'}
                  className="pl-9"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                />
              </div>
              {errors.email && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/customer/signup" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
