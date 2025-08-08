import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import AnimatedSection from "./AnimatedSection";

interface SplitSectionProps {
  title: string;
  subtitle?: string;
  content: ReactNode;
  image: string;
  imageAlt: string;
  reversed?: boolean;
  className?: string;
  imageClassName?: string;
}

export default function SplitSection({
  title,
  subtitle,
  content,
  image,
  imageAlt,
  reversed = false,
  className = "",
  imageClassName = "",
}: SplitSectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "grid grid-cols-1 gap-8 items-center",
            reversed ? "lg:grid-cols-[1fr,1.2fr]" : "lg:grid-cols-[1.2fr,1fr]",
          )}
        >
          {/* Content */}
          <AnimatedSection
            direction={reversed ? "right" : "left"}
            className={cn(reversed && "lg:order-2")}
          >
            <div className="max-w-xl">
              {subtitle && (
                <p className="text-accent font-medium mb-2">{subtitle}</p>
              )}
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
              <div className="prose dark:prose-invert max-w-none">
                {content}
              </div>
            </div>
          </AnimatedSection>

          {/* Image */}
          <AnimatedSection
            direction={reversed ? "left" : "right"}
            className={cn(reversed && "lg:order-1")}
            delay={0.2}
          >
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <img
                src={image}
                alt={imageAlt}
                className={cn("w-full h-auto object-cover", imageClassName)}
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
