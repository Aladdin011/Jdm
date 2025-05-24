import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface ProjectCardProps {
  id: number;
  title: string;
  category: string;
  image: string;
  onClick: () => void;
  className?: string;
}

export default function ProjectCard({
  title,
  category,
  image,
  onClick,
  className,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-lg cursor-pointer shadow-md",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 flex flex-col justify-end"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: isHovered ? 0.85 : 0.6 }}
        transition={{ duration: 0.3 }}
      >
        <Badge className="self-start mb-2 bg-accent text-white">
          {category}
        </Badge>
        <h3 className="text-white text-xl font-bold mb-2">{title}</h3>

        <motion.div
          className="flex items-center gap-2 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
        >
          <Eye size={16} />
          <span className="text-sm font-medium">View Details</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
