import * as React from "react";
import { Loader2, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor, LoadingState } from "@/components/shared";
import {
  useGetCmsContentQuery,
  useUpdateCmsContentMutation,
} from "@/services";
import { timeAgo } from "@/lib/utils";
import type { CmsContent, CmsKey } from "@/types";

const SECTIONS: { key: CmsKey; label: string; description: string }[] = [
  {
    key: "privacy_policy",
    label: "Privacy Policy",
    description: "How member data is collected, used, and protected.",
  },
  {
    key: "terms",
    label: "Terms & Conditions",
    description: "The rules members agree to when using RATED.",
  },
  {
    key: "about_us",
    label: "About Us",
    description: "The story and mission shown in the mobile app.",
  },
];

function CmsSectionEditor({ content }: { content: CmsContent }) {
  const [update, { isLoading: isSaving }] = useUpdateCmsContentMutation();
  const [body, setBody] = React.useState(content.body);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    setBody(content.body);
    setDirty(false);
  }, [content]);

  const handleSave = async () => {
    await update({ key: content.key, body }).unwrap().catch(() => undefined);
    setDirty(false);
  };

  return (
    <div className="space-y-4">
      <RichTextEditor
        value={body}
        onChange={(html) => {
          setBody(html);
          setDirty(true);
        }}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Last updated {timeAgo(content.updatedAt)}
        </p>
        <Button onClick={handleSave} disabled={!dirty || isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save changes
        </Button>
      </div>
    </div>
  );
}

export function CmsEditor() {
  const { data, isLoading } = useGetCmsContentQuery();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Static Content</CardTitle>
        <CardDescription>
          Edit the legal and informational pages surfaced in the mobile app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || !data ? (
          <LoadingState label="Loading content…" />
        ) : (
          <Tabs defaultValue={SECTIONS[0].key}>
            <TabsList className="mb-4">
              {SECTIONS.map((s) => (
                <TabsTrigger key={s.key} value={s.key}>
                  {s.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {SECTIONS.map((s) => {
              const content = data.find((c) => c.key === s.key);
              return (
                <TabsContent key={s.key} value={s.key} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {s.description}
                  </p>
                  {content && <CmsSectionEditor content={content} />}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
