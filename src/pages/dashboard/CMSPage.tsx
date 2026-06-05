import { PageHeader } from "@/components/shared";
import { CmsEditor, InterestManagement } from "@/components/cms";

export function CMSPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management"
        description="Maintain legal pages and the interests members can choose from."
      />
      <CmsEditor />
      <InterestManagement />
    </div>
  );
}
