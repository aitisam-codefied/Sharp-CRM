import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Send } from "lucide-react";

interface NewNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notificationTypes: string[];
  priorities: string[];
  branches: string[];
  targetAudiences: string[];
  onCreate: () => void;
}

export function NewNotificationDialog({
  open,
  onOpenChange,
  notificationTypes,
  priorities,
  branches,
  targetAudiences,
  onCreate,
}: NewNotificationDialogProps) {
  return (
    <Dialog open={open}  onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create New Notification</DialogTitle>
          <DialogDescription>
            Send notification to staff members across branches
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notification Title</Label>
              <Input id="title" placeholder="Enter notification title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter notification message..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities?.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches?.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {targetAudiences?.map((audience) => (
                    <SelectItem key={audience} value={audience}>
                      {audience
                        .replace("_", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledFor">Schedule For (Optional)</Label>
              <Input id="scheduledFor" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expires At (Optional)</Label>
              <Input id="expiresAt" type="datetime-local" />
            </div>
          </div>
          <div className="space-y-4">
            <Label>Notification Options</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="email" />
                <Label htmlFor="email">Send email notification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sms" />
                <Label htmlFor="sms">Send SMS notification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="push" />
                <Label htmlFor="push">Send push notification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="persistent" />
                <Label htmlFor="persistent">
                  Make persistent (requires acknowledgment)
                </Label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Save as Draft
          </Button>
          <Button onClick={onCreate}>
            <Send className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
