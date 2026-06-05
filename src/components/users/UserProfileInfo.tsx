import {
  Beer,
  BookOpen,
  Briefcase,
  Cigarette,
  Dumbbell,
  Globe2,
  Heart,
  Languages,
  Ruler,
  Sparkles,
  Star,
  UserCircle,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InfoField, SectionCard } from "@/components/users/SectionCard";
import { LOOKING_FOR_LABELS } from "@/constants";
import type { UserDetail } from "@/types";

/* ── small label → icon map for lifestyle items ─────────────────────── */
const LIFESTYLE_ITEMS = (user: UserDetail) => [
  { label: "Smoking",  value: user.smoking,  icon: Cigarette },
  { label: "Drinking", value: user.drinking, icon: Beer },
  { label: "Workout",  value: user.workout,  icon: Dumbbell },
  { label: "Star Sign",value: user.starSign, icon: Star },
];

export function UserProfileInfo({ user }: { user: UserDetail }) {
  return (
    <div className="space-y-5">

      {/* ── About (bio) ─────────────────────────────────────────────── */}
      <SectionCard title="About" icon={UserCircle}>
        <p className="text-sm leading-relaxed text-foreground/90">{user.bio}</p>
      </SectionCard>

      {/* ── Basic Info ──────────────────────────────────────────────── */}
      <SectionCard title="Basic Info" icon={Sparkles}>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InfoField
            label="Gender"
            value={
              <span className="capitalize">{user.gender}</span>
            }
          />
          <InfoField
            label="Height"
            value={
              <span className="flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                {user.height} cm
              </span>
            }
          />
          <InfoField
            label="Net Worth"
            value={
              <span className="flex items-center gap-1.5">
                <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
                {user.netWorth}
              </span>
            }
          />
          <InfoField
            label="Profession"
            value={
              <span className="flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                {user.profession}
              </span>
            }
          />
          <InfoField
            label="Education"
            value={
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                {user.education}
              </span>
            }
          />
        </dl>
      </SectionCard>

      {/* ── Relationship ────────────────────────────────────────────── */}
      <SectionCard title="Relationship" icon={Heart}>
        <InfoField
          label="Looking For"
          value={LOOKING_FOR_LABELS[user.lookingFor]}
        />
      </SectionCard>

      {/* ── Interests ───────────────────────────────────────────────── */}
      <SectionCard title="Interests" icon={Globe2}>
        <div className="flex flex-wrap gap-2">
          {user.interests.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </SectionCard>

      {/* ── Lifestyle ───────────────────────────────────────────────── */}
      <SectionCard title="Lifestyle" icon={Sparkles}>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {LIFESTYLE_ITEMS(user).map(({ label, value, icon: Icon }) => (
            <div key={label} className="space-y-1">
              <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </dt>
              <dd className="text-sm font-medium capitalize text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Languages row */}
        <div className="mt-4 space-y-1">
          <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Languages className="h-3.5 w-3.5" />
            Languages
          </p>
          <div className="flex flex-wrap gap-2">
            {user.languages.map((lang) => (
              <Badge key={lang} variant="outline" className="text-xs">
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── Photos ──────────────────────────────────────────────────── */}
      <SectionCard title="Photos" icon={Globe2}>
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
      </SectionCard>

    </div>
  );
}
