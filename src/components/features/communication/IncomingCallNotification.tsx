import { motion, AnimatePresence } from "framer-motion";
import { useCall } from "@/contexts/CallContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneOff, Video, User, Users } from "lucide-react";

export default function IncomingCallNotification() {
  const { callState, acceptIncomingCall, declineIncomingCall } = useCall();

  if (!callState.incomingCall) return null;

  const { from, department } = callState.incomingCall;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        style={{ zIndex: 9998 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#142E54] to-[#F97316] p-6 text-white text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <User size={32} />
            </motion.div>

            <h2 className="text-xl font-bold mb-2">Incoming Call</h2>
            <Badge className="bg-white/20 text-white">
              {department?.replace("-", " ").toUpperCase()} DEPARTMENT
            </Badge>
          </div>

          {/* Caller Info */}
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {from.name}
            </h3>
            <p className="text-gray-600 mb-1">{from.email}</p>
            <p className="text-sm text-gray-500 mb-6">
              {from.department?.replace("-", " ")} Department
            </p>

            <div className="flex items-center justify-center gap-2 mb-6 text-gray-600">
              <Video size={16} />
              <span className="text-sm">Video Call</span>
              <Users size={16} className="ml-2" />
              <span className="text-sm">Department Meeting</span>
            </div>

            {/* Call Animation */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 bg-[#F97316]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Phone size={24} className="text-[#F97316]" />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center p-6 pt-0 gap-4">
            <Button
              onClick={declineIncomingCall}
              variant="outline"
              className="flex-1 h-14 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <PhoneOff size={20} className="mr-2" />
              Decline
            </Button>

            <Button
              onClick={acceptIncomingCall}
              className="flex-1 h-14 bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone size={20} className="mr-2" />
              Accept
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 px-6 py-3 text-center">
            <p className="text-xs text-gray-500">
              This call will connect you with your{" "}
              {department?.replace("-", " ")} department team
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
