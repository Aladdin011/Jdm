import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface Props {
  isReady?: boolean;
  brand?: string;
}

export default function MinimalDots({ isReady = false, brand = "" }: Props) {
  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-neutral-950"
        >
          <div className="flex items-center gap-2" aria-hidden>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              />
            ))}
          </div>
          {brand ? (
            <motion.div
              className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 tracking-wide"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
            >
              {brand}
            </motion.div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
