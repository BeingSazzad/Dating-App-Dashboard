import { Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, type Column } from "@/components/shared";
import { SectionCard } from "@/components/users/SectionCard";
import { formatDate, initials } from "@/lib/utils";
import type { MatchRecord } from "@/types";

export function MatchHistory({ matches }: { matches: MatchRecord[] }) {
  const columns: Column<MatchRecord>[] = [
    {
      key: "name",
      header: "Match User",
      cell: (m) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={m.avatar} alt={m.name} />
            <AvatarFallback>{initials(m.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{m.name}</span>
        </div>
      ),
    },
    {
      key: "matchedAt",
      header: "Match Date",
      align: "right",
      cell: (m) => (
        <span className="text-muted-foreground">{formatDate(m.matchedAt)}</span>
      ),
    },
  ];

  return (
    <SectionCard title="Match History" icon={Heart}>
      <DataTable
        columns={columns}
        data={matches}
        rowKey={(m) => m.id}
        emptyTitle="No matches yet"
        skeletonRows={4}
      />
    </SectionCard>
  );
}
