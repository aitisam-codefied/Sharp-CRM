import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function DependantsModal({ setFormData, onClose }: any) {
  const [hasKids, setHasKids] = useState<boolean | null>(null);
  const [numKids, setNumKids] = useState<string>("");

  const handleSubmit = () => {
    setFormData((prev: any) => ({
      ...prev,
      hasKids,
      numKids: hasKids ? parseInt(numKids) : 0,
      // roomRequirement no longer used for fixed 1/2, but kept for reference
      roomRequirement: hasKids && parseInt(numKids) > 2 ? 2 : hasKids ? 1 : 2,
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl space-y-4 max-w-sm w-full">
        {hasKids === null ? (
          <>
            <h2 className="text-lg font-semibold">
              Are there kids among the dependants?
            </h2>
            <div className="flex gap-4 justify-end">
              <Button
                onClick={() => {
                  setHasKids(false);
                }}
              >
                No
              </Button>
              <Button
                onClick={() => {
                  setHasKids(true);
                }}
              >
                Yes
              </Button>
            </div>
          </>
        ) : hasKids ? (
          <>
            <h2 className="text-lg font-semibold">How many kids?</h2>
            <div className="space-y-2">
              <Label htmlFor="numKids">Number of Kids</Label>
              <Input
                id="numKids"
                type="number"
                min="1"
                value={numKids}
                onChange={(e) => setNumKids(e.target.value)}
              />
            </div>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setHasKids(null)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!numKids}>
                Submit
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold">No kids selected</h2>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setHasKids(null)}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
