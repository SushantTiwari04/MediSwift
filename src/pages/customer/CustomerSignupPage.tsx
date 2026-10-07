import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { HeartPulse, Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, AlertCircle, User, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth, getRoleHomePath } from '@/lib/auth';

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  city?: string;
  terms?: string;
}

export function CustomerSignupPage() {
  const navigate = useNavigate();
  const { signUp, profile } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (profile) {
    return <Navigate to={getRoleHomePath(profile.role)} replace />;
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name) newErrors.name = 'Full name is required';
    else if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!phone) newErrors.phone = 'Phone number is required';
    else if (!/^[+]?[\d\s-]{10,15}$/.test(phone)) newErrors.phone = 'Enter a valid phone number';

    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Enter a valid email address';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!city) newErrors.city = 'Please select your city';
    if (!terms) newErrors.terms = 'You must accept the terms to continue';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!validate()) return;
    setLoading(true);
    const { error } = await signUp({
      email,
      password,
      fullName: name,
      phone,
      role: 'customer',
      city,
    });
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
            Join MediSwift for faster, safer healthcare.
          </h1>
          <p className="text-primary-foreground/80">
            Create a customer account to order medicines, upload prescriptions,
            and track deliveries in real time.
          </p>
          <div className="mt-8 space-y-3">
            {['Free account, no hidden charges', 'Upload prescriptions securely', 'Reorder medicines in one tap'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-primary-foreground/90">
                <CheckCircle2 className="h-4 w-4" />
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
            <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
            <p className="text-sm text-muted-foreground">
              Sign up as a customer to start ordering medicines.
            </p>
          </div>

          {authError && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {authError}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="pl-9"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                />
              </div>
              {errors.name && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="pl-9"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: undefined }); }}
                />
              </div>
              {errors.phone && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
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
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select value={city} onValueChange={(v) => { setCity(v); if (errors.city) setErrors({ ...errors, city: undefined }); }}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bengaluru">Bengaluru</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
              {errors.city && (
                <p className="flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.city}
                </p>
              )}
            </div>
            <div>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={terms}
                  onChange={(e) => { setTerms(e.target.checked); if (errors.terms) setErrors({ ...errors, terms: undefined }); }}
                />
                <span>I agree to MediSwift's Terms of Service, Privacy Policy, and consent to receive health-related notifications.</span>
              </label>
              {errors.terms && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.terms}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/customer/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
