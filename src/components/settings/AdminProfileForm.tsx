import * as React from "react";
import { Camera, Loader2, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/store/hooks";
import { updateProfile } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks";
import { initials } from "@/lib/utils";

export function AdminProfileForm() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [name, setName] = React.useState(user?.name ?? "");
  const [email] = React.useState(user?.email ?? "");
  const [avatar, setAvatar] = React.useState(user?.avatar ?? "");
  const [saving, setSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setName(user?.name ?? "");
    setAvatar(user?.avatar ?? "");
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected if needed
    e.target.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    dispatch(updateProfile({ name, avatar }));
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>Your account details and display name.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-4">
          {/* Clickable avatar */}
          <button
            type="button"
            onClick={handleAvatarClick}
            className="group relative h-16 w-16 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            title="Click to change photo"
          >
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={avatar || user?.avatar} alt={name} />
              <AvatarFallback className="text-lg">
                {initials(name || "Admin")}
              </AvatarFallback>
            </Avatar>
            {/* Hover overlay */}
            <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
              <span className="mt-0.5 text-[10px] font-medium text-white">
                Change
              </span>
            </span>
          </button>

          <div>
            <p className="font-medium">{name || "Admin"}</p>
            <p className="text-sm capitalize text-muted-foreground">
              {user?.role?.replace("_", " ") ?? "admin"}
            </p>

          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Name</Label>
            <Input
              id="admin-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              disabled
              className="bg-muted cursor-not-allowed text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
