import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SplitSection from "@/components/ui/SplitSection";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";
import { teamMembers, companyValues, certifications } from "@/data/team";
import {
  Award,
  CheckCircle,
  Leaf,
  Shield,
  Lightbulb,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const valueIcons = {
  award: <Award className="w-8 h-8" />,
  shield: <Shield className="w-8 h-8" />,
  leaf: <Leaf className="w-8 h-8" />,
  lightbulb: <Lightbulb className="w-8 h-8" />,
  "check-circle": <CheckCircle className="w-8 h-8" />,
  handshake: <Users className="w-8 h-8" />,
};

export default function About() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const handleCardFlip = (id: number) => {
    setFlippedCard(flippedCard === id ? null : id);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About JD Marc
            </h1>
            <p className="text-xl text-white/80 mb-8">
              JD Marc is a Nigerian-grown, Pan-African EPC company focused on
              delivering total construction and smart city solutions that
              improve lives and support economic growth. Our experience spans
              roads, buildings, power systems, and innovative urban solutions
              tailored to the realities of African cities.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Company Overview */}
      <SplitSection
        title="Our Vision & Mission"
        subtitle="Building Africa's Future"
        content={
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-3 text-accent">Vision</h3>
              <p className="text-lg">
                To become Africa's most trusted construction partner—delivering
                quality, innovation, and sustainable solutions that shape
                smarter cities and resilient communities.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-accent">Mission</h3>
              <p className="text-lg">
                To provide reliable, cost-effective engineering and construction
                services that meet international standards while solving
                Africa's pressing infrastructure needs.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-accent">Our Story</h3>
              <p>
                Since 2007, JD Marc has grown from a local Nigerian construction
                company to a Pan-African leader in infrastructure development.
                With offices in Abuja, London, and New York, we bring global
                expertise to solve local challenges across the African
                continent.
              </p>
            </div>
          </div>
        }
        image="/images/about1.jpg"
        imageAlt="JD Marc projects across Africa"
      />

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the experienced professionals who guide JD Marc's vision for
              transforming African infrastructure and urban development.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, index) => (
              <AnimatedSection
                key={member.id}
                delay={index * 0.2}
                className="relative"
              >
                <div
                  className={cn(
                    "relative h-[500px] w-full rounded-xl perspective-1000",
                    flippedCard === member.id ? "z-10" : "",
                  )}
                >
                  <motion.div
                    className="w-full h-full transition-all duration-500 preserve-3d cursor-pointer"
                    style={{
                      rotateY: flippedCard === member.id ? 180 : 0,
                    }}
                    onClick={() => handleCardFlip(member.id)}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="h-full bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                        {/* Enhanced Image Section with Gradient Overlay */}
                        <div className="relative h-80 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-arch-charcoal/60 via-transparent to-transparent z-10" />
                          <img
                            src={
                              member.image ||
                              `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80`
                            }
                            alt={member.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://images.unsplash.com/photo-${
                                member.id === 1
                                  ? "1507003211169-0a1dd7228f2d"
                                  : member.id === 2
                                    ? "1472099645785-5658abf4ff4e"
                                    : "1519085360753-af0119f7c6b6"
                              }?w=400&h=400&fit=crop&crop=face&auto=format&q=80`;
                            }}
                          />
                          {/* Professional Badge */}
                          <div className="absolute top-4 right-4 z-20">
                            <div className="bg-arch-orange/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Leadership
                            </div>
                          </div>
                          {/* Bottom Gradient with Name Preview */}
                          <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                            <div className="text-white">
                              <h4 className="font-bold text-lg mb-1 drop-shadow-lg">
                                {member.name}
                              </h4>
                              <p className="text-arch-orange text-sm font-medium drop-shadow-md">
                                {member.title}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-700 dark:to-gray-800">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2 text-arch-charcoal dark:text-white">
                                {member.name}
                              </h3>
                              <p className="text-arch-orange font-medium text-sm">
                                {member.title}
                              </p>
                            </div>
                            <div className="ml-4">
                              <div className="w-10 h-10 bg-arch-orange/10 rounded-full flex items-center justify-center">
                                <motion.div
                                  animate={{
                                    rotate: flippedCard === member.id ? 180 : 0,
                                  }}
                                  transition={{ duration: 0.3 }}
                                  className="text-arch-orange"
                                >
                                  →
                                </motion.div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 italic">
                            Click to read full biography
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute inset-0 backface-hidden bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 [transform:rotateY(180deg)]">
                      <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                      <p className="text-accent font-medium mb-4">
                        {member.title}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide our decisions, shape our culture, and
              define how we approach every project and partnership across
              Africa.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {companyValues.map((value, index) => (
              <AnimatedSection
                key={value.id}
                delay={index * 0.1}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-accent mb-5">
                  {value.icon &&
                    valueIcons[value.icon as keyof typeof valueIcons]}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Global Presence, African Focus
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              With offices across three continents, JD Marc brings international
              expertise to African infrastructure challenges.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                location: "Nigeria (Headquarters)",
                address: "Plot 107, Ahmadu Bello Way, Abuja",
                focus: "Operations & Project Management",
                established: "2007",
              },
              {
                location: "United Kingdom",
                address: "71-75 Shelton Street, London WC2H 9RQ",
                focus: "International Partnerships & Technology",
                established: "2015",
              },
              {
                location: "United States",
                address: "125 Park Avenue, New York, NY 10017",
                focus: "Global Procurement & Investment",
                established: "2020",
              },
            ].map((office, index) => (
              <AnimatedSection
                key={office.location}
                delay={index * 0.2}
                className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-md"
              >
                <h3 className="text-xl font-bold mb-3 text-accent">
                  {office.location}
                </h3>
                <p className="text-muted-foreground mb-4">{office.address}</p>
                <p className="font-medium mb-2">Focus: {office.focus}</p>
                <p className="text-sm text-muted-foreground">
                  Established: {office.established}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Certifications & Standards
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest industry standards through rigorous
              certification and continuous professional development.
            </p>
          </AnimatedSection>

          <div className="flex flex-wrap justify-center gap-8">
            {certifications.map((cert, index) => (
              <AnimatedSection
                key={cert.id}
                delay={index * 0.15}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-md flex flex-col items-center text-center w-64"
              >
                <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {cert.icon === "certificate" && <Award size={32} />}
                  {cert.icon === "award" && <Award size={32} />}
                  {cert.icon === "shield" && <Shield size={32} />}
                  {cert.icon === "building" && <Users size={32} />}
                </div>
                <h3 className="text-lg font-bold mb-2">{cert.name}</h3>
                <p className="text-muted-foreground text-sm">
                  {cert.description}
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
