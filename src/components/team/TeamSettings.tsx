import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export interface TeamPreferences {
  enableChat: boolean;
  enableCall: boolean;
  notifications: { sound: boolean; muteAll: boolean };
  availability: "Online" | "Busy" | "Away";
  blockedUsers: string[];
}

interface TeamSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: TeamPreferences;
  onChange: (prefs: TeamPreferences) => void;
}

const TeamSettings: React.FC<TeamSettingsProps> = ({
  open,
  onOpenChange,
  preferences,
  onChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team Communication Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Enable Chat</span>
            <Switch
              checked={preferences.enableChat}
              onCheckedChange={(v) =>
                onChange({ ...preferences, enableChat: v })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Enable Call</span>
            <Switch
              checked={preferences.enableCall}
              onCheckedChange={(v) =>
                onChange({ ...preferences, enableCall: v })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Notification Sound</span>
            <Switch
              checked={preferences.notifications.sound}
              onCheckedChange={(v) =>
                onChange({
                  ...preferences,
                  notifications: { ...preferences.notifications, sound: v },
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Mute All Notifications</span>
            <Switch
              checked={preferences.notifications.muteAll}
              onCheckedChange={(v) =>
                onChange({
                  ...preferences,
                  notifications: { ...preferences.notifications, muteAll: v },
                })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamSettings;
