import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-3">
      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-500">JD Marc is typing</span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
