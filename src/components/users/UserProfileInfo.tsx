import { UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InfoField, SectionCard } from "@/components/users/SectionCard";
import { LOOKING_FOR_LABELS } from "@/constants";
import type { UserDetail } from "@/types";

export function UserProfileInfo({ user }: { user: UserDetail }) {
  return (
    <SectionCard title="Profile Information" icon={UserCircle}>
      <div className="space-y-5">
        <InfoField label="Bio" value={<p className="leading-relaxed">{user.bio}</p>} />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InfoField
            label="Looking For"
            value={LOOKING_FOR_LABELS[user.lookingFor]}
          />
          <InfoField label="Education" value={user.education} />
          <InfoField label="Profession" value={user.profession} />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Interests
          </p>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Photos
          </p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {user.photos.map((src, i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                <img
                  src={src}
                  alt={`${user.name} photo ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
