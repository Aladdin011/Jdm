import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import React, { useEffect, useState } from "react";

interface Props {
  isReady?: boolean;
  brand?: string;
}

export default function ProgressBarSplash({ isReady = false, brand = "" }: Props) {
  const controls = useAnimationControls();
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    controls.start("enter");
  }, [controls]);

  // Simulated progressive fill while bootstrapping
  useEffect(() => {
    if (isReady) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(96, p + Math.max(1, (96 - p) * 0.08)));
    }, 120);
    return () => clearInterval(id);
  }, [isReady]);

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Loading application"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-neutral-950"
        >
          <motion.div
            variants={{ enter: { opacity: 1, y: 0 } }}
            initial={{ opacity: 0, y: 8 }}
            animate={controls}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-[min(520px,90vw)]"
          >
            <div className="text-center mb-3 select-none">
              <span className="text-sm font-medium tracking-wide text-neutral-800 dark:text-neutral-100">Launching</span>
            </div>
            <div className="h-2 rounded-full bg-neutral-200/80 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-neutral-900 dark:bg-white"
                style={{ width: `${progress}%` }}
                transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.3 }}
              />
            </div>
            {brand ? (
              <div className="mt-3 text-center text-xs text-neutral-500 dark:text-neutral-400">{brand}</div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
