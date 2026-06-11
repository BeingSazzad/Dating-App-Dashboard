import { AlertTriangle, BookOpen, Briefcase, CalendarDays, Clock, IdCard, MapPin, Phone, Wallet } from "lucide-react";
import { InfoField, SectionCard } from "@/components/users/SectionCard";
import { GENDER_LABELS } from "@/constants";
import { formatDate, timeAgo } from "@/lib/utils";
import type { UserDetail } from "@/types";

export function UserBasicInfo({ user }: { user: UserDetail }) {
  const warnings = user.warnings ?? [];

  return (
    <div className="space-y-4">
      {/* Basic information grid */}
      <SectionCard title="Basic Information" icon={IdCard}>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InfoField label="Name" value={user.name ?? "N/A"} />
          <InfoField label="Age" value={user.age ?? "N/A"} />
          <InfoField label="Gender" value={user.gender ? (GENDER_LABELS[user.gender as keyof typeof GENDER_LABELS] || user.gender) : "N/A"} />
          <InfoField
            label="Phone"
            value={user?.contact ? (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {user?.contact}
              </span>
            ) : "N/A"}
          />
          <InfoField
            label="Location"
            value={user.address ? (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {user.address}
              </span>
            ) : "N/A"}
          />
          <InfoField
            label="Join Date"
            value={user.createdAt ? (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                {formatDate(user.createdAt)}
              </span>
            ) : "N/A"}
          />
          <InfoField
            label="Last Login"
            value={user.lastLogin ? (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {timeAgo(user.lastLogin)}
              </span>
            ) : "N/A"}
          />
          <InfoField
            label="Net Worth"
            value={user.net_worth || user.netWorth ? (
              <span className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                {user.net_worth || user.netWorth}
              </span>
            ) : "N/A"}
          />
          <InfoField
            label="Profession"
            value={user.job_title || user.profession ? (
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                {user.job_title || user.profession}
              </span>
            ) : "N/A"}
          />
          <InfoField
            label="Education"
            value={user.school || user.education ? (
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                {user.school || user.education}
              </span>
            ) : "N/A"}
          />
        </dl>
      </SectionCard>

      {/* Warning history — shown only when there are warnings */}
      {warnings.length > 0 && (
        <SectionCard title="Warning History" icon={AlertTriangle}>
          <ul className="space-y-3">
            {warnings.map((w) => (
              <li
                key={w.id}
                className="rounded-lg border border-warning/30 bg-warning/5 p-4"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-warning">
                    {w.template ?? "Custom warning"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(w.date)}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {w.message}
                </p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
