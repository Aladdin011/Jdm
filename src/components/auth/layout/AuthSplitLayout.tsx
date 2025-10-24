import React, { PropsWithChildren } from "react";
import { motion } from "framer-motion";

interface StepItem {
  label: string;
  active?: boolean;
}

interface AuthSplitLayoutProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  steps?: StepItem[];
  brand?: string;
  gradientImageUrl?: string;
}

export default function AuthSplitLayout({
  children,
  title,
  subtitle = "",
  steps = [],
  brand = "JD Marc",
  gradientImageUrl,
}: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10">
        <div className="grid grid-cols-1 gap-0 rounded-3xl overflow-hidden bg-neutral-950 ring-1 ring-white/10 lg:grid-cols-2">
          {/* Left panel */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 p-6">
              <div className="h-full w-full rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-400/40 via-purple-600/30 to-black" />
                {gradientImageUrl ? (
                  <img
                    src={gradientImageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-60"
                    aria-hidden
                  />
                ) : null}
                <div className="relative z-10 h-full w-full p-8 flex flex-col justify-end">
                  <div className="mb-auto" />
                  <div className="space-y-4">
                    <div className="text-sm text-white/80">{brand}</div>
                    <h2 className="text-3xl font-semibold leading-tight">Get Started with Us</h2>
                    <p className="text-white/70 text-sm max-w-sm">
                      Complete these easy steps to register your account.
                    </p>
                    <div className="space-y-3 pt-2">
                      {steps.map((s, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                            s.active ? "bg-white text-black" : "bg-white/10 text-white/80"
                          }`}
                        >
                          <div
                            className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold ${
                              s.active ? "bg-black text-white" : "bg-white/20"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <span className="truncate">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="bg-neutral-950 px-6 py-8 sm:px-10 lg:px-12">
            <div className="mx-auto max-w-md">
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-xl font-semibold tracking-tight"
              >
                {title}
              </motion.h1>
              {subtitle ? (
                <p className="mt-1 text-white/70 text-sm">{subtitle}</p>
              ) : null}
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
