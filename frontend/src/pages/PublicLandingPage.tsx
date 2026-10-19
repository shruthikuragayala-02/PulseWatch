import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Activity, BarChart3, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function PublicLandingPage() {
  const features = [
    { icon: <Monitor size={32} />, title: "Uptime Monitoring", description: "Continuously check your endpoints and APIs." },
    { icon: <Activity size={32} />, title: "Incident Tracking", description: "Automatically detect and track downtime incidents." },
    { icon: <BarChart3 size={32} />, title: "Health History", description: "Review response times and check history over time." },
    { icon: <Zap size={32} />, title: "Instant Alerts", description: "Get notified the moment a monitor goes down." },
  ];

  return (
    <div className="min-h-screen bg-[var(--pw-bg)] text-[var(--pw-text)]">
      <nav className="sticky top-0 z-40 border-b border-[var(--pw-border)] bg-[var(--pw-card)]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--pw-accent)] rounded-[var(--pw-radius-sm)] flex items-center justify-center text-white font-bold text-sm">
                P
              </div>
              <span className="font-bold text-xl tracking-tight text-[var(--pw-text)]">PulseWatch</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-[var(--pw-text-muted)] hover:text-[var(--pw-accent)]">
                Sign in
              </Link>
              <Button>Get started</Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--pw-text)] mb-6 tracking-tight">
            Production monitoring, simplified.
          </h1>
          <p className="text-lg text-[var(--pw-text-muted)] mb-10 max-w-xl mx-auto leading-relaxed">
            Monitor your websites and APIs, detect incidents fast, and keep your team informed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button>Start free trial</Button>
            </Link>
            <Link to="/login" className="px-5 py-2.5 rounded-md border border-[var(--pw-border)] text-[var(--pw-text)] hover:bg-[var(--pw-surface)] transition">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--pw-surface)] border-y border-[var(--pw-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--pw-text)] mb-10 text-center">Everything you need to stay online</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card key={i} padding="lg" className="text-[var(--pw-text)]">
                <div className="w-10 h-10 bg-[var(--pw-accent-bg)] text-[var(--pw-accent)] rounded-[var(--pw-radius-sm)] flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-[var(--pw-text)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--pw-text-muted)] leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--pw-text)] mb-3">Ready to monitor your stack?</h2>
            <p className="text-[var(--pw-text-muted)]">Join teams that rely on PulseWatch for uptime.</p>
          </div>
          <div className="max-w-md mx-auto">
            <Link to="/register" className="w-full Button">
              <ArrowRight size={18} className="mr-2" /> Create your account
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--pw-border)] py-8 bg-[var(--pw-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <span className="text-sm text-[var(--pw-text-muted)]">© {new Date().getFullYear()} PulseWatch</span>
          <div className="flex items-center gap-6 text-sm text-[var(--pw-text-muted)]">
            <Link to="/login" className="hover:text-[var(--pw-accent)] transition">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
