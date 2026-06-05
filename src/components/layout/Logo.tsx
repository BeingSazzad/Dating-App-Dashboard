import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Show the full "RATED" wordmark next to the monogram. */
  showWordmark?: boolean;
  /** Render light text (for the dark sidebar). */
  light?: boolean;
}

export function Logo({ className, showWordmark = true, light }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[hsl(42_78%_62%)] to-[hsl(36_56%_42%)] shadow-gold">
        <span className="font-display text-xl font-700 leading-none text-[hsl(26_30%_14%)]">
          R
        </span>
      </span>
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-lg font-semibold tracking-[0.22em]",
              light ? "text-sidebar-foreground" : "text-foreground",
            )}
          >
            RATED
          </span>
          <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.18em] text-primary">
            Admin
          </span>
        </span>
      )}
    </div>
  );
}
