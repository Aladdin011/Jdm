import { useEffect } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

type LoaderProps = {
  isReady?: boolean; // exit when true
  brand?: string; // optional brand text
  showBrandAfterMs?: number; // when to reveal brand text
};

export default function Loader({
  isReady = false,
  brand = "JD MARC LIMITED",
  showBrandAfterMs = 1500,
}: LoaderProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.start("enter");
  }, [controls]);

  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent"
        >
          {/* Subtle ambient background */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(60% 60% at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.65) 100%)",
              backdropFilter: "blur(6px)",
            }}
          />
          {/* Gradient sweep synchronized motion */}
          <motion.div
            aria-hidden
            className="absolute inset-0"
            initial={{ x: "-30%" }}
            animate={{ x: "30%" }}
            transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
            style={{
              background:
                "linear-gradient(90deg, rgba(255,165,0,0.08) 0%, rgba(80,160,255,0.08) 100%)",
              filter: "blur(18px)",
              opacity: 0.9,
              pointerEvents: "none",
            }}
          />

          {/* Center icon + premium ring */}
          <motion.div
            variants={{ enter: { scale: 1, opacity: 1 } }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={controls}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative flex flex-col items-center"
          >
            {/* 3D container */}
            <motion.div
              style={{ width: 160, height: 160, perspective: 700 }}
              initial={{ rotateX: 12, rotateY: -12, rotateZ: 0 }}
              animate={{ rotateX: [12, -8, 12], rotateY: [-12, 10, -12], rotateZ: [0, 6, 0] }}
              transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
              className="relative"
            >
              {/* Outer rotating premium ring */}
              <motion.svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                className="absolute top-0 left-0 drop-shadow-[0_6px_30px_rgba(255,165,0,0.35)]"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <defs>
                  <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,165,0,0.85)" />
                    <stop offset="100%" stopColor="rgba(80,160,255,0.85)" />
                  </linearGradient>
                </defs>
                <circle cx="80" cy="80" r="54" fill="none" stroke="url(#ring)" strokeWidth="10" strokeLinecap="round" strokeDasharray="280" strokeDashoffset="60" />
              </motion.svg>

              {/* Center PNG icon (from public/images/brand/3D Icon.PNG) */}
              <motion.img
                src="/images/brand/3D%20Icon.PNG"
                alt="Brand Icon"
                width={96}
                height={96}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                initial={{ scale: 0.92, opacity: 0.9 }}
                animate={{ scale: [0.92, 1.02, 0.98, 0.92], opacity: 1 }}
                transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
              />

              {/* Minimal beam motif */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0.7, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div
                  style={{
                    width: 80,
                    height: 12,
                    borderRadius: 12,
                    background: "linear-gradient(90deg, rgba(255,165,0,0.85), rgba(80,160,255,0.85))",
                    boxShadow: "0 10px 30px rgba(255,165,0,0.35), 0 10px 30px rgba(80,160,255,0.25)",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut", delay: showBrandAfterMs / 1000 }}
              className="mt-6 text-white/90 text-sm tracking-wide"
            >
              {brand}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
