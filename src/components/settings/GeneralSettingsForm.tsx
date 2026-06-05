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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LoadingState } from "@/components/shared";
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from "@/services";
import type { AppSettings } from "@/types";

export function GeneralSettingsForm() {
  const { data, isLoading } = useGetSettingsQuery();
  const [update, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const [form, setForm] = React.useState<AppSettings>({
    currency: "USD",
    safetyMode: true,
    autoBanThreshold: 3,
    aiScoreVisibility: true,
  });

  React.useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleSave = async () => {
    await update(form).unwrap().catch(() => undefined);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Settings</CardTitle>
        <CardDescription>
          Configure AI score visibility and auto-ban warnings threshold.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState label="Loading settings…" />
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 pr-4">
                  <Label className="text-sm font-semibold">AI Compatibility Score Visibility</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow members to see their AI scores directly on their profiles.
                  </p>
                </div>
                <Switch
                  checked={form.aiScoreVisibility}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, aiScoreVisibility: v }))
                  }
                />
              </div>

              <div className="space-y-2 max-w-[16rem]">
                <Label htmlFor="ban-threshold">Auto-Ban Warnings Threshold</Label>
                <Input
                  id="ban-threshold"
                  type="number"
                  min={1}
                  max={10}
                  value={form.autoBanThreshold}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      autoBanThreshold: Number(e.target.value),
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Number of official warnings a user can receive before an automatic permanent ban.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Configuration
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
