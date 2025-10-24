import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Video, Phone, Users } from "lucide-react";
import { useCall } from "@/contexts/CallContext";
import { useAuth } from "@/contexts/AuthContext";
import CallSelectionModal from "./CallSelectionModal";

interface CallManagerProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  showText?: boolean;
  currentDepartment?: string;
  customLabel?: string;
}

export default function CallManager({
  variant = "default",
  size = "default",
  className = "",
  showText = true,
  currentDepartment,
  customLabel,
}: CallManagerProps) {
  const { startCall } = useCall();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStartCall = (
    callType: "department" | "staff" | "general",
    target: string,
    options?: any,
  ) => {
    let callId: string;
    let callOptions: any = { ...options };

    switch (callType) {
      case "department":
        callId = `${target}-meeting-${Date.now()}`;
        callOptions = {
          title: options?.title || `${target} Department Meeting`,
          participants: options?.participants || [],
          ...options,
        };
        break;

      case "staff":
        callId = `staff-${target}-${Date.now()}`;
        callOptions = {
          title:
            options?.title ||
            `Call with ${options?.targetUser?.name || "Staff Member"}`,
          participants: options?.participants?.length
            ? options.participants
            : [target],
          ...options,
        };
        break;

      case "general":
        callId = `all-staff-meeting-${Date.now()}`;
        callOptions = {
          title: options?.title || "All Staff Meeting",
          participants: options?.participants || [],
          ...options,
        };
        break;

      default:
        console.error("Invalid call type:", callType);
        return;
    }

    console.log("Starting call:", { callId, callType, target, callOptions });

    // Start the call using the existing CallContext
    startCall(callId, callOptions);
  };

  const openCallModal = () => {
    setIsModalOpen(true);
  };

  const closeCallModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 ${className}`}
        onClick={openCallModal}
      >
        <Video className="h-4 w-4" />
        {showText && (customLabel || "Start Call")}
      </Button>

      <CallSelectionModal
        isOpen={isModalOpen}
        onClose={closeCallModal}
        onStartCall={handleStartCall}
        currentDepartment={currentDepartment || user?.department}
      />
    </>
  );
}

// Convenience components for specific use cases
export function DepartmentCallButton({
  department,
  variant = "default",
  size = "default",
  className = "",
}: {
  department: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const { startCall } = useCall();

  const handleDepartmentCall = () => {
    const callId = `${department}-meeting-${Date.now()}`;
    startCall(callId, {
      title: `${department} Department Meeting`,
      participants: [],
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      onClick={handleDepartmentCall}
    >
      <Video className="h-4 w-4" />
      Department Call
    </Button>
  );
}

export function QuickCallButtons({
  department,
  className = "",
}: {
  department?: string;
  className?: string;
}) {
  const { startCall } = useCall();

  const handleVoiceCall = () => {
    const callId = `${department || "general"}-voice-${Date.now()}`;
    startCall(callId, {
      title: `${department || "General"} Voice Call`,
      participants: [],
    });
  };

  const handleVideoCall = () => {
    const callId = `${department || "general"}-video-${Date.now()}`;
    startCall(callId, {
      title: `${department || "General"} Video Call`,
      participants: [],
    });
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        onClick={handleVoiceCall}
        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white gap-2"
      >
        <Phone className="h-4 w-4" />
        Voice Call
      </Button>
      <Button
        onClick={handleVideoCall}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2"
      >
        <Video className="h-4 w-4" />
        Video Call
      </Button>
    </div>
  );
}

export function AllStaffCallButton({
  variant = "default",
  size = "default",
  className = "",
}: {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}) {
  const { startCall } = useCall();

  const handleAllStaffCall = () => {
    const callId = `all-staff-meeting-${Date.now()}`;
    startCall(callId, {
      title: "All Staff Meeting",
      participants: [],
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      onClick={handleAllStaffCall}
    >
      <Users className="h-4 w-4" />
      All Staff Meeting
    </Button>
  );
}
