import * as React from "react";
import { KeyRound, Loader2 } from "lucide-react";
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

export function ChangePasswordForm() {
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < 8;
  const canSave =
    current.length > 0 &&
    next.length >= 8 &&
    next === confirm &&
    !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setMessage(null);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setCurrent("");
    setNext("");
    setConfirm("");
    setMessage("Password updated successfully.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Use at least 8 characters with a mix of letters and numbers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="current-pw">Current password</Label>
          <Input
            id="current-pw"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-pw">New password</Label>
            <Input
              id="new-pw"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
            />
            {tooShort && (
              <p className="text-xs text-destructive">
                Must be at least 8 characters.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pw">Confirm password</Label>
            <Input
              id="confirm-pw"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            {mismatch && (
              <p className="text-xs text-destructive">
                Passwords do not match.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          {message ? (
            <p className="text-sm text-success">{message}</p>
          ) : (
            <span />
          )}
          <Button onClick={handleSave} disabled={!canSave}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            Update password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
