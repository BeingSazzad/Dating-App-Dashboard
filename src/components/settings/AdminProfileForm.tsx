import * as React from "react";
import { Camera, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
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
import { initials } from "@/lib/utils";
import { useUpdateProfileMutation } from "@/redux/apiSlices/authSlice";
import { getImageUrl } from "@/utils/getImageUrl";

export interface AdminProfileUser {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  role?: string;
}

interface AdminProfileFormProps {
  user?: AdminProfileUser | null;
}

export function AdminProfileForm({ user }: AdminProfileFormProps) {
  const [name, setName] = React.useState(user?.name ?? "");
  const [previewImage, setPreviewImage] = React.useState(user?.image ?? "");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setName(user?.name ?? "");
    setPreviewImage(user?.image ?? "");
    setSelectedFile(null);
  }, [user]);

  React.useEffect(() => {
    return () => {
      if (previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    const body = {
      name: name.trim()
    }

    const formData = new FormData();
    formData.append("body", JSON.stringify(body));
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      toast.promise(updateProfile(formData).unwrap(), {
        loading: "Updating profile...",
        success: () => {
          setSelectedFile(null);
          return "Profile updated successfully.";
        },
        error: "Failed to update profile.",
      });
    } catch (error) {
      if (error) {
        console.log(error)
        toast.error("Failed to update profile.")
      } else {
        toast.error("Failed to update profile.")
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Profile</CardTitle>
        <CardDescription>Update the signed-in admin name and profile image.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleAvatarClick}
            className="group relative h-16 w-16 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            title="Click to change photo"
          >
            <Avatar className="h-16 w-16 border border-border">
              <AvatarImage src={getImageUrl(previewImage || user?.image || "")} alt={name} />
              <AvatarFallback className="text-lg">
                {initials(name || "Admin")}
              </AvatarFallback>
            </Avatar>
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

        <div className="space-y-2">
          <Label htmlFor="admin-name">Name</Label>
          <Input
            id="admin-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter admin name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input
            id="admin-email"
            type="email"
            value={user?.email ?? ""}
            disabled
            className="bg-muted cursor-not-allowed text-muted-foreground"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
            {isLoading ? (
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
