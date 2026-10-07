import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Search,
  Package,
  FileText,
  Bike,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">MediSwift</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How it works
            </a>
            <a href="#roles" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Portals
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium text-primary shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              Trusted by 500+ pharmacies
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Healthcare,
              <span className="text-primary"> delivered.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Order medicines, upload prescriptions, and get fast delivery from
              your local pharmacy. MediSwift connects customers, pharmacies, and
              drivers on one platform.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start ordering
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/customer">Explore demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything you need for medicine delivery
            </h2>
            <p className="mt-4 text-muted-foreground">
              From searching medicines to doorstep delivery — all in one app.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Search, title: 'Search Medicines', desc: 'Browse a wide catalog and find your medicines instantly.' },
              { icon: FileText, title: 'Upload Prescriptions', desc: 'Securely upload prescriptions and get them verified.' },
              { icon: Package, title: 'Track Orders', desc: 'Real-time order tracking from pharmacy to your door.' },
              { icon: Bike, title: 'Fast Delivery', desc: 'Get medicines delivered in under 60 minutes.' },
              { icon: ShieldCheck, title: 'Verified Pharmacies', desc: 'Only licensed pharmacies fulfill your orders.' },
              { icon: MapPin, title: 'Nearby Pharmacies', desc: 'Find pharmacies close to you with live stock.' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary">
                  <feature.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">One platform, four portals</h2>
            <p className="mt-4 text-muted-foreground">
              Pick a portal to explore the demo experience.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { role: 'customer', label: 'Customer', desc: 'Order medicines and track deliveries.', path: '/customer', color: 'text-primary' },
              { role: 'pharmacy', label: 'Pharmacy', desc: 'Manage orders, inventory, and prescriptions.', path: '/pharmacy', color: 'text-success' },
              { role: 'delivery', label: 'Delivery', desc: 'Pick up and deliver orders, track earnings.', path: '/delivery', color: 'text-warning' },
              { role: 'admin', label: 'Admin', desc: 'Oversee users, pharmacies, and analytics.', path: '/admin', color: 'text-info' },
            ].map((portal) => (
              <Link
                key={portal.role}
                to={portal.path}
                className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`mb-4 text-2xl font-bold capitalize ${portal.color}`}>
                  {portal.label}
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{portal.desc}</p>
                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-4 text-muted-foreground">Three simple steps to get your medicine.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: Search, step: '01', title: 'Search & Order', desc: 'Find your medicine or upload a prescription, then place your order.' },
              { icon: Clock, step: '02', title: 'Pharmacy Confirms', desc: 'A nearby licensed pharmacy receives and confirms your order.' },
              { icon: Bike, step: '03', title: 'Delivered Fast', desc: 'A delivery partner picks up and brings your medicine to your door.' },
            ].map((step) => (
              <div key={step.step} className="relative rounded-xl border bg-background p-6 shadow-sm">
                <span className="absolute right-4 top-4 text-3xl font-bold text-muted/30">
                  {step.step}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 lg:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <HeartPulse className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">MediSwift</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 MediSwift. Healthcare, delivered.
          </p>
        </div>
      </footer>
    </div>
  );
}
