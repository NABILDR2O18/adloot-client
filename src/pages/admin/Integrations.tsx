import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { RefreshCcw, Settings2Icon } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Props = object;

type IntegrationConfig = Record<string, string>;
const EMPTY_ENV: IntegrationConfig = {
  LOOTABLY_API_URL: "",
  LOOTABLY_PLACEMENT_ID: "",
  LOOTABLY_API_KEY: "",
  LOOTABLY_POSTBACK_SECRET: "",
};

const Integrations = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [lootablyEnv, setLootablyEnv] = useState<IntegrationConfig>(() => ({
    ...EMPTY_ENV,
  }));
  const generateLootablyPlaceholders = useCallback((): IntegrationConfig => {
    return {
      LOOTABLY_API_URL: "Enter API URL",
      LOOTABLY_PLACEMENT_ID: "Enter PLACEMENT ID",
      LOOTABLY_API_KEY: "Enter API KEY",
      LOOTABLY_POSTBACK_SECRET: "Enter POSTBACK SECRET",
    };
  }, []);
  const [placeholders, setPlaceholders] = useState<IntegrationConfig>(() =>
    generateLootablyPlaceholders()
  );
  const handleChange = useCallback(
    (key: keyof IntegrationConfig, value: string) => {
      setLootablyEnv((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <Fragment>
      <Card>
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <img src="/lootably.png" alt="Lootably Logo" className="w-12" />
            <div className="space-y-1 text-sm">
              <h2 className="font-semibold">Lootably</h2>
              <p className="text-muted-foreground">
                Postback URL: <strong>localhost:3000</strong>
              </p>
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <RefreshCcw className="h-3 w-3" /> Refresh
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Switch id="lootably-toggle" />
            </div>
            <Button onClick={() => setOpen(true)} variant="secondary">
              <Settings2Icon /> Configure
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="min-h-max h-auto max-h-max">
            <DialogTitle>Lootably Configuration</DialogTitle>
            <DialogDescription>
              Enter the required information to add enable lootably integration.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(lootablyEnv).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label htmlFor={key} className="text-xs font-medium">
                  {key}
                </Label>
                <Input
                  id={key}
                  value={value}
                  placeholder={placeholders[key as keyof IntegrationConfig]}
                  onChange={(e) =>
                    handleChange(key as keyof IntegrationConfig, e.target.value)
                  }
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
          <DialogFooter className="sm:justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Close
              </Button>
            </DialogClose>
            <Button type="submit" size="sm">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default Integrations;
