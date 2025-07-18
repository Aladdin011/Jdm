import { useState, useEffect, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import {
  Award,
  Users,
  MapPin,
  Calendar,
  Target,
  Zap,
  Building,
  Globe,
} from "lucide-react";

// Animated counter component
const AnimatedCounter = ({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, spring, value]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
};

// Image grid component with reveal animation
const ImageGrid = () => {
  const images = [
    {
      src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23f97316'/><text x='200' y='150' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-family='Arial'>Construction Site 1</text></svg>",
      alt: "Modern construction project",
      className: "row-span-2",
    },
    {
      src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23ef4444'/><text x='200' y='150' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-family='Arial'>Solar Installation</text></svg>",
      alt: "Solar panel installation",
      className: "",
    },
    {
      src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23eab308'/><text x='200' y='150' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-family='Arial'>Infrastructure</text></svg>",
      alt: "Infrastructure development",
      className: "",
    },
    {
      src: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%2306b6d4'/><text x='200' y='150' text-anchor='middle' dy='.3em' fill='white' font-size='16' font-family='Arial'>Team Meeting</text></svg>",
      alt: "Team collaboration",
      className: "col-span-2",
    },
  ];

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-4 h-96">
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{
            duration: 0.8,
            delay: index * 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          viewport={{ once: true, margin: "-50px" }}
          className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 group cursor-image ${image.className}`}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="font-semibold">{image.alt}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default function AboutSection() {
  const stats = [
    {
      icon: Building,
      value: 150,
      suffix: "+",
      label: "Projects Completed",
      description: "Successful infrastructure developments across Africa",
    },
    {
      icon: MapPin,
      value: 12,
      label: "States Covered",
      description: "Expanding our footprint across Nigeria",
    },
    {
      icon: Users,
      value: 500,
      suffix: "+",
      label: "Expert Partners",
      description: "Skilled professionals driving excellence",
    },
    {
      icon: Calendar,
      value: 15,
      suffix: "+",
      label: "Years Experience",
      description: "Decades of proven expertise and innovation",
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Excellence in Execution",
      description:
        "Every project is executed with precision, quality, and attention to detail that sets industry standards.",
    },
    {
      icon: Zap,
      title: "Innovative Solutions",
      description:
        "We leverage cutting-edge technology and sustainable practices to deliver future-ready infrastructure.",
    },
    {
      icon: Globe,
      title: "Pan-African Vision",
      description:
        "Building connections and infrastructure that unite communities across the African continent.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* Content Side */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="space-y-6">
              <span
                className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                About JD Marc Limited
              </span>

              <h2
                className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Pioneering Africa's{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                  Infrastructure Revolution
                </span>
              </h2>

              <p
                className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                As a proudly Nigerian company with a pan-African vision, JD Marc
                Limited stands at the forefront of infrastructure development,
                engineering excellence, and sustainable solutions. Our
                unwavering commitment to quality and innovation has made us a
                trusted partner in building the Africa of tomorrow.
              </p>

              <p
                className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                From cutting-edge construction projects to revolutionary solar
                installations, we combine global expertise with local
                understanding to deliver solutions that transform communities
                and drive economic growth across the continent.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div variants={itemVariants} className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold text-slate-800 dark:text-white mb-2"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-slate-600 dark:text-slate-300"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Visual Side */}
          <motion.div variants={itemVariants} className="space-y-8">
            <ImageGrid />
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div
                  className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    prefix=""
                  />
                </div>
                <h3
                  className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.label}
                </h3>
                <p
                  className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
