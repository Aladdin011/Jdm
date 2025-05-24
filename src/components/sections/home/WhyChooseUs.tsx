import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { companyMilestones } from "@/data/team";

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            With nearly two decades of experience, we've built a reputation for
            excellence, reliability, and innovation in the construction
            industry.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Quality Excellence",
              description:
                "We never compromise on quality. Every project, regardless of size, receives the same commitment to excellence.",
              icon: "📊",
            },
            {
              title: "Experienced Team",
              description:
                "Our team of industry professionals brings decades of combined experience to every project.",
              icon: "👷‍♂️",
            },
            {
              title: "Innovation",
              description:
                "We embrace the latest technologies and methods to deliver better buildings more efficiently.",
              icon: "💡",
            },
          ].map((item, index) => (
            <AnimatedSection
              key={item.title}
              delay={index * 0.2}
              className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </AnimatedSection>
          ))}
        </div>

        <div ref={containerRef} className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">Our Journey</h3>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-accent/30 z-0"></div>

            {/* Milestone Items */}
            <div className="relative z-10">
              {companyMilestones.map((milestone, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={milestone.year}
                    className={cn(
                      "flex items-center mb-16 last:mb-0",
                      isEven ? "flex-row" : "flex-row-reverse",
                    )}
                  >
                    {/* Content */}
                    <motion.div
                      className={cn(
                        "w-5/12",
                        isEven ? "text-right pr-8" : "text-left pl-8",
                      )}
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      animate={
                        isInView
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: isEven ? -50 : 50 }
                      }
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                        <h4 className="text-xl font-bold mb-2 text-accent">
                          {milestone.year}
                        </h4>
                        <h5 className="text-lg font-medium mb-2">
                          {milestone.title}
                        </h5>
                        <p className="text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>
                    </motion.div>

                    {/* Center Point */}
                    <motion.div
                      className="w-2/12 flex justify-center"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </motion.div>

                    {/* Empty Space for the other side */}
                    <div className="w-5/12"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
