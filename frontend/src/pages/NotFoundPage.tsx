import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--pw-surface)] px-4 text-[var(--pw-text)]">
      <Card className="max-w-md w-full text-center p-10">
        <div className="w-12 h-12 bg-[var(--pw-danger-bg)] text-[var(--pw-danger)] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={24} />
        </div>
        <h1 className="text-6xl font-bold text-[var(--pw-text)] mb-2">404</h1>
        <p className="text-lg text-[var(--pw-text-muted)] mb-8">Page not found</p>
        <div className="flex justify-center gap-3">
          <Link to="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-md border border-[var(--pw-border)] text-[var(--pw-text)] hover:bg-[var(--pw-surface)] transition text-sm font-medium"
          >
            Go back
          </button>
        </div>
      </Card>
    </div>
  );
}
