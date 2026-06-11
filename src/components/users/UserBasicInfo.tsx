import { AlertTriangle, CalendarDays, Clock, IdCard, Mail, MapPin, Phone } from "lucide-react";
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
            label="Email"
            value={user.email ? (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {user.email}
              </span>
            ) : "N/A"}
          />
          <InfoField
            label="Phone"
            value={user.phone ? (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                {user.phone}
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
