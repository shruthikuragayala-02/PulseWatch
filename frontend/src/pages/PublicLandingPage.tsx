import { Link } from "react-router-dom";
import {
  ArrowRight,
  Monitor,
  Activity,
  BarChart3,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function PublicLandingPage() {
  const features = [
    {
      icon: <Monitor size={34} />,
      title: "Uptime Monitoring",
      description: "Continuously check your endpoints and APIs from multiple locations with configurable intervals.",
    },
    {
      icon: <Activity size={34} />,
      title: "Incident Tracking",
      description: "Automatically detect and track downtime incidents with full history and resolution timeline.",
    },
    {
      icon: <BarChart3 size={34} />,
      title: "Health History",
      description: "Review response times, status codes, and check history over time with detailed analytics.",
    },
    {
      icon: <Zap size={34} />,
      title: "Instant Alerts",
      description: "Get notified the moment a monitor goes down so you can act before your users do.",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Add your endpoint",
      description: "Enter the URL of any website, API, or service you want to monitor.",
    },
    {
      step: "2",
      title: "We check continuously",
      description: "PulseWatch polls your endpoints on your schedule and records every response.",
    },
    {
      step: "3",
      title: "Get alerted on issues",
      description: "When a monitor goes down, an incident is created and you're notified immediately.",
    },
  ];

  return (
    <div className="min-h-screen bg-pw-bg text-pw-text selection:bg-pw-accent selection:text-pw-text-inverse">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-pw-border/50 bg-pw-bg/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-pw-accent to-cyan-600 rounded-lg flex items-center justify-center text-pw-text-inverse font-bold text-lg shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                P
              </div>
              <span className="font-bold text-xl tracking-tight text-pw-text">PulseWatch</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link
                to="/login"
                className="text-sm font-medium text-pw-text-muted hover:text-pw-accent transition-colors"
              >
                Sign in
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get started <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <button className="p-2 text-pw-text-muted hover:text-pw-accent rounded-lg hover:bg-pw-surface transition-colors" aria-label="Menu">
                <MenuIcon size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-lg border border-pw-border/50 bg-pw-surface/50 px-3 py-1.5 text-xs font-medium text-pw-accent">
                <ShieldCheck size={14} className="mr-1" /> Uptime SLA monitoring
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-pw-text tracking-tight leading-tight">
                Know when your services go down. <span className="text-pw-accent">Before your users do.</span>
              </h1>
              <p className="text-lg text-pw-text-muted max-w-xl leading-relaxed">
                Monitor your websites, APIs, and services with continuous health checks. Get instant incident tracking, response time analytics, and actionable alerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="Button w-auto">
                  Start free trial <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link to="/login" className="Button variant-outline w-auto">
                  Sign in
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* Dashboard preview card */}
              <div className="relative rounded-xl border border-pw-border bg-pw-card shadow-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-pw-danger" />
                  <div className="w-2 h-2 rounded-full bg-pw-warning" />
                  <div className="w-2 h-2 rounded-full bg-pw-success" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-pw-text-muted">Total Monitors</p>
                    <p className="text-xl font-bold text-pw-text">24</p>
                  </div>
                  <div>
                    <p className="text-xs text-pw-text-muted">Uptime</p>
                    <p className="text-xl font-bold text-pw-success">99.8%</p>
                  </div>
                  <div>
                    <p className="text-xs text-pw-text-muted">Avg Response</p>
                    <p className="text-xl font-bold text-pw-text">142ms</p>
                  </div>
                </div>
                <div className="mt-6 h-32 rounded-lg border border-pw-border bg-pw-surface overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-pw-border/50">
                    <span className="text-xs text-pw-text-muted">api.example.com</span>
                    <StatusDot status="UP" />
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 border-b border-pw-border/50">
                    <span className="text-xs text-pw-text-muted">web.app.health</span>
                    <StatusDot status="UP" />
                  </div>
                  <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-xs text-pw-text-muted">staging.api.internal</span>
                    <StatusDot status="DOWN" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 border-y border-pw-border/50 bg-pw-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pw-text tracking-tight">Everything you need to stay online</h2>
            <p className="text-pw-text-muted mt-4 max-w-2xl mx-auto">
              Production-grade monitoring built for teams that care about reliability.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <Card key={i} padding="lg" className="hover:border-pw-accent/50 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-pw-accent-bg/20 text-pw-accent flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-pw-text mb-3">{feature.title}</h3>
                <p className="text-sm text-pw-text-muted leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pw-text tracking-tight">How it works</h2>
            <p className="text-pw-text-muted mt-4 max-w-2xl mx-auto">
              Set up monitoring in minutes and gain instant visibility into your infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, i) => (
              <Card key={i} padding="lg" className="group">
                <div className="w-10 h-10 rounded-lg border border-pw-border bg-pw-card flex items-center justify-center mb-5 group-hover:border-pw-accent transition-colors">
                  <span className="text-sm font-bold text-pw-text">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-pw-text mb-3">{step.title}</h3>
                <p className="text-sm text-pw-text-muted leading-relaxed">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative rounded-xl border border-pw-border bg-gradient-to-br from-pw-card to-pw-surface shadow-xl p-8 md:p-12 overflow-hidden">
            <div className="absolute inset-0 bg-pw-accent/5 blur-[100px] -z-10" />
            <h2 className="text-3xl font-bold text-pw-text tracking-tight">Ready to monitor your stack?</h2>
            <p className="text-pw-text-muted mt-4 max-w-xl mx-auto">
              Join teams that rely on PulseWatch for uptime, incident tracking, and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Link to="/register" className="Button w-auto">
                Create your account <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/login" className="Button variant-outline w-auto">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-pw-border/50 bg-pw-surface/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-pw-accent to-cyan-600 rounded flex items-center justify-center text-pw-text-inverse font-bold">
              P
            </div>
            <span className="font-bold text-lg tracking-tight text-pw-text">PulseWatch</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-pw-text-muted">
            <Link to="/login" className="hover:text-pw-accent transition-colors">Sign in</Link>
            <span className="text-pw-text-light">© {new Date().getFullYear()} PulseWatch</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MenuIcon({ size }: { size?: number }) {
  return (
    <svg width={size || 20} height={size || 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function StatusDot({ status }: { status: "UP" | "DOWN" }) {
  return (
    <span
      className={`w-2 h-2 rounded-full ${status === "UP" ? "bg-pw-success" : "bg-pw-danger"}`}
    />
  );
}
