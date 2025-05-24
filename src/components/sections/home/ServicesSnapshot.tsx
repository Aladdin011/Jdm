import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Building2, Home, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import AnimatedSection from "@/components/ui/AnimatedSection";

const services = [
  {
    title: "Residential Construction",
    description:
      "Custom homes and residential complexes built to the highest standards of quality and craftsmanship.",
    icon: Home,
    link: "/services",
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Commercial Buildings",
    description:
      "State-of-the-art commercial spaces designed for functionality, efficiency, and lasting value.",
    icon: Building2,
    link: "/services",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Infrastructure Projects",
    description:
      "Critical infrastructure built with precision, safety, and longevity in mind for communities and cities.",
    icon: Landmark,
    link: "/services",
    color: "bg-accent/10 text-accent",
  },
];

export default function ServicesSnapshot() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services-section" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive construction services across residential,
            commercial, and infrastructure sectors, delivering excellence at
            every stage of the building process.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection
              key={service.title}
              delay={index * 0.2}
              direction="up"
            >
              <motion.div
                className={cn(
                  "h-full bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300",
                  hoveredIndex === index ? "scale-[1.03]" : "scale-100",
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-lg flex items-center justify-center mb-6",
                    service.color,
                  )}
                >
                  <service.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>
                <Button
                  asChild
                  variant="ghost"
                  className="p-0 hover:bg-transparent text-accent hover:text-accent/80 font-medium"
                >
                  <Link to={service.link}>Learn More</Link>
                </Button>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-accent hover:bg-accent/90 text-white">
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
