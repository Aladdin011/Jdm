import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface Props {
  isReady?: boolean;
  brand?: string;
}

export default function LogoReveal({ isReady = false, brand = "" }: Props) {
  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Preparing experience"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] grid place-items-center bg-white dark:bg-neutral-950"
        >
          <div className="flex flex-col items-center">
            <motion.svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: -6, scale: 0.92, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#111827" />
                  <stop offset="1" stopColor="#6B7280" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="48"
                cy="48"
                r="28"
                stroke="url(#g)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="180"
                strokeDashoffset="180"
                animate={{ strokeDashoffset: [180, 60, 0] }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
              <motion.path
                d="M30 48h36"
                stroke="url(#g)"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, delay: 0.6, ease: "easeInOut" }}
              />
            </motion.svg>
            {brand ? (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-4 text-sm tracking-wide text-neutral-900 dark:text-neutral-100"
              >
                {brand}
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
