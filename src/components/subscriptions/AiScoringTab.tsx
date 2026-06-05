import * as React from "react";
import { Bot, DollarSign, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* ------------------------------------------------------------------ */
/* AI Scoring pricing tab                                               */
/* Simple local-state form (can be wired to a real settings endpoint)  */
/* ------------------------------------------------------------------ */
export function AiScoringTab() {
  const [pricePerScan, setPricePerScan] = React.useState("20.00");
  const [freeScansPerMonth, setFreeScansPerMonth] = React.useState("0");
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    // In production: dispatch updateSettings({ aiScanPrice, freeScans })
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <p className="font-medium">AI scoring pricing</p>
        <p className="text-sm text-muted-foreground">
          Configure how much users pay for on-demand AI compatibility scans.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-base">AI Scan Purchase</CardTitle>
              <CardDescription>
                Charged per on-demand compatibility scan
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Price per scan */}
          <div className="space-y-1.5">
            <Label htmlFor="scan-price">
              Price per scan
              <span className="ml-1 text-xs text-muted-foreground">(USD)</span>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="scan-price"
                type="number"
                min="0"
                step="0.01"
                className="pl-8"
                value={pricePerScan}
                onChange={(e) => setPricePerScan(e.target.value)}
              />
            </div>
          </div>

          {/* Free scans */}
          <div className="space-y-1.5">
            <Label htmlFor="free-scans">
              Free scans per month
              <span className="ml-1 text-xs text-muted-foreground">
                (0 = paid only)
              </span>
            </Label>
            <Input
              id="free-scans"
              type="number"
              min="0"
              value={freeScansPerMonth}
              onChange={(e) => setFreeScansPerMonth(e.target.value)}
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-muted/40 px-4 py-3 text-sm">
            <p className="font-medium">Pricing summary</p>
            <p className="mt-1 text-muted-foreground">
              Members get{" "}
              <span className="font-semibold text-foreground">
                {freeScansPerMonth} free scan
                {Number(freeScansPerMonth) !== 1 ? "s" : ""}/month
              </span>
              , then pay{" "}
              <span className="font-semibold text-foreground">
                ${parseFloat(pricePerScan || "0").toFixed(2)}/scan
              </span>{" "}
              after that.
            </p>
          </div>

          <Button onClick={handleSave} className="gap-2" disabled={saved}>
            <Save className="h-4 w-4" />
            {saved ? "Saved!" : "Save settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
