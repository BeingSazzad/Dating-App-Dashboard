import * as React from "react";
import { AlertTriangle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal as Dialog,
  ModalContent as DialogContent,
  ModalDescription as DialogDescription,
  ModalFooter as DialogFooter,
  ModalHeader as DialogHeader,
  ModalTitle as DialogTitle,
} from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/* ------------------------------------------------------------------ */
/* Warning templates                                                    */
/* ------------------------------------------------------------------ */
const WARNING_TEMPLATES = [
  {
    id: "harassment",
    label: "Harassment",
    message:
      "Your account has received multiple harassment reports. Continued abusive behaviour toward other members will result in a permanent ban.",
  },
  {
    id: "fake_photos",
    label: "Fake / misleading photos",
    message:
      "Your profile photos appear to be inauthentic or taken from the internet. Please update your photos with genuine images of yourself within 48 hours to avoid suspension.",
  },
  {
    id: "spam",
    label: "Spam / promotion",
    message:
      "You have been reported for sending unsolicited promotional content or external links. This violates our community guidelines. Further violations will result in a ban.",
  },
  {
    id: "inappropriate",
    label: "Inappropriate content",
    message:
      "Your profile contains content that violates our community standards. Please review and update your bio or photos to comply with our guidelines.",
  },
  {
    id: "custom",
    label: "Custom message",
    message: "",
  },
] as const;

type TemplateId = (typeof WARNING_TEMPLATES)[number]["id"];

/* ------------------------------------------------------------------ */
/* Props                                                                */
/* ------------------------------------------------------------------ */
interface SendWarningDialogProps {
  userId: string | null;
  userName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
export function SendWarningDialog({
  userId,
  userName,
  open,
  onOpenChange,
}: SendWarningDialogProps) {
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<TemplateId>("harassment");
  const [customMessage, setCustomMessage] = React.useState("");
  const isLoading = false

  const activeTemplate = WARNING_TEMPLATES.find(
    (t) => t.id === selectedTemplate,
  )!;
  const finalMessage =
    selectedTemplate === "custom" ? customMessage : activeTemplate.message;

  const handleClose = (o: boolean) => {
    if (!o) {
      setSelectedTemplate("harassment");
      setCustomMessage("");
    }
    onOpenChange(o);
  };

  const handleSend = async () => {
    if (!userId || !finalMessage.trim()) return;
    // await sendWarning({
    //   userId,
    //   message: finalMessage.trim(),
    //   template: selectedTemplate === "custom" ? undefined : activeTemplate.label,
    // })
    //   .unwrap()
    //   .catch(() => undefined);
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Send Warning
          </DialogTitle>
          <DialogDescription>
            Send an official warning to{" "}
            <span className="font-medium text-foreground">
              {userName ?? "this user"}
            </span>
            . The message will be logged and visible in their profile.
          </DialogDescription>
        </DialogHeader>

        {/* Template selector */}
        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Warning template
          </Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {WARNING_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTemplate(t.id)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${selectedTemplate === t.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-foreground hover:bg-muted"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message preview / editor */}
        <div className="space-y-2">
          <Label htmlFor="warning-message" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {selectedTemplate === "custom" ? "Custom message" : "Message preview"}
          </Label>
          {selectedTemplate === "custom" ? (
            <Textarea
              id="warning-message"
              rows={4}
              placeholder="Write a custom warning message…"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="resize-none text-sm"
            />
          ) : (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
              {activeTemplate.message}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isLoading || !finalMessage.trim()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isLoading ? "Sending…" : "Send warning"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
