import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-6 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="font-display text-7xl font-semibold text-primary">404</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Button onClick={() => navigate("/")}>
        <Home className="h-4 w-4" /> Back to dashboard
      </Button>
    </div>
  );
}
