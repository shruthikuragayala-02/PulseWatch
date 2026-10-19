import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/Loading";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch {
      // Error handled by hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pw-surface px-4 py-8 text-pw-text">
      <Card className="max-w-md w-full p-8 md:p-12">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-pw-accent to-cyan-600 rounded-lg flex items-center justify-center text-pw-text-inverse font-bold text-lg shadow-[0_0_20px_rgba(34,211,238,0.4)] mx-auto mb-4">
            P
          </div>
          <h1 className="text-2xl font-bold text-pw-text tracking-tight">Welcome back</h1>
          <p className="text-pw-text-muted mt-2">Sign in to your PulseWatch account</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            leftIcon={<Mail size={18} />}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            leftIcon={<Lock size={18} />}
          />
          <button
            type="submit"
            disabled={loading}
            className="Button w-full"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                Sign in <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-pw-text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-pw-accent font-medium hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
