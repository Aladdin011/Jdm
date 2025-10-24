import React from "react";
import { motion } from "framer-motion";
import { Github, Mail } from "lucide-react";

interface Props {
  onGoogle?: () => void;
  onGithub?: () => void;
}

export default function SocialAuthButtons({ onGoogle, onGithub }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3" aria-label="Social sign in options">
      <motion.button
        type="button"
        onClick={onGoogle}
        className="h-10 rounded-xl bg-white/5 text-white/90 hover:bg-white/10 transition-colors ring-1 ring-white/10 flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
      >
        <Mail className="h-4 w-4" /> Google
      </motion.button>
      <motion.button
        type="button"
        onClick={onGithub}
        className="h-10 rounded-xl bg-white/5 text-white/90 hover:bg-white/10 transition-colors ring-1 ring-white/10 flex items-center justify-center gap-2"
        whileTap={{ scale: 0.98 }}
      >
        <Github className="h-4 w-4" /> Github
      </motion.button>
    </div>
  );
}
