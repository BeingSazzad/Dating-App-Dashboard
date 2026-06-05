import * as React from "react";
import { Logo } from "@/components/layout";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(42 78% 62% / 0.6), transparent 40%), radial-gradient(circle at 80% 70%, hsl(36 56% 42% / 0.5), transparent 45%)",
          }}
        />
        <div className="relative">
          <Logo light />
        </div>

        <div className="relative max-w-md space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Know your score · Match your level
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight">
            The control room behind a smarter way to date.
          </h2>
          <p className="text-sm leading-relaxed text-sidebar-foreground/70">
            Manage members, monitor AI compatibility scores, oversee
            subscriptions, and keep the RATED experience refined — all from one
            place.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-sm text-sidebar-foreground/60">
          <span>124k members</span>
          <span className="h-1 w-1 rounded-full bg-sidebar-foreground/40" />
          <span>98.9% uptime</span>
          <span className="h-1 w-1 rounded-full bg-sidebar-foreground/40" />
          <span>AI-powered matching</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-canvas px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <div className="mb-8 space-y-1.5">
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
